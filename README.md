# EverPoint Marketing Website

Standalone marketing site for [everpoint.ca](https://everpoint.ca).

## Stack

- Vite + React 19 + React Router 7 + Tailwind v4

## Development

```bash
npm install
npm run dev
```

Opens at http://127.0.0.1:5174 by default.

## Build & deploy

```bash
npm run build
```

Deploys to Firebase Hosting site `everpoint-marketing` (custom domain `everpoint.ca`) on push to `main`.

## Links to the app

Portal and product installs link out to:

- `https://portal.everpoint.ca`
- `https://everflow.everpoint.ca`
- `https://everfield.everpoint.ca`

The backend (Cloud Functions, Firestore) stays in the main `everpoint` repo.
