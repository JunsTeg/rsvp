# Deploiement simplifie — Plateforme RSVP SETECT

Procedure directe pour deployer l'application en production.

Remplacez dans les commandes :

- `rsvp.setect.cm` par votre domaine
- `VOTRE_IP` par l'IP du serveur
- `votre-email@gmail.com` par le Gmail utilise pour les emails

---

## 1. Preparer Gmail SMTP

1. Activer la validation en deux etapes du compte Gmail.
2. Aller sur `https://myaccount.google.com/apppasswords`.
3. Creer un mot de passe d'application nomme `SETECT RSVP`.
4. Copier les 16 caracteres sans espaces.
5. Utiliser cette valeur dans `SMTP_PASS`.

Regles importantes :

- `SMTP_PASS` doit etre saisi sans espaces.
- `SMTP_FROM` doit utiliser la meme adresse que `SMTP_USER`, sauf si l'adresse est un alias d'envoi autorise dans Gmail ou Google Workspace.
- Si `SMTP_FROM` utilise une autre adresse non autorisee, Gmail peut refuser l'envoi ou remplacer l'expediteur.

Exemple :

```env
SMTP_USER=votre-email@gmail.com
SMTP_PASS=abcdefghijklmnop
SMTP_FROM="SETECT Events <votre-email@gmail.com>"
```

---

## 2. Completer les fichiers `.env.example`

Avant de creer les fichiers `.env`, verifier que les fichiers exemples contiennent toutes les valeurs du deploiement.

### 2.1 Backend — `.env.example`

Fichier a verifier :

```text
.env.example
```

Valeurs a renseigner pour la production :

```env
DATABASE_URL="file:./data/prod.db"
JWT_SECRET=REMPLACER_PAR_UNE_CHAINE_ALEATOIRE
ADMIN_USERNAME=admin
ADMIN_PASSWORD=adminsetect2026
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre-email@gmail.com
SMTP_PASS=abcdefghijklmnop
SMTP_FROM="SETECT Events <votre-email@gmail.com>"
ADMIN_NOTIFY_EMAIL=tp.issom@setect.com
CLIENT_URL=https://rsvp.setect.cm
PORT=3001
EVENT_DATE=18 Juin 2026
EVENT_TIME=15h - 21h
EVENT_LIEU=Elite Offices, Akwa - Douala
```

Variables a adapter obligatoirement :

| Variable | Valeur attendue |
| --- | --- |
| `DATABASE_URL` | `file:./data/prod.db` en production |
| `JWT_SECRET` | Chaine aleatoire longue |
| `ADMIN_USERNAME` | Identifiant admin |
| `ADMIN_PASSWORD` | Mot de passe admin |
| `SMTP_USER` | Adresse Gmail d'envoi |
| `SMTP_PASS` | Mot de passe d'application Gmail sans espaces |
| `SMTP_FROM` | Expediteur visible, identique a `SMTP_USER` ou alias autorise |
| `ADMIN_NOTIFY_EMAIL` | Email qui recoit les notifications RSVP |
| `CLIENT_URL` | URL publique du site |
| `PORT` | Port interne de l'API, garder `3001` sur VPS |
| `EVENT_DATE` | Date affichee dans les emails |
| `EVENT_TIME` | Horaire affiche dans les emails |
| `EVENT_LIEU` | Lieu affiche dans les emails |

Generer `JWT_SECRET` :

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

### 2.2 Frontend — `client/.env.example`

Fichier a verifier :

```text
client/.env.example
```

Valeurs a renseigner :

```env
VITE_APP_URL=https://rsvp.setect.cm
VITE_APP_SITE_NAME=SETECT Events
VITE_TWITTER_HANDLE=@SETECT_CM
```

Variables a adapter :

| Variable | Valeur attendue |
| --- | --- |
| `VITE_APP_URL` | URL publique du site sans slash final |
| `VITE_APP_SITE_NAME` | Nom affiche dans les apercus sociaux |
| `VITE_TWITTER_HANDLE` | Compte X/Twitter ou valeur existante |

### 2.3 Mettre a jour l'invitation Outlook

Avant d'envoyer `invitation-outlook.html`, remplacez le lien local du bouton
`JE M'INSCRIS` :

```html
http://localhost:5173/
```

par l'URL publique de l'application sur le serveur :

```html
https://rsvp.setect.cm/
```

Si vous utilisez un autre domaine, mettez la meme URL que `VITE_APP_URL`, avec
un slash final pour ouvrir la page d'accueil.

### 2.4 Verifier le favicon et le titre

Avant de builder, verifiez que `client/public/favicon.png` existe.

Dans `client/index.html`, les lignes favicon doivent pointer vers `/favicon.png` :

```html
<title>SETECT Exclusive - Lancement Officiel, Douala</title>
<link rel="icon" type="image/png" href="/favicon.png" />
<link rel="apple-touch-icon" href="/favicon.png" />
```

Apres build, `client/dist/favicon.png` doit etre present. Il sera deploye avec le
contenu de `client/dist/` et disponible en production a l'adresse :

```html
https://rsvp.setect.cm/favicon.png
```

---

## 3. Creer les fichiers `.env` avant build

Depuis la racine du projet :

```bash
cp .env.example server/.env
cp client/.env.example client/.env
```

Verifier ensuite :

- `server/.env`
- `client/.env`

Le frontend doit contenir :

```env
VITE_APP_URL=https://rsvp.setect.cm
VITE_APP_SITE_NAME=SETECT Events
VITE_TWITTER_HANDLE=@SETECT_CM
```

---

## 4. Option A — Deploiement VPS Ubuntu

### 4.1 Connexion serveur

```bash
ssh root@VOTRE_IP
```

### 4.2 Installer les dependances systeme

```bash
apt update && apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs nginx git certbot python3-certbot-nginx
npm install -g pm2
systemctl enable nginx
systemctl start nginx
```

### 4.3 Recuperer le projet

```bash
mkdir -p /var/www/setect-rsvp
cd /var/www/setect-rsvp
git clone https://github.com/BorisGautier/Plateforme-SETEC.git .
```

### 4.4 Creer `server/.env`

```bash
cp .env.example server/.env
nano server/.env
```

Verifier que `server/.env` contient les valeurs preparees dans `.env.example`.

```env
DATABASE_URL="file:./data/prod.db"
JWT_SECRET=REMPLACER_PAR_UNE_CHAINE_ALEATOIRE
ADMIN_USERNAME=admin
ADMIN_PASSWORD=adminsetect2026
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre-email@gmail.com
SMTP_PASS=abcdefghijklmnop
SMTP_FROM="SETECT Events <votre-email@gmail.com>"
ADMIN_NOTIFY_EMAIL=tp.issom@setect.com
CLIENT_URL=https://rsvp.setect.cm
PORT=3001
EVENT_DATE=18 Juin 2026
EVENT_TIME=15h - 21h
EVENT_LIEU=Elite Offices, Akwa - Douala
```

### 4.5 Creer `client/.env`

```bash
cd /var/www/setect-rsvp/client
cp .env.example .env
nano .env
```

Verifier que `client/.env` contient les valeurs preparees dans `client/.env.example`.

```env
VITE_APP_URL=https://rsvp.setect.cm
VITE_APP_SITE_NAME=SETECT Events
VITE_TWITTER_HANDLE=@SETECT_CM
```

### 4.6 Installer et compiler

```bash
cd /var/www/setect-rsvp/server
npm install
npm run build

cd /var/www/setect-rsvp/client
npm install
npm run build
```

### 4.7 Initialiser la base

```bash
cd /var/www/setect-rsvp/server
mkdir -p data
npx prisma generate
npx prisma db push
npx ts-node --transpile-only src/scripts/seed.ts
```

### 4.8 Lancer l'API avec PM2

Creer `/var/www/setect-rsvp/ecosystem.config.js` :

```js
module.exports = {
  apps: [{
    name: 'setect-rsvp-api',
    script: './dist/index.js',
    cwd: '/var/www/setect-rsvp/server',
    env: {
      NODE_ENV: 'production',
    },
  }]
}
```

Demarrer :

