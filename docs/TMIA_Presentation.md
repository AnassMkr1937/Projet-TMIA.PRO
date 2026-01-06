# TMIA Psycho-Quest — Présentation Technique

---

## 1) Titre

**TMIA Psycho-Quest (TMIA PRO)**

Court pitch: Application interactive qui combine réponses et signaux comportementaux pour profiler des personas, visualiser les résultats et générer un rapport PDF professionnel.

Notes:
- Objectif pour l'auditoire : expliquer l'architecture, le flux de données, le rendu et le scoring.

---

## 2) Contexte & Objectifs

- Contexte : aide les équipes produits/design à segmenter les utilisateurs selon leur comportement face à l'IA en mode/produit.
- Objectifs :
  - Capturer réponses + métriques comportementales
  - Déduire un persona (visionnaire/prudent/créatif/pragmatique/traditionnel)
  - Fournir visualisations (radar) et rapport PDF exportable
  - Préparer un pipeline prêt à mettre en production

Notes:
- Mettre l'accent sur la valeur: combiner contenu + comportement augmente la robustesse du profil.

---

## 3) Stack Technique

- Frontend : React 18 + Vite
- Visualisation : Recharts (Radar chart)
- PDF : jsPDF + html2canvas
- Backend : Node.js + Express
- Dev tooling : npm, Vite, esbuild (via Vite)
- Stockage demo : in-memory (remplacer par Mongo/Postgres pour prod)

Notes:
- Expliquez pourquoi Recharts (simple, responsive) et jsPDF (génération client-side rapide).

---

## 4) Diagramme d'Architecture (simplifié)

User (Browser)
  ├─> Frontend (React + Vite)
  │     ├─ collecte: answers, responseTimes, mouseMovements, changes
  │     ├─ visualise: `ProRadarChart`, `PDFReportPreview`
  │     └─ POST /api/submit -> Backend
  └─> Backend (Express)
        ├─ computeFinalScore(payload) -> scoring.js
        ├─ store (DEMO: memory DB)
        └─ renvoie résultat JSON

Notes:
- Mettre l'accent sur la séparation responsabilités: UI vs scoring.

---

## 5) Flux de Données (end-to-end)

1. L'utilisateur répond au quiz dans `App.jsx`.
2. Le frontend collecte : `answers[]`, `responseTimes[]`, `mouseMovements[]`, `answerChanges`.
3. À la fin, frontend construit `payload` et envoie POST `/api/submit`.
4. Backend exécute `computeFinalScore(payload)` et renvoie :
   `{ persona, confidence, scores, normalized, marketSegment, recommendation, metadata }`.
5. Frontend affiche via `PDFReportPreview` et `ProRadarChart` et propose un PDF via `PDFReportButton`.

Notes:
- Expliquer la structure JSON du `payload` et du `result`.

---

## 6) Fichiers Clés & Rôles

- `frontend/src/App.jsx` : orchestration, collecte métriques, transitions
- `frontend/src/translations.js` : i18n FR/EN/AR, forces/faiblesses/fit
- `frontend/src/components/ProRadarChart.jsx` : radar chart Recharts
- `frontend/src/components/PDFReport.jsx` : preview formatée + export PDF
- `frontend/src/components/Heatmap.jsx` : ancienne heatmap (canvas)
- `backend/index.js` : routes API, static serving
- `backend/scoring.js` : algorithme de scoring (explainable)

Notes:
- Lors de la démo, montrer rapidement `ProRadarChart` et `PDFReportPreview`.

---

## 7) Exemple de payload envoyé (format)

```json
{
  "sessionId": "test-123",
  "timestamp": "2026-01-02T00:00:00.000Z",
  "language": "fr",
  "answers": [
    {"s":{"visionnaire":3},"questionIndex":0,"timeMs":2000,"changes":0},
    {"s":{"creatif":2},"questionIndex":1,"timeMs":4500,"changes":1}
  ],
  "metrics": {
    "perQuestion": [{"q":1,"timeMs":2000,"changes":0}],
    "mouseMovementCount": 220,
    "avgResponseTimeMs": 6000,
    "totalTime": 30500
  }
}
```

Notes:
- Montrer comment `computeFinalScore` utilise `answers` et `metrics`.

---

## 8) Détails du Scoring (résumé)

- `scoreFromAnswers`: additionne les poids fournis par chaque option (mapping simple dans `getQuestions`).
- `scoreFromBehavior`: calcule signaux comportementaux (avgTime, mouse activity, changes). Applique des bonus aux personas.
- Fusion dynamique : pondère answers vs behavior selon force signal behavior.
- Normalisation et calcul de `confidence` et `marketSegment`.

Notes:
- Mentionner l'importance d'un jeu de tests unitaires sur `scoring.js`.

---

## 9) Exécution Locale (Quick Start)

1. Frontend dev

```bash
cd frontend
npm install
npm run dev
# ouvrir http://localhost:<vite-port>
```

2. Build + serve via backend

```bash
cd frontend
npm run build
cd ../backend
node index.js
# ouvrir http://localhost:4000
```

3. Tester l'API

```powershell
# PowerShell
$payload = Get-Content .\\test-payload.json -Raw
Invoke-RestMethod -Uri 'http://localhost:4000/api/submit' -Method Post -ContentType 'application/json' -Body $payload
```

Notes:
- Toujours vérifier le port indiqué par Vite (il bascule si ports occupés).

---

## 10) Tests & Validation

- Unit: `computeFinalScore` (Jest/Mocha)
- Integration: POST `/api/submit` avec fixtures
- E2E: parcours quiz → result (Cypress / Playwright)

Notes:
- Fournir fixtures de payloads représentatifs (early-adopter vs conservative).

---

## 11) Sécurité & Production

- Valider/sanitiser payload (Joi/Zod)
- Persister dans DB (Mongo/Postgres)
- Auth & RBAC pour endpoints admin
- Rate limiting, CORS, HTTPS, logging centralisé

Notes:
- Préconiser stockage chiffré si données PII.

---

## 12) Roadmap & Améliorations

- Persist DB + dashboard admin complet
- Contrôle des poids du scoring depuis l'admin
- Tests automatisés + CI (GitHub Actions)
- Monitoring (Sentry/Prometheus)
- Améliorer performance bundle (code splitting)

Notes:
- Prioriser: DB + tests unitaires pour scoring.

---

## 13) Démo proposée (3 minutes)

1. Lancer `npm run dev` → ouvrir l'app
2. Répondre au quiz rapidement (3-4 min)
3. Observer la page `result` : `ProRadarChart`, `PDFReportPreview`
4. Télécharger le PDF

Notes:
- Mettre en avant la conversion comportementale → persona.

---

## 14) Annexes & Liens

- Frontend: `frontend/src` — `App.jsx`, `components/`, `translations.js`
- Backend: `backend/` — `index.js`, `scoring.js`
- Commandes utiles: voir section Exécution Locale

Notes:
- Je peux générer un fichier README.md basé sur ce contenu.

---


*Fin de la présentation*  

