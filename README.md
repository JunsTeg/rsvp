# Plateforme RSVP — SETECT Exclusive Event

> Plateforme de gestion des confirmations de présence pour l'événement **Cyber Résilience & Fiscalité en Zone CEMAC** — 18 Juin 2026, Douala.

---

## Aperçu

Application web fullstack (React + Express) permettant aux invités de confirmer ou décliner leur présence à l'événement SETECT, avec un tableau de bord administrateur complet pour suivre les réponses en temps réel.

---

## Fonctionnalités

### Côté public
- Page d'accueil avec bannière de l'événement aux couleurs SETECT
- Compte à rebours temps réel jusqu'au 18 Juin 2026
- Formulaire RSVP (Nom, Entreprise, Fonction, Email)
- Double choix : **Confirmer ma présence** / **Je ne pourrai pas être présent(e)**
- Page de confirmation personnalisée post-soumission
- Email automatique de confirmation envoyé à l'invité
- Protection anti-spam : honeypot + rate limiting
- Design responsive mobile-first

### Tableau de bord administrateur
- Authentification sécurisée (JWT, session 8h)
- KPIs en temps réel : total invités, confirmations, refus, taux de participation
- Recherche par nom, email ou entreprise
- Filtres : Tous / Confirmés / Absents
- Pagination (15 réponses par page)
- Export **Excel (.xlsx)** et **CSV**
- Suppression d'une entrée
- Notification email à chaque nouvelle réponse

---

## Stack technique

| Couche | Technologies |
|---|---|
| Frontend | React 18, Vite, TypeScript, Tailwind CSS v4, Framer Motion |
| Backend | Express.js, Node.js, TypeScript |
| Base de données | SQLite via Prisma ORM |
| Authentification | JWT (jose) + bcryptjs |
| Emails | Nodemailer (SMTP Gmail) |
| Export | SheetJS (xlsx) |
| Qualité code | ESLint, Prettier, TypeScript strict |

---

## Structure du projet

```
Plateforme-SETEC/
├── client/                        # Frontend React + Vite
│   ├── src/
│   │   ├── components/
│   │   │   ├── Countdown.tsx      # Compte à rebours temps réel
│   │   │   ├── ProtectedRoute.tsx # Guard route admin
│   │   │   ├── RSVPForm.tsx       # Formulaire de réponse
│   │   │   └── SetectLogo.tsx     # Logo SVG SETECT
│   │   ├── pages/
│   │   │   ├── HomePage.tsx       # Page principale publique
│   │   │   ├── ConfirmationPage.tsx
│   │   │   ├── AdminLoginPage.tsx
│   │   │   └── AdminDashboardPage.tsx
│   │   └── App.tsx                # Router React
│   └── package.json
├── server/                        # Backend Express
│   ├── src/
│   │   ├── routes/
│   │   │   ├── rsvp.ts            # POST /api/rsvp
│   │   │   └── admin.ts           # GET|DELETE /api/admin/*
│   │   ├── middleware/
│   │   │   └── auth.ts            # Vérification JWT
│   │   ├── utils/
│   │   │   ├── email.ts           # Templates + envoi Nodemailer
│   │   │   └── prisma.ts          # Instance Prisma singleton
│   │   ├── scripts/
│   │   │   └── seed.ts            # Création compte admin initial
│   │   └── index.ts               # Point d'entrée Express
│   ├── prisma/
│   │   └── schema.prisma          # Schéma BDD (Rsvp + Admin)
│   └── package.json
├── DEPLOYMENT.md                  # Guide déploiement (VPS + Mutualisé)
├── .env.example                   # Variables d'environnement à copier
├── .prettierrc                    # Config Prettier
├── LICENSE
└── README.md
```

---

## Démarrage rapide (développement)

### Prérequis
- Node.js v18+ 
- npm v9+

### 1. Installation

```bash
git clone https://github.com/borisgautier/plateforme-setec.git
cd Plateforme-SETEC

# Installer les dépendances root
npm install

# Installer les dépendances client
cd client && npm install && cd ..

# Installer les dépendances serveur
cd server && npm install && cd ..
```

### 2. Configuration

```bash
cp .env.example server/.env
```

Editez `server/.env` et renseignez au minimum :

```env
JWT_SECRET=une-chaine-secrete-longue-et-aleatoire
SMTP_USER=votre-gmail@gmail.com
SMTP_PASS=votre-mot-de-passe-application-gmail
```

### 3. Base de données

> **Important :** `prisma generate` doit être exécuté **avant** le seed, sinon vous obtiendrez
> une erreur `Cannot find module '.prisma/client/default'`.

```bash
cd server
npx prisma generate         # génère le client Prisma (obligatoire après npm install)
npx prisma db push          # crée le fichier SQLite + les tables
npx ts-node --transpile-only src/scripts/seed.ts  # crée le compte admin initial
cd ..
```

### 4. Lancer le projet

