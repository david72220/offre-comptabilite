import React, { useState } from 'react';
import './MatriceAudit.css';

interface AuditForm {
  businessType: string;
  invoicesPerMonth: string;
  currentTools: string[];
  painPoints: string[];
}

const steps = [
  {
    id: 'businessType',
    question: 'Quel type d’activité exercez-vous ?',
    type: 'select',
    options: ['Artisan', 'Commerce', 'Profession libérale', 'BTP', 'Autre'],
  },
  {
    id: 'invoicesPerMonth',
    question: 'Combien de factures émettez-vous chaque mois ?',
    type: 'select',
    options: ['1 à 30', '31 à 150', '150 et plus'],
  },
  {
    id: 'currentTools',
    question: 'Quels outils utilisez-vous aujourd’hui ?',
    type: 'checkbox',
    options: ['Excel', 'Paper', 'Logiciel de comptabilité', 'Aucun'],
  },
  {
    id: 'painPoints',
    question: 'Quelles sont vos principales difficultés ?',
    type: 'checkbox',
    options: ['Impayés', 'Pas de visibilité sur la trésorerie', 'Trop de travail manuel', 'Inquiétudes réglementaires', 'Autre'],
  },
];

const recommendations: Record<string, { stack: string; slug: string; label: string }> = {
  'BTP': { stack: 'D', slug: '/stack-d/', label: 'Stack D — BTP Artisan chantier' },
  '150 et plus': { stack: 'C', slug: '/stack-c/', label: 'Stack C — Commerciale intégrée' },
  '31 à 150': { stack: 'B', slug: '/stack-b/', label: 'Stack B — Confort TPE' },
  default: { stack: 'A', slug: '/stack-a/', label: 'Stack A — Essentiel Solo' },
};

const webhookUrl = import.meta.env.PUBLIC_N8N_WEBHOOK_URL || '';

export default function MatriceAudit() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<AuditForm>({
    businessType: '',
    invoicesPerMonth: '',
    currentTools: [],
    painPoints: [],
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [result, setResult] = useState<{ stack: string; slug: string; label: string } | null>(null);

  const current = steps[step];

  const isStepValid = () => {
    if (current.type === 'select') {
      return (form as unknown as Record<string, string>)[current.id] !== '';
    }
    return (form as unknown as Record<string, string[]>)[current.id].length > 0;
  };

  const handleSelect = (value: string) => {
    setForm((prev) => ({ ...prev, [current.id]: value }));
  };

  const handleCheckbox = (value: string) => {
    setForm((prev) => {
      const key = current.id as keyof AuditForm;
      const values = prev[key] as string[];
      if (values.includes(value)) {
        return { ...prev, [key]: values.filter((v) => v !== value) };
      }
      return { ...prev, [key]: [...values, value] };
    });
  };

  const next = () => {
    if (!isStepValid()) return;
    if (step < steps.length - 1) setStep((s) => s + 1);
  };

  const prev = () => setStep((s) => Math.max(0, s - 1));

  const submit = async () => {
    if (!isStepValid()) return;
    setStatus('submitting');

    const payload = {
      submittedAt: new Date().toISOString(),
      source: window.location.href,
      ...form,
    };

    try {
      if (webhookUrl) {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      const recommendation =
        recommendations[form.businessType] ||
        recommendations[form.invoicesPerMonth] ||
        recommendations.default;

      setResult(recommendation);
      setStatus('success');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  const reset = () => {
    setStep(0);
    setForm({ businessType: '', invoicesPerMonth: '', currentTools: [], painPoints: [] });
    setStatus('idle');
    setResult(null);
  };

  if (status === 'success' && result) {
    return (
      <div className="audit-card">
        <div className="audit-success">
          <div className="audit-icon">✓</div>
          <h3 className="audit-result-title">Merci pour votre audit</h3>
          <p className="audit-result-text">
            D’après vos réponses, l’offre la mieux adaptée à votre situation est :
          </p>
          <div className="audit-recommendation">
            <span className="audit-stack-badge">{result.stack}</span>
            <span>{result.label}</span>
          </div>
          <div className="audit-actions">
            <a href={result.slug} className="audit-btn-primary">
              Découvrir l’offre
            </a>
            <a href="/livrables/" className="audit-btn-secondary">
              Voir les livrables
            </a>
          </div>
          <button type="button" className="audit-link" onClick={reset}>
            Recommencer l’audit
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="audit-card">
      <div className="audit-header">
        <div className="audit-progress">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`audit-step-dot ${i <= step ? 'active' : ''} ${i < step ? 'completed' : ''}`}
            />
          ))}
        </div>
        <p className="audit-step-label">
          Étape {step + 1} sur {steps.length}
        </p>
        <h3 className="audit-question">{current.question}</h3>
      </div>

      <div className="audit-body">
        {current.type === 'select' ? (
          <div className="audit-options" role="radiogroup" aria-label={current.question}>
            {current.options.map((option) => {
              const selected = (form as unknown as Record<string, string>)[current.id] === option;
              return (
                <button
                  key={option}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  className={`audit-option ${selected ? 'selected' : ''}`}
                  onClick={() => handleSelect(option)}
                >
                  {option}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="audit-options" role="group" aria-label={current.question}>
            {current.options.map((option) => {
              const selected = (form as unknown as Record<string, string[]>)[current.id].includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  role="checkbox"
                  aria-checked={selected}
                  className={`audit-option ${selected ? 'selected' : ''}`}
                  onClick={() => handleCheckbox(option)}
                >
                  <span className="audit-check" aria-hidden="true">
                    {selected ? '☑' : '☐'}
                  </span>
                  {option}
                </button>
              );
            })}
          </div>
        )}

        {status === 'error' && (
          <p className="audit-error" role="alert">
            Une erreur est survenue lors de l’envoi. Vous pouvez réessayer ou nous contacter directement.
          </p>
        )}
      </div>

      <div className="audit-footer">
        {step > 0 && (
          <button type="button" className="audit-btn-secondary" onClick={prev}>
            Précédent
          </button>
        )}
        {step < steps.length - 1 ? (
          <button
            type="button"
            className="audit-btn-primary"
            disabled={!isStepValid()}
            onClick={next}
          >
            Suivant
          </button>
        ) : (
          <button
            type="button"
            className="audit-btn-primary"
            disabled={!isStepValid() || status === 'submitting'}
            onClick={submit}
          >
            {status === 'submitting' ? 'Envoi en cours…' : 'Voir ma recommandation'}
          </button>
        )}
      </div>
    </div>
  );
}
