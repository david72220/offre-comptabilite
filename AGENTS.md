# Offre Comptabilité — Site Vitrine Alliance Digitale

**Dernière mise à jour :** 10 juillet 2026
**Statut :** ✅ En ligne — https://offre-comptabilite.vercel.app

---

## État d'avancement

| Composant | Statut | Détail |
|---|---|---|
| **8 pages** | ✅ Déployé | index, stack-a/b/c/d, livrables, mentions-legales, politique-confidentialite |
| **Design Alliance** | ✅ Déployé | Thème sombre #070d18, relief-panels, fiber-pulse, header/footer |
| **Formulaire audit** | 🟡 En cours | MatriceAudit 5 étapes — erreur d'envoi webhook à corriger |
| **Résultat audit** | ❌ À corriger | Affichage du résultat court non visible après soumission |
| **Webhook N8N** | ❌ À configurer | Workflow audit-tpe-workflow.json à importer dans N8N |
| **Variables Vercel** | ✅ Configuré | PUBLIC_N8N_WEBHOOK_URL + PUBLIC_AUDIT_API_KEY |
| **Check-up sécurité** | ✅ Validé | Pas de secrets en dur, .env dans .gitignore |

---

## Architecture

- **Framework** : Astro 5 + React (MatriceAudit.tsx en client:only)
- **Style** : Tailwind CSS v4 + global.css avec design system Alliance
- **Build** : Statique (SSG), 8 pages HTML
- **Déploiement** : Vercel, projet `offre-comptabilite`, repo `david72220/offre-comptabilite`
- **Fonts** : Inter, Playfair Display, Space Grotesk, Great Vibes (Google Fonts)

## Design System Alliance

| Variable | Valeur | Usage |
|---|---|---|
| `--color-alliance-dark` | `#070d18` | Fond principal |
| `--color-alliance-dark-2` | `#0B1120` | Fond alterné (sections) |
| `--color-alliance-blue` | `#3b97d3` | Accent bleu principal |
| `--color-alliance-orange` | `#9E2114` | Accent orange (CTA, badges) |
| `font-script` | Great Vibes | Titres décoratifs |
| `font-serif` | Playfair Display | Titres h1/h2 |
| `font-display` | Space Grotesk | Sous-titres, labels |

### Classes réutilisables
- `.relief-panel` — Carte flottante avec bordure conic-gradient
- `.relief-1`, `.relief-2` — Hover lift effects
- `.fiber-pulse`, `.fiber-pulse--slow`, `.fiber-pulse--fast` — Animation bordure lumineuse
- `.gradient-text` — Texte dégradé bleu → orange
- `.btn-primary` — Bouton CTA orange gradient
- `.btn-secondary` — Bouton secondaire transparent
- `.tab-btn`, `.tab-panel`, `.tab-content` — Onglets stacks
- `.course-content` — Styles markdown contenu pédagogique
- `.audit-card`, `.audit-option`, etc. — Formulaire MatriceAudit

## Tarifs (NE PAS MODIFIER)

| Stack | Prix | Détail |
|---|---|---|
| A — Essentiel Solo | 690 € HT | formation 1h comprise |
| B — Confort TPE | 690 € HT + 600 € HT | formation 1 journée |
| C — Commerciale intégrée | 1 590 € HT + 1 200 € HT | formation 2 jours |
| D — BTP Artisan chantier | 890 € HT | formation 2h comprise |

## Formulaire Audit (MatriceAudit.tsx)

5 étapes :
1. Type d'activité (Artisan / Commerce / Profession libérale / BTP / Autre)
2. Volume factures par mois (< 30 / 30-100 / > 100)
3. Outils actuels (Aucun / Tableur / Logiciel comptable / ERP)
4. Points de douleur (Facturation / Trésorerie / TVA / Relances / Organisation)
5. Coordonnées (Nom, Email, Entreprise, Téléphone)

POST vers `PUBLIC_N8N_WEBHOOK_URL` avec payload `{ contact: { nom, email, entreprise, telephone }, answers: { ... }, reco: { stack, confidence } }`

### Bugs connus
- **Erreur d'envoi** : le webhook retourne une erreur (CORS ou 401/403) → vérifier le endpoint N8N
- **Résultat non affiché** : après soumission, le résultat court (stack recommandée) ne s'affiche pas

## Webhook N8N

- Workflow : `n8n/audit-tpe-workflow.json`
- Endpoint : `https://n8n.srv1179315.hstgr.cloud/webhook/audit-tpe`
- Credentials nécessaires : Notion API, Brevo SMTP, Header Auth (API Key)
- À importer manuellement dans l'interface N8N

## Déploiement

```bash
# Build local
npm run build

# Commit + push
git add -A && git commit -m "feat: description" && git push origin main

# Déployer sur Vercel
npx vercel@latest --prod --yes

# Variables d'environnement Vercel (déjà configurées)
# PUBLIC_N8N_WEBHOOK_URL=https://n8n.srv1179315.hstgr.cloud/webhook/audit-tpe
# PUBLIC_AUDIT_API_KEY=***
```

## ⚠️ Règles critiques

1. **Jamais déployer sur Alliance-digitale** — projet Vercel séparé `offre-comptabilite`
2. **Ne pas copier le site Alliance** — construire depuis le CLAUDE.md, pas depuis le code existant
3. **CLAUDE.md ne doit JAMAIS être pushé sur GitHub** — ajouter à .gitignore
4. **Prix exacts** — ne jamais arrondir ou modifier les tarifs ci-dessus
5. **Contenu FR** — Agent F (mistral-large-3) obligatoire avant publication
6. **Check-up sécurité** avant chaque push — vérifier secrets, console.log, build
7. **Connexion Notion** — DB Prospects configurée dans le workflow N8N

## Structure du projet

```
site/
├── src/
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── MatriceAudit.tsx       # Formulaire 5 étapes (React)
│   │   └── MatriceAudit.css       # Styles formulaire audit
│   ├── layouts/
│   │   └── Layout.astro           # Header + Footer + fonts
│   ├── pages/
│   │   ├── index.astro            # Landing (hero + audit + offres + CTA)
│   │   ├── stack-a.astro          # Fiche Essentiel Solo
│   │   ├── stack-b.astro          # Fiche Confort TPE
│   │   ├── stack-c.astro          # Fiche Commerciale intégrée
│   │   ├── stack-d.astro          # Fiche BTP Artisan chantier
│   │   ├── livrables.astro        # Galerie 9 livrables
│   │   ├── mentions-legales.astro
│   │   └── politique-de-confidentialite.astro
│   └── styles/
│       └── global.css             # Tailwind v4 + design system Alliance
├── astro.config.mjs
├── package.json
├── .env                            # PUBLIC_N8N_WEBHOOK_URL + PUBLIC_AUDIT_API_KEY
├── .gitignore
└── CLAUDE.md                       # CE FICHIER — local only, ne pas pousser
```