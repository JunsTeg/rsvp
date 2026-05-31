# Guide de deploiement local — Plateforme RSVP SETECT

Ce guide explique comment faire fonctionner l'application en local sur Windows avec le frontend React, le backend Express, Prisma, SQLite et la configuration SMTP Gmail.

---

## 1. Prerequis

Installez d'abord :

- Node.js v18 ou plus recent
- npm v9 ou plus recent
- Git si vous devez cloner le projet

Verification dans PowerShell :

```powershell
node -v
npm -v
```

---

## 2. Installer les dependances

Depuis la racine du projet :

```powershell
npm install
```

Installer les dependances du frontend :

```powershell
cd client
npm install
cd ..
```

Installer les dependances du backend :

```powershell
cd server
npm install
cd ..
```

---

## 3. Completer les fichiers `.env.example`

Avant de creer les fichiers `.env`, verifier que les fichiers exemples contiennent toutes les valeurs locales.

### 3.1 Backend — `.env.example`

Fichier a verifier :

```text
.env.example
```

Configuration locale recommandee :

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET=change-this-local-secret-with-a-long-random-value
ADMIN_USERNAME=admin
ADMIN_PASSWORD=adminsetect2026
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre-adresse@gmail.com
SMTP_PASS=votre-mot-de-passe-application-gmail
SMTP_FROM="SETECT Events <votre-adresse@gmail.com>"
ADMIN_NOTIFY_EMAIL=tp.issom@setect.com
CLIENT_URL=http://localhost:5173
PORT=3001
EVENT_DATE=18 Juin 2026
EVENT_TIME=15h - 21h
EVENT_LIEU=Elite Offices, Akwa - Douala
```

Variables a adapter :

| Variable | Valeur locale attendue |
| --- | --- |
| `DATABASE_URL` | `file:./dev.db` |
| `JWT_SECRET` | Chaine aleatoire longue |
| `ADMIN_USERNAME` | Identifiant admin local |
| `ADMIN_PASSWORD` | Mot de passe admin local |
| `SMTP_USER` | Adresse Gmail utilisee pour envoyer les emails |
| `SMTP_PASS` | Mot de passe d'application Gmail sans espaces |
| `SMTP_FROM` | Expediteur visible, identique a `SMTP_USER` ou alias autorise |
| `ADMIN_NOTIFY_EMAIL` | Email qui recoit les notifications RSVP |
| `CLIENT_URL` | `http://localhost:5173` |
| `PORT` | `3001` |
| `EVENT_DATE` | Date affichee dans les emails |
| `EVENT_TIME` | Horaire affiche dans les emails |
| `EVENT_LIEU` | Lieu affiche dans les emails |

### 3.2 Frontend — `client/.env.example`

Fichier a verifier :

```text
client/.env.example
```

Configuration locale recommandee :

```env
VITE_APP_URL=http://localhost:5173
VITE_APP_SITE_NAME=SETECT Events
VITE_TWITTER_HANDLE=@SETECT_CM
```

Variables a adapter :

| Variable | Valeur locale attendue |
| --- | --- |
| `VITE_APP_URL` | `http://localhost:5173` |
| `VITE_APP_SITE_NAME` | Nom affiche dans les apercus sociaux |
| `VITE_TWITTER_HANDLE` | Compte X/Twitter ou valeur existante |

### 3.3 Invitation Outlook

Pour tester le bouton `JE M'INSCRIS` dans `invitation-outlook.html` en local,
le lien doit pointer vers la page d'accueil servie par Vite :

```html
http://localhost:5173/
```

Ne pointez pas vers `main.tsx` ou `HomePage.tsx`, car ces fichiers sont du code
source et non des pages accessibles par les invites.

### 3.4 Favicon et titre de l'onglet

Le favicon utilise le fichier :

```text
client/public/favicon.png
```

Dans `client/index.html`, verifiez que les lignes suivantes sont presentes :

```html
<title>SETECT Exclusive - Lancement Officiel, Douala</title>
<link rel="icon" type="image/png" href="/favicon.png" />
<link rel="apple-touch-icon" href="/favicon.png" />
```

En local, le favicon doit etre accessible depuis :

```text
http://localhost:5173/favicon.png
```

---

## 4. Creer les fichiers `.env`

Creer le fichier d'environnement du serveur :

```powershell
copy .env.example server\.env
```

Ouvrir ensuite le fichier :

```text
server/.env
```

Verifier que `server/.env` contient les valeurs preparees dans `.env.example` :

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET=change-this-local-secret-with-a-long-random-value
ADMIN_USERNAME=admin
ADMIN_PASSWORD=adminsetect2026
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre-adresse@gmail.com
SMTP_PASS=votre-mot-de-passe-application-gmail
SMTP_FROM="SETECT Events <votre-adresse@gmail.com>"
ADMIN_NOTIFY_EMAIL=tp.issom@setect.com
CLIENT_URL=http://localhost:5173
PORT=3001
EVENT_DATE=18 Juin 2026
EVENT_TIME=15h - 21h
EVENT_LIEU=Elite Offices, Akwa - Douala
```

### Generer une cle JWT locale

Dans PowerShell :

```powershell
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Copiez la valeur generee dans `JWT_SECRET`.