```bash
npm run dev   # démarre client (port 5173) et serveur (port 3001) ensemble
```

Accès :
- **Frontend** : http://localhost:5173
- **Admin** : http://localhost:5173/admin/login
  - Identifiant : `admin`
  - Mot de passe : `adminsetect2026` (défini dans `.env`)

---

## Scripts disponibles

### Racine du projet
```bash
npm run dev              # Démarre client + serveur en développement
npm run build            # Build de production (client + serveur)
npm run typecheck        # Vérification TypeScript (client + serveur)
npm run lint             # ESLint (client + serveur)
npm run format           # Formatage Prettier de tout le code source
npm run format:check     # Vérifie le formatage sans modifier
```

### Client (`cd client`)
```bash
npm run dev              # Vite dev server (HMR)
npm run build            # Build production → dist/
npm run typecheck        # tsc --noEmit
npm run lint             # ESLint avec règles React + Prettier
npm run lint:fix         # Correction automatique ESLint
npm run format           # Prettier sur src/**
```

### Serveur (`cd server`)
```bash
npm run dev              # ts-node-dev avec hot reload
npm run build            # Compilation TypeScript → dist/
npm start                # Lance le build compilé
npm run db:generate      # Génère le client Prisma (à lancer après npm install)
npm run db:push          # Synchronise le schéma Prisma avec SQLite
npm run db:seed          # Crée le compte admin initial
npm run db:studio        # Interface graphique Prisma Studio
npm run lint             # ESLint sur src/
npm run format           # Prettier sur src/**/*.ts
```

---

## API Reference

### Publique

| Méthode | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Statut de l'API |
| `POST` | `/api/rsvp` | Soumettre une réponse RSVP |

**POST /api/rsvp**
```json
{
  "nom": "Dupont",
  "prenom": "Alice",
  "entreprise": "TechCorp SA",
  "fonction": "Directrice SI",
  "email": "alice@techcorp.cm",
  "statut": "confirme",
  "_hp": ""
}
```

### Admin (requiert `Authorization: Bearer <token>`)

| Méthode | Endpoint | Description |
|---|---|---|
| `POST` | `/api/admin/login` | Connexion admin → JWT |
| `GET` | `/api/admin/rsvp` | Liste des réponses + stats |
| `DELETE` | `/api/admin/rsvp/:id` | Supprimer une réponse |
| `GET` | `/api/admin/export?format=xlsx` | Export Excel |
| `GET` | `/api/admin/export?format=csv` | Export CSV |

**Paramètres de liste**
```
?page=1&limit=15&search=alice&statut=confirme
```

---

## Variables d'environnement

| Variable | Requis | Valeur par défaut | Description |
|---|---|---|---|
| `DATABASE_URL` | Oui | `file:./dev.db` | Chemin fichier SQLite |
| `JWT_SECRET` | Oui | — | Clé secrète JWT (min. 32 chars) |
| `ADMIN_USERNAME` | Oui | `admin` | Identifiant admin |
| `ADMIN_PASSWORD` | Oui | `setect2026` | Mot de passe admin |
| `SMTP_HOST` | Oui | `smtp.gmail.com` | Serveur SMTP |
| `SMTP_PORT` | Non | `587` | Port SMTP |
| `SMTP_USER` | Oui | — | Email expéditeur |
| `SMTP_PASS` | Oui | — | Mot de passe app Gmail |
| `SMTP_FROM` | Non | — | Nom affiché dans les emails |
| `ADMIN_NOTIFY_EMAIL` | Non | — | Email pour notifs nouvelles réponses |
| `CLIENT_URL` | Non | `http://localhost:5173` | URL frontend (CORS) |
| `PORT` | Non | `3001` | Port du serveur API |

---

## Charte graphique

| Élément | Valeur |
|---|---|
| Bleu marine (fond) | `#1E4D72` |
| Orange (accent) | `#F28F27` |
| Bleu clair | `#39A5DE` |
| Police principale | Inter (Google Fonts) |
| Police titres | Barlow (Google Fonts) |

---

## Déploiement

Voir le guide complet dans **[DEPLOYMENT.md](./DEPLOYMENT.md)** — deux scénarios :

- **Option A — VPS Ubuntu** : Nginx + PM2 + Certbot (SSL Let's Encrypt gratuit)
- **Option B — Hébergement mutualisé** : cPanel Node.js via Passenger + `.htaccess`

---

## Sécurité

- Toutes les entrées validées avec **Zod** côté serveur
- Protection **honeypot** contre les bots
- **Rate limiting** : 5 soumissions / 10 minutes par IP
- Headers HTTP sécurisés via **Helmet** (CSP, HSTS, X-Frame-Options, etc.)
- Mots de passe hashés **bcrypt** (rounds: 12)
- Sessions JWT avec expiration 8h
- Email unique en base de données (contrainte Prisma)

---

## Licence

MIT — voir [LICENSE](./LICENSE)

---

*Développé pour SETECT — Secure and Protect Your Data*