```bash
cd /var/www/setect-rsvp
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

Executer la commande affichee par `pm2 startup`.

### 4.9 Configurer Nginx

Creer `/etc/nginx/sites-available/setect-rsvp` :

```nginx
server {
    listen 80;
    server_name rsvp.setect.cm;

    root /var/www/setect-rsvp/client/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Activer :

```bash
ln -s /etc/nginx/sites-available/setect-rsvp /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

### 4.10 Activer HTTPS

Le domaine doit pointer vers l'IP du serveur.

```bash
certbot --nginx -d rsvp.setect.cm
```

Verifier :

```bash
curl https://rsvp.setect.cm/api/health
```

---

## 5. Option B — Deploiement cPanel

### 5.1 Generer les builds localement

Completer `.env.example` et `client/.env.example`, creer `server/.env` et `client/.env`, puis lancer :

```bash
cd client
npm install
npm run build
cd ..

cd server
npm install
npm run build
cd ..
```

### 5.2 Verifier `server/.env`

```env
DATABASE_URL="file:./data/prod.db"
JWT_SECRET=REMPLACER_PAR_UNE_CHAINE_ALEATOIRE
ADMIN_USERNAME=admin
ADMIN_PASSWORD=adminsetect2026
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre-email@gmail.com
SMTP_PASS=abcdefghijklmnop
SMTP_FROM="SETECT Events <votre-email@gmail.com>"
ADMIN_NOTIFY_EMAIL=tp.issom@setect.com
CLIENT_URL=https://rsvp.setect.cm
PORT=3001
EVENT_DATE=18 Juin 2026
EVENT_TIME=15h - 21h
EVENT_LIEU=Elite Offices, Akwa - Douala
```

### 5.3 Uploader les fichiers

Backend a uploader dans `~/setect-rsvp/server` :

- `server/dist/`
- `server/prisma/`
- `server/package.json`
- `server/package-lock.json`
- `server/.env`

Frontend : uploader le contenu de `client/dist/` dans `public_html/`.

### 5.4 Configurer Node.js dans cPanel

Dans `Setup Node.js App` :

| Champ | Valeur |
| --- | --- |
| Node.js version | 20.x |
| Application mode | Production |
| Application root | `setect-rsvp/server` |
| Application URL | votre domaine |
| Startup file | `dist/index.js` |

Puis :

1. Cliquer sur `Run NPM Install`.
2. Ajouter les variables d'environnement du fichier `server/.env`.
3. Enregistrer.

### 5.5 Ajouter `.htaccess`

Dans `public_html/.htaccess` :

```apache
Options -MultiViews
RewriteEngine On

RewriteCond %{REQUEST_URI} ^/api/
RewriteRule ^(.*)$ http://127.0.0.1:PORT/$1 [P,L]

RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [L]
```

Remplacer `PORT` par le port affiche par cPanel.

### 5.6 Initialiser la base sur cPanel

Dans le terminal cPanel :

```bash
cd ~/setect-rsvp/server
mkdir -p data
npx prisma generate
npx prisma db push
node dist/scripts/seed.js
```

### 5.7 Demarrer

Dans `Setup Node.js App`, cliquer sur `Restart` ou `Start`.

Activer HTTPS depuis `SSL/TLS` ou `Let's Encrypt SSL`.

---

## 6. Acces administrateur

URL :

```text
https://votre-domaine.com/admin/login
```

Identifiants par defaut :

| Champ | Valeur |
| --- | --- |
| Identifiant | `admin` |
| Mot de passe | `adminsetect2026` |

Pour changer le mot de passe :

1. Modifier `ADMIN_PASSWORD` dans `server/.env`.
2. Relancer le seed.
3. Redemarrer l'API.

VPS :

```bash
cd /var/www/setect-rsvp/server
npx ts-node --transpile-only src/scripts/seed.ts
pm2 restart setect-rsvp-api
```

cPanel :

```bash
cd ~/setect-rsvp/server
node dist/scripts/seed.js
```

---

## 7. Mise a jour

### VPS

```bash
cd /var/www/setect-rsvp
git pull origin main

cd client
npm install
npm run build
cd ..

cd server
npm install
npm run build
cd ..

pm2 restart setect-rsvp-api
```

### cPanel

1. Rebuilder `client` et `server` localement.
2. Uploader `client/dist/` dans `public_html/`.
3. Uploader `server/dist/` dans `~/setect-rsvp/server`.
4. Redemarrer l'application Node.js dans cPanel.

---

## 8. Verification rapide

VPS :

```bash
pm2 status
curl https://rsvp.setect.cm/api/health
```

Navigateur :

```text
https://rsvp.setect.cm
https://rsvp.setect.cm/admin/login
```

---

## 9. Depannage rapide

| Probleme | Solution |
| --- | --- |
| Page blanche | Verifier que `client/dist/index.html` existe |
| API indisponible | Redemarrer PM2 ou l'application cPanel |
| Erreur 502 | Verifier les logs PM2 ou cPanel |
| Emails non recus | Verifier `SMTP_USER`, `SMTP_PASS` sans espaces et `SMTP_FROM` autorise |
| Login admin impossible | Relancer le seed |
| Base vide | Relancer `npx prisma db push` |
| Prisma client introuvable | Relancer `npx prisma generate` |

---

## 10. Fichiers importants

| Fichier | Role |
| --- | --- |
| `server/.env` | Configuration production |
| `server/data/prod.db` | Base SQLite |
| `client/dist/` | Frontend compile |
| `server/dist/` | Backend compile |