Creer le fichier d'environnement du client :

```powershell
copy client\.env.example client\.env
```

Ouvrir ensuite :

```text
client/.env
```

Verifier que `client/.env` contient les valeurs preparees dans `client/.env.example` :

```env
VITE_APP_URL=http://localhost:5173
VITE_APP_SITE_NAME=SETECT Events
VITE_TWITTER_HANDLE=@SETECT_CM
```

---

## 5. Configurer le SMTP Gmail

L'application utilise Gmail pour envoyer les emails de confirmation.

### 5.1 Activer la validation en deux etapes

1. Aller sur `https://myaccount.google.com`
2. Ouvrir l'onglet `Securite`
3. Activer la validation en deux etapes

### 5.2 Creer un mot de passe d'application

1. Aller sur `https://myaccount.google.com/apppasswords`
2. Nommer l'application `SETECT RSVP`
3. Generer le mot de passe
4. Copier les 16 caracteres fournis par Google
5. Retirer les espaces avant de le mettre dans `SMTP_PASS`

Regles importantes :

- `SMTP_PASS` doit etre saisi sans espaces.
- `SMTP_FROM` doit utiliser la meme adresse que `SMTP_USER`, sauf si l'adresse est un alias d'envoi autorise dans Gmail ou Google Workspace.
- Si `SMTP_FROM` utilise une autre adresse non autorisee, Gmail peut refuser l'envoi ou remplacer l'expediteur.

Exemple :

```text
Mot de passe Google affiche : abcd efgh ijkl mnop
Valeur a mettre dans .env : abcdefghijklmnop
```

Configuration SMTP finale dans `server/.env` :

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre-adresse@gmail.com
SMTP_PASS=abcdefghijklmnop
SMTP_FROM="SETECT Events <votre-adresse@gmail.com>"
```

Si le SMTP n'est pas configure correctement, l'application peut demarrer, mais l'envoi des emails echouera.

---

## 6. Initialiser la base de donnees locale

Depuis le dossier `server` :

```powershell
cd server
npm run db:generate
npm run db:push
npm run db:seed
cd ..
```

Ces commandes permettent de :

- Generer le client Prisma
- Creer la base SQLite locale `server/dev.db`
- Creer le compte administrateur initial

Identifiants admin par defaut :

```text
Identifiant : admin
Mot de passe : adminsetect2026
```

Si vous changez `ADMIN_PASSWORD`, relancez :

```powershell
cd server
npm run db:seed
cd ..
```

---

## 7. Lancer l'application en local

Depuis la racine du projet :

```powershell
npm run dev
```

Cette commande lance :

- Le frontend sur `http://localhost:5173`
- Le backend sur `http://localhost:3001`

---

## 8. Acces local

Application :

```text
http://localhost:5173
```

Administration :

```text
http://localhost:5173/admin/login
```

API health check :

```text
http://localhost:3001/api/health
```

---

## 9. Commandes utiles

Lancer uniquement le frontend :

```powershell
cd client
npm run dev
```

Lancer uniquement le backend :

```powershell
cd server
npm run dev
```

Ouvrir Prisma Studio :

```powershell
cd server
npm run db:studio
```

Compiler tout le projet :

```powershell
npm run build
```

Verifier TypeScript :

```powershell
npm run typecheck
```

---

## 10. Probleme frequents

| Probleme | Cause probable | Solution |
| --- | --- | --- |
| `Cannot find module '.prisma/client/default'` | Prisma Client non genere | Lancer `cd server` puis `npm run db:generate` |
| Connexion admin impossible | Seed non execute ou mauvais mot de passe | Lancer `cd server` puis `npm run db:seed` |
| API inaccessible | Backend non lance | Verifier que `npm run dev` tourne |
| Erreur CORS | `CLIENT_URL` incorrect | Mettre `CLIENT_URL=http://localhost:5173` dans `server/.env` |
| Emails non envoyes | SMTP Gmail incorrect | Verifier `SMTP_USER`, `SMTP_PASS` sans espaces et `SMTP_FROM` autorise |
| Base vide | `db:push` ou `db:seed` non execute | Relancer les commandes Prisma |

---

## Recapitulatif rapide

Avant les commandes `copy`, completer :

- `.env.example`
- `client/.env.example`

```powershell
npm install

cd client
npm install
cd ..

cd server
npm install
cd ..

copy .env.example server\.env
copy client\.env.example client\.env

cd server
npm run db:generate
npm run db:push
npm run db:seed
cd ..

npm run dev
```

Puis ouvrir :

```text
http://localhost:5173
```
