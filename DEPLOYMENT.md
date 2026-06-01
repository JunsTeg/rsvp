# Guide de Déploiement — Plateforme RSVP SETECT

> Ce guide est rédigé pour être suivi par n'importe qui, même sans expérience serveur.
> Chaque étape est expliquée. Ne sautez aucune étape.

---

## Sommaire

- [Étape 0 — Préparer votre compte Gmail (SMTP)](#étape-0--préparer-votre-compte-gmail-smtp)
- [Étape 1 — Configurer l'URL de production (meta réseaux sociaux)](#étape-1--configurer-lurl-de-production-meta-réseaux-sociaux)
- [Option A — Déploiement sur VPS (serveur dédié)](#option-a--déploiement-sur-vps-serveur-ubuntu)
- [Option B — Déploiement sur hébergement mutualisé (cPanel)](#option-b--déploiement-sur-hébergement-mutualisé-cpanel)
- [Accès administrateur](#accès-administrateur)
- [Mise à jour de l'application](#mise-à-jour-de-lapplication)
- [Résolution de problèmes](#résolution-de-problèmes)

---

## Étape 0 — Préparer votre compte Gmail (SMTP)

> **Pourquoi ?** La plateforme envoie des emails de confirmation aux invités. Elle utilise
> votre compte Gmail pour ça. Google exige un "mot de passe d'application" spécial
> (différent de votre mot de passe Gmail habituel) pour les applications tierces.

### 0A. Activer la validation en 2 étapes (obligatoire)

> Si elle est déjà activée, passez directement à l'étape 0B.

1. Ouvrez votre navigateur et allez sur **[myaccount.google.com](https://myaccount.google.com)**
2. Connectez-vous avec le compte Gmail que vous voulez utiliser pour les emails SETECT
3. Dans le menu de gauche, cliquez sur **"Sécurité"**
4. Faites défiler jusqu'à la section **"Comment vous connectez-vous à Google"**
5. Cliquez sur **"Validation en 2 étapes"**
6. Cliquez sur **"Commencer"** et suivez les instructions (numéro de téléphone requis)
7. Une fois terminé, vous verrez **"Validation en 2 étapes — Activée"** ✅

### 0B. Créer un mot de passe d'application

1. Allez directement sur : **[myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)**
   *(Si vous voyez "Cette page n'existe pas", c'est que la validation en 2 étapes n'est pas activée — revenez à l'étape 0A)*

2. Dans le champ **"Nom de l'application"**, tapez : `SETECT RSVP`

3. Cliquez sur le bouton **"Créer"**

4. Google affiche un cadre jaune avec un code de **16 lettres** de ce type :
   ```
   abcd efgh ijkl mnop
   ```

5. **Copiez immédiatement ce code** (sans les espaces) — il ne sera affiché **qu'une seule fois**

6. Notez-le dans un endroit sûr. Ce sera la valeur de `SMTP_PASS` dans votre configuration.

**Important :** `SMTP_PASS` doit être saisi **sans espaces** dans le fichier `.env`.
`SMTP_FROM` doit utiliser la même adresse que `SMTP_USER`, sauf si l'adresse est un
alias d'envoi autorisé dans Gmail ou Google Workspace. Sinon Gmail peut refuser
l'envoi ou remplacer l'expéditeur.

**Exemple :** Si Google vous donne `abcd efgh ijkl mnop`, votre `.env` aura :
```
SMTP_PASS=abcdefghijklmnop
```

---

---

## Étape 1 — Configurer l'URL de production (meta réseaux sociaux)

> **Pourquoi ?** L'application contient des balises meta Open Graph (og:url, og:image)
> et Twitter Card utilisées quand quelqu'un partage le lien sur Facebook, LinkedIn,
> WhatsApp ou X. Ces balises doivent pointer vers votre vrai domaine de production,
> sinon les aperçus de partage seront cassés ou pointeront vers la mauvaise URL.

Ces URLs sont configurées via un fichier d'environnement **côté frontend** (`client/.env`),
avant le build. Vite substitue automatiquement ces valeurs dans le HTML final.

### Les variables à configurer

Dans le dossier `client/`, créez le fichier `.env` (copiez depuis `.env.example`) :

```bash
# Sur votre machine locale (avant de builder)
cp client/.env.example client/.env
```

Ouvrez `client/.env` et modifiez les valeurs :

```env
# URL complète de votre domaine de production — sans slash final
VITE_APP_URL=https://rsvp.setect.cm

# Nom du site (affiché comme og:site_name)
VITE_APP_SITE_NAME=SETECT Events

# Compte Twitter/X (optionnel, laissez tel quel si pas de compte)
VITE_TWITTER_HANDLE=@SETECT_CM
```

### Exemples selon votre domaine

| Votre domaine | Valeur de VITE_APP_URL |
|---|---|
| `rsvp.setect.cm` | `https://rsvp.setect.cm` |
| `events.setect.cm` | `https://events.setect.cm` |
| `setect.cm/rsvp` | `https://setect.cm/rsvp` |
| `mon-domaine.com` | `https://mon-domaine.com` |

> **Important :** Ce fichier `client/.env` doit être configuré **avant** de lancer
> `npm run build`. Une fois le build effectué, les URLs sont intégrées dans les fichiers
> statiques HTML. Si vous changez de domaine plus tard, il faudra rebuilder.

### Mettre a jour le lien du bouton de l'invitation Outlook

Le fichier `invitation-outlook.html` contient le bouton `JE M'INSCRIS`.
En local, ce bouton peut pointer vers :

```html
http://localhost:5173/
```

Apres deploiement sur serveur, remplacez cette valeur dans `invitation-outlook.html`
par l'URL publique de l'application :

```html
https://rsvp.setect.cm/
```

Si votre domaine est different, utilisez l'URL configuree dans `VITE_APP_URL`, avec
un slash final si vous voulez ouvrir directement la page d'accueil.

### Ce qui est affecté par cette variable

| Balise meta | Utilisation |
|---|---|
| `og:url` | URL canonique de la page (Facebook, LinkedIn) |
| `og:image` | Image d'aperçu lors du partage (`/og-image.svg`) |
| `twitter:image` | Image d'aperçu sur X (Twitter) |
| `link rel="canonical"` | URL officielle pour Google |

### Verifier le titre et le favicon

Avant le build, verifiez dans `client/index.html` :

```html
<title>SETECT Exclusive - Lancement Officiel, Douala</title>
<link rel="icon" type="image/png" href="/favicon.png" />
<link rel="apple-touch-icon" href="/favicon.png" />
```

Le fichier `client/public/favicon.png` doit exister. Il sera copie automatiquement
dans `client/dist/favicon.png` pendant le build Vite, puis servi en local et en
production a l'adresse `/favicon.png`.

### Vérification après build

Après avoir lancé `npm run build`, ouvrez `client/dist/index.html` avec un éditeur
et vérifiez que vos URLs apparaissent correctement :

```bash
grep "og:url\|og:image\|canonical" client/dist/index.html
```

Vous devez voir votre domaine dans les résultats :
```html
<link rel="canonical" href="https://rsvp.setect.cm/" />
<meta property="og:url" content="https://rsvp.setect.cm/" />
<meta property="og:image" content="https://rsvp.setect.cm/og-image.svg" />
```

---

## Option A — Déploiement sur VPS (serveur Ubuntu)

> **Pour qui ?** Vous avez accès à un serveur dédié ou VPS (ex: serveur SETECT, OVH, AWS, etc.)
> **Avantages :** Performances maximales, contrôle total, données hébergées chez vous.

### Ce dont vous avez besoin avant de commencer

- L'adresse IP de votre serveur (ex: `41.202.219.XXX`)
- Les identifiants de connexion SSH (souvent `root` + mot de passe, ou clé SSH)
- Un nom de domaine pointant vers ce serveur (ex: `rsvp.setect.cm`)
- Le mot de passe d'application Gmail (étape 0 ci-dessus)

---

### A1. Se connecter au serveur

> Cette étape se fait depuis votre ordinateur personnel (Windows, Mac ou Linux).

**Sur Windows :** Ouvrez **PowerShell** ou installez [PuTTY](https://putty.org)

**Sur Mac/Linux :** Ouvrez le **Terminal**

Tapez la commande suivante en remplaçant `VOTRE_IP` par l'adresse IP de votre serveur :

```bash
ssh root@VOTRE_IP
```

Exemple :
```bash
ssh root@41.202.219.100
```

- Si on vous demande `Are you sure you want to continue connecting?` → tapez `yes` puis Entrée
- Entrez le mot de passe du serveur (les caractères ne s'affichent pas, c'est normal)
- Vous êtes connecté quand vous voyez une ligne du type `root@hostname:~#`

---

### A2. Mettre à jour le serveur

> Cette commande met à jour tous les logiciels du serveur. Elle peut prendre 2 à 5 minutes.

```bash
apt update && apt upgrade -y
```

Attendez que la commande se termine (retour à l'invite `#`).

---

### A3. Installer Node.js

> Node.js est le moteur qui fait fonctionner le backend de la plateforme.

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
```

Vérifiez que l'installation a réussi :

```bash
node -v
```

Vous devez voir quelque chose comme `v20.19.0`. Si c'est le cas, c'est bon ✅

---

### A4. Installer PM2 et Nginx

> **PM2** : maintient votre application en marche en permanence (redémarre si elle plante).
> **Nginx** : distribue les visiteurs entre le frontend React et l'API backend.

```bash
npm install -g pm2
apt install -y nginx
systemctl enable nginx
systemctl start nginx
```

Vérifiez que Nginx est bien démarré :

```bash
systemctl status nginx
```

Vous devez voir `active (running)` en vert ✅. Appuyez sur `q` pour quitter.

---

### A5. Récupérer le code de la plateforme

```bash
mkdir -p /var/www/rsvp
cd /var/www/rsvp
git clone https://github.com/JunsTeg/rsvp.git.
```

> Si git n'est pas installé : `apt install -y git` puis relancez la commande `git clone`.

Vérifiez que les fichiers sont bien là :

```bash
ls
```

Vous devez voir : `client/  server/  README.md  DEPLOYMENT.md  ...` ✅

---

### A6. Configurer les variables d'environnement

> Ce fichier contient toutes les informations sensibles (mots de passe, clés).
> Il ne sera jamais publié sur internet.

```bash
cp .env.example server/.env
nano server/.env
```

> `nano` est un éditeur de texte dans le terminal. Utilisez les flèches du clavier pour
> vous déplacer. Pour sauvegarder : `Ctrl+O` puis `Entrée`. Pour quitter : `Ctrl+X`.

Modifiez chaque ligne. Voici le fichier complété avec des explications :

```env
# Chemin vers la base de données (ne pas changer)
DATABASE_URL="file:./data/prod.db"

# Clé secrète pour les sessions admin — générez-en une ci-dessous
JWT_SECRET=REMPLACER_PAR_UNE_CHAINE_ALEATOIRE

# Identifiants du compte administrateur
ADMIN_USERNAME=admin
ADMIN_PASSWORD=adminsetect2026

# Configuration email Gmail
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre-email@gmail.com
SMTP_PASS=lesseizecaracteres      ← mot de passe d'application sans espaces (étape 0B)
SMTP_FROM="SETECT Events <votre-email@gmail.com>"  ← même adresse que SMTP_USER ou alias autorisé

# Email qui reçoit les notifications de nouvelles réponses
ADMIN_NOTIFY_EMAIL=tp.issom@setect.com

# URL publique de la plateforme (avec https://)
CLIENT_URL=https://rsvp.setect.com

# Port interne de l'API (ne pas changer)
PORT=3001
```

**Générer la clé JWT_SECRET :**

Ouvrez un second terminal (ou dans le même), tapez :

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Copiez la longue suite de caractères affichée et collez-la comme valeur de `JWT_SECRET`.

Exemple de résultat :
```
a3f8c2d1e9b4f7a2c5d8e1f4b7c0d3e6f9a2b5c8d1e4f7a0b3c6d9e2f5a8b1
```

Sauvegardez le fichier : `Ctrl+O` → `Entrée` → `Ctrl+X`

---

### A7. Installer les dépendances et compiler

> **Avant de builder le frontend**, configurez votre URL de production (voir Étape 1).

```bash
# Configurer l'URL de production du frontend
cd /var/www/rsvp/rsvp/client
cp .env.example .env
nano .env
```

Modifiez `VITE_APP_URL` avec votre domaine :
```env
VITE_APP_URL=https://rsvp.setect.com
VITE_APP_SITE_NAME=SETECT Events
VITE_TWITTER_HANDLE=@SETECT_CM
```
Sauvegardez : `Ctrl+O` → `Entrée` → `Ctrl+X`

```bash
# Backend
cd /var/www/rsvp/rsvp/server
npm install
npm run build

# Frontend
cd /var/www/rsvp/rsvp/client
npm install
npm run build
```

Vérifiez que les URLs ont bien été substituées :
```bash
grep "og:url\|canonical" /var/www/rsvp/rsvp/client/dist/index.html
# Doit afficher votre domaine, ex: https://rsvp.setect.com
```

> `npm run build` peut prendre 1 à 3 minutes. Attendez qu'il se termine.
> Si tout va bien, vous verrez `dist/` créé dans chaque dossier.

---

### A8. Créer la base de données et le compte admin

> **Important :** `prisma generate` doit être exécuté **avant** le seed.
> Si vous sautez cette étape, vous obtiendrez l'erreur `Cannot find module '.prisma/client/default'`.

```bash
cd /var/www/rsvp/rsvp/server
mkdir -p data
npx prisma generate
npx prisma db push
npx ts-node --transpile-only src/scripts/seed.ts
```

Vous devez voir :
```
✔ Generated Prisma Client
✅  Your database is now in sync with your Prisma schema.
Admin "admin" created.
```

---

### A9. Lancer l'application avec PM2

Créez le fichier de configuration PM2 :

```bash
cd /var/www/rsvp/rsvp
nano ecosystem.config.js
```

Copiez-collez exactement ce contenu :

```js
module.exports = {
  apps: [{
    name: 'setect-rsvp-api',
    script: './server/dist/index.js',
    cwd: '/var/www/rsvp/rsvp',
    env: {
      NODE_ENV: 'production',
    },
    error_file: '/var/www/rsvp/rsvp/logs/err.log',
    out_file: '/var/www/rsvp/rsvp/logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    restart_delay: 5000,
    max_restarts: 10,
  }]
}
```

Sauvegardez : `Ctrl+O` → `Entrée` → `Ctrl+X`

Démarrez l'application :

```bash
mkdir -p /var/www/rsvp/rsvp/logs
pm2 start /var/www/rsvp/rsvp/ecosystem.config.js
pm2 save
pm2 startup
```

> La commande `pm2 startup` affiche une ligne à copier-coller et exécuter.
> **Exécutez cette ligne** — elle configure le démarrage automatique au redémarrage du serveur.

Vérifiez que l'application tourne :

```bash
pm2 status
```

Vous devez voir `setect-rsvp-api` avec le statut `online` en vert ✅

Test rapide :

```bash
curl http://localhost:3001/api/health
```

Réponse attendue : `{"status":"ok","ts":"..."}` ✅

---

### A10. Configurer Nginx (serveur web)

```bash
nano /etc/nginx/sites-available/rsvp
```

Copiez-collez ce contenu  :

```nginx
server {
    listen 80;
    server_name rsvp.setect.com;

    # Fichiers statiques du frontend React
    root /var/www/rsvp/rsvp/client/dist;
    index index.html;

    # Routes React (application SPA)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy vers l'API Node.js
    location /api/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 30s;
        proxy_connect_timeout 10s;
    }

    # En-têtes de sécurité
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Cache navigateur pour les fichiers statiques (images, CSS, JS)
    location ~* \.(js|css|png|jpg|svg|ico|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Sauvegardez : `Ctrl+O` → `Entrée` → `Ctrl+X`

Activez la configuration :

```bash
ln -s /etc/nginx/sites-available/rsvp /etc/nginx/sites-enabled/
nginx -t
```

Vous devez voir `configuration file test is successful` ✅

```bash
systemctl reload nginx
```

---

### A11. Activer le HTTPS (certificat SSL gratuit)

> **Prérequis :** Votre nom de domaine doit déjà pointer vers l'IP de votre serveur.
> Pour vérifier : ouvrez `http://rsvp.setect.com` dans votre navigateur — si la page s'affiche, c'est bon.

**Comment faire pointer votre domaine vers le serveur :**

Chez votre registrar (où vous avez acheté le domaine), créez un enregistrement DNS :
```
Type : A
Nom  : rsvp   (ou @ pour le domaine principal)
Valeur : VOTRE_IP_SERVEUR
TTL  : 3600
```

Attendez 5 à 30 minutes que le DNS se propage, puis :

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d rsvp.setect.com
```

Certbot vous pose 2 questions :
1. Votre adresse email (pour les alertes d'expiration) → entrez votre email
2. Acceptez-vous les conditions ? → tapez `Y` puis Entrée

Certbot configure HTTPS automatiquement et **renouvelle le certificat tout seul** tous les 90 jours.

Vérifiez : ouvrez `https://rsvp.setect.com` dans votre navigateur → cadenas vert ✅

---

### A12. Sauvegarde automatique de la base de données

> Cette étape sauvegarde automatiquement toutes les données des invités chaque nuit.

```bash
nano /usr/local/bin/backup-setect-db.sh
```

Copiez-collez :

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/setect-rsvp"
DB_PATH="/var/www/setect-rsvp/server/data/prod.db"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p "$BACKUP_DIR"
cp "$DB_PATH" "$BACKUP_DIR/prod_$DATE.db"

# Conserver uniquement les 30 dernières sauvegardes
ls -t "$BACKUP_DIR"/*.db | tail -n +31 | xargs -r rm

echo "Sauvegarde effectuée : prod_$DATE.db"
```

Sauvegardez : `Ctrl+O` → `Entrée` → `Ctrl+X`

```bash
# Rendre le script exécutable
chmod +x /usr/local/bin/backup-setect-db.sh

# Programmer la sauvegarde automatique à 2h du matin chaque nuit
crontab -e
```

> Si on vous demande de choisir un éditeur, tapez `1` (nano) puis Entrée.

Allez à la dernière ligne du fichier et ajoutez :

```
0 2 * * * /usr/local/bin/backup-setect-db.sh >> /var/log/setect-backup.log 2>&1
```

Sauvegardez : `Ctrl+O` → `Entrée` → `Ctrl+X`

---

### A13. Vérification finale (VPS)

```bash
# L'API est-elle en ligne ?
pm2 status

# Les logs sont-ils propres ? (Ctrl+C pour quitter)
pm2 logs setect-rsvp-api --lines 30

# L'API répond-elle correctement ?
curl https://rsvp.setect.com/api/health
```

**La plateforme est en ligne sur `https://rsvp.setect.com`** 🎉
---

## Option B — Déploiement sur hébergement mutualisé (cPanel)

> **Pour qui ?** Vous avez un hébergement chez un prestataire (o2switch, PlanetHoster,
> Infomaniak, OVH mutualisé, etc.) avec accès à cPanel.
>
> **Avant de commencer :** Vérifiez que votre hébergeur supporte Node.js.
> Connectez-vous à cPanel et cherchez l'icône **"Setup Node.js App"**.
> Si elle n'existe pas, contactez votre hébergeur ou passez à l'Option A.

### Ce dont vous avez besoin avant de commencer

- Accès FTP ou au gestionnaire de fichiers cPanel
- Un logiciel FTP si vous choisissez FTP : [FileZilla](https://filezilla-project.org) (gratuit)
- Node.js installé sur **votre ordinateur** pour générer les builds
- Le mot de passe d'application Gmail (étape 0 ci-dessus)

---

### B1. Générer les builds sur votre ordinateur

> Ces commandes transforment le code source en fichiers optimisés prêts à déployer.
> Elles se lancent **sur votre machine personnelle**, pas sur le serveur.

**Première étape — configurer l'URL de production du frontend (voir Étape 1) :**

```bash
cp client/.env.example client/.env
```

Ouvrez `client/.env` avec un éditeur de texte (Notepad, VSCode, etc.) et modifiez :

```env
VITE_APP_URL=https://rsvp.setect.cm     ← votre vrai domaine ici
VITE_APP_SITE_NAME=SETECT Events
VITE_TWITTER_HANDLE=@SETECT_CM
```

Ensuite, ouvrez un terminal (ou PowerShell sur Windows) dans le dossier du projet :

```bash
# Build du frontend React (avec votre URL de production)
cd client
npm install
npm run build
cd ..

# Build du backend Express
cd server
npm install
npm run build
cd ..
```

Vérifiez rapidement que votre domaine est bien dans le build :
```bash
# Sur Windows (PowerShell)
Select-String "og:url" client/dist/index.html

# Sur Mac/Linux
grep "og:url" client/dist/index.html
```

Après ces commandes, vous avez :
- `client/dist/` → les fichiers de l'interface web (avec vos URLs de production intégrées)
- `server/dist/` → les fichiers de l'API compilés

---

### B2. Préparer le fichier de configuration

Sur votre ordinateur, créez le fichier `server/.env` en copiant `.env.example` :

```
DATABASE_URL="file:./data/prod.db"
JWT_SECRET=REMPLACER_PAR_UNE_CHAINE_ALEATOIRE_LONGUE
ADMIN_USERNAME=admin
ADMIN_PASSWORD=adminsetect2026
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre-email@gmail.com
SMTP_PASS=lesseizecaracteres
SMTP_FROM="SETECT Events <votre-email@gmail.com>"
ADMIN_NOTIFY_EMAIL=tp.issom@setect.com
CLIENT_URL=https://rsvp.setect.cm
PORT=3001
```

`SMTP_PASS` doit être saisi sans espaces. `SMTP_FROM` doit être identique à `SMTP_USER`
ou correspondre à un alias d'envoi autorisé par Gmail ou Google Workspace.

**Générer JWT_SECRET :** Si vous avez Node.js installé localement :
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```
Copiez le résultat dans `JWT_SECRET`.

---

### B3. Uploader les fichiers sur le serveur

Via le **Gestionnaire de fichiers cPanel** ou **FileZilla (FTP)** :

**Structure à créer sur le serveur :**
```
/home/VOTRE_USER/
└── setect-rsvp/
    ├── server/
    │   ├── dist/          ← contenu de votre server/dist/ local
    │   ├── prisma/        ← copier le dossier prisma/ complet
    │   ├── node_modules/  ← sera créé par cPanel (étape B4)
    │   └── .env           ← le fichier créé à l'étape B2
    └── (le frontend sera dans public_html/ — étape B5)
```

**Uploader le frontend :**

Uploadez le contenu de `client/dist/` dans `public_html/` (ou `public_html/rsvp/` si vous voulez un sous-dossier).

> **Avec FileZilla :**
> 1. Connectez-vous : Hôte = votre domaine, Identifiant/Mot de passe cPanel
> 2. À gauche (local) : naviguez vers `client/dist/`
> 3. À droite (serveur) : naviguez vers `public_html/`
> 4. Sélectionnez tous les fichiers locaux → glissez-les à droite

---

### B4. Configurer l'application Node.js dans cPanel

1. Connectez-vous à **cPanel**
2. Cherchez et cliquez sur **"Setup Node.js App"**
3. Cliquez sur **"Create Application"** (bouton bleu)
4. Remplissez le formulaire :

   | Champ | Valeur |
   |---|---|
   | Node.js version | **20.x** (choisir la plus récente disponible) |
   | Application mode | **Production** |
   | Application root | `setect-rsvp/server` |
   | Application URL | Votre domaine (ex: `rsvp.setect.cm`) |
   | Application startup file | `dist/index.js` |

5. Cliquez **"Create"**

6. Sur la page qui s'affiche, cliquez **"Run NPM Install"**
   → Attendez que ça se termine (peut prendre 2-3 minutes)

7. Faites défiler jusqu'à **"Environment Variables"** et ajoutez chaque variable de votre `.env` :
   - Cliquez "+ Add Variable" pour chaque ligne
   - `DATABASE_URL` = `file:./data/prod.db`
   - `JWT_SECRET` = votre clé générée
   - `ADMIN_PASSWORD` = `adminsetect2026`
   - `SMTP_USER` = votre email Gmail
   - `SMTP_PASS` = vos 16 caractères
   - … (toutes les autres variables)

8. Cliquez **"Save"**

---

### B5. Créer le fichier .htaccess pour le frontend

Dans `public_html/` (là où vous avez uploadé les fichiers React), créez un fichier `.htaccess` :

> Avec le gestionnaire de fichiers cPanel : clic droit → "Nouveau fichier" → nommez-le `.htaccess`
> Puis clic droit → "Modifier"

Contenu du fichier :

```apache
Options -MultiViews
RewriteEngine On

# Proxy des requêtes API vers Node.js
# Remplacez PORT par le port affiché dans "Setup Node.js App"
RewriteCond %{REQUEST_URI} ^/api/
RewriteRule ^(.*)$ http://127.0.0.1:PORT/$1 [P,L]

# Routing React SPA — toutes les routes vers index.html
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [L]
```

> Le **PORT** est affiché dans l'interface "Setup Node.js App" de cPanel,
> dans les détails de votre application (souvent entre 3000 et 65000).

---

### B6. Créer la base de données et le compte admin

Dans cPanel, cherchez **"Terminal"** (ou connectez-vous en SSH) :

> **Important :** `prisma generate` doit être exécuté avant le seed, sinon vous obtiendrez
> une erreur `Cannot find module '.prisma/client/default'`.

```bash
cd ~/setect-rsvp/server
mkdir -p data
npx prisma generate
npx prisma db push
node dist/scripts/seed.js
```

Vous devez voir :
```
✔ Generated Prisma Client
Admin "admin" created.
```
✅

> Si vous n'avez pas accès au terminal, contactez votre hébergeur — c'est une étape obligatoire.

---

### B7. Activer le HTTPS dans cPanel

1. Dans cPanel, cherchez **"SSL/TLS"** ou **"Let's Encrypt SSL"**
2. Sélectionnez votre domaine dans la liste
3. Cliquez **"Issue"** ou **"Installer"**
4. Attendez 1 à 2 minutes → HTTPS activé automatiquement ✅

---

### B8. Démarrer et vérifier l'application

1. Retournez dans cPanel → **"Setup Node.js App"**
2. Cliquez sur **"Restart"** (ou "Start") à côté de votre application
3. Ouvrez votre domaine dans le navigateur : `https://rsvp.setect.cm`

La page d'accueil de l'événement doit s'afficher ✅

---

### Limitations connues de l'hébergement mutualisé

| Limitation | Impact | Solution |
|---|---|---|
| Pas de PM2 | L'app peut s'arrêter si le serveur redémarre | Relancer manuellement depuis cPanel |
| RAM/CPU partagés | Ralentissements possibles si beaucoup de connexions simultanées | Suffisant pour un événement de quelques centaines d'invités |
| Logs limités | Diagnostic d'erreurs plus difficile | Consulter les logs dans cPanel → "Logs d'erreurs" |

> Pour un événement important ou une utilisation long terme, **l'Option A (VPS) reste recommandée**.

---

## Accès administrateur

Après déploiement, accédez au tableau de bord via :

```
https://votre-domaine.com/admin/login
```

| Champ | Valeur par défaut |
|---|---|
| Identifiant | `admin` |
| Mot de passe | `adminsetect2026` |

> **Conseil de sécurité :** Changez le mot de passe par défaut en modifiant `ADMIN_PASSWORD`
> dans votre fichier `.env`, puis relancez l'application et relancez le seed :
> ```bash
> npx ts-node --transpile-only src/scripts/seed.ts   # VPS
> node dist/scripts/seed.js                            # Mutualisé
> ```

---

## Mise à jour de l'application

### Option A — VPS

```bash
cd /var/www/setect-rsvp

# Récupérer les dernières modifications
git pull origin main

# Si votre domaine a changé, mettez à jour l'URL avant de rebuilder :
# nano client/.env   → modifier VITE_APP_URL

# Recompiler
cd client && npm install && npm run build && cd ..
cd server && npm install && npm run build && cd ..

# Redémarrer l'API
pm2 restart setect-rsvp-api

# Vérifier
pm2 status
```

### Option B — Hébergement mutualisé

1. Si votre domaine a changé, mettez à jour `client/.env` (variable `VITE_APP_URL`)
2. Générez les builds sur votre ordinateur (`npm run build`)
3. Uploadez les fichiers `dist/` via FTP (écrasez les anciens)
4. Dans cPanel → "Setup Node.js App" → cliquez **"Restart"**

---

## Résolution de problèmes

| Symptôme | Cause probable | Solution |
|---|---|---|
| Page blanche sur le site | Build React manquant ou mal uploadé | Vérifiez que `client/dist/index.html` existe |
| "Cannot GET /api/health" | API Node.js arrêtée | VPS : `pm2 restart setect-rsvp-api` / Mutualisé : redémarrer dans cPanel |
| Erreur 502 Bad Gateway | L'API ne répond pas | `pm2 logs setect-rsvp-api` pour voir l'erreur |
| Emails non reçus | Mauvais SMTP_PASS ou SMTP_FROM non autorisé | Vérifiez que `SMTP_PASS` est un mot de passe d'application sans espaces et que `SMTP_FROM` est identique à `SMTP_USER` ou un alias autorisé |
| "Identifiants incorrects" à l'admin login | Mauvais mot de passe ou seed non exécuté | Relancez le seed (`src/scripts/seed.ts`) |
| Certificat SSL expiré | Renouvellement automatique échoué | VPS : `certbot renew` / Mutualisé : renouveler dans cPanel |
| Base de données vide après redémarrage | `prisma db push` non exécuté | `cd server && npx prisma db push` |
| "ECONNREFUSED" dans les logs | Port 3001 bloqué par un firewall | VPS : `ufw allow 3001` (temporaire pour tester) |

---

## Récapitulatif des fichiers importants

| Fichier | Rôle |
|---|---|
| `server/.env` | Configuration sensible (ne jamais partager) |
| `server/data/prod.db` | Base de données SQLite (à sauvegarder régulièrement) |
| `server/dist/` | Backend compilé (généré par `npm run build`) |
| `client/dist/` | Frontend compilé (généré par `npm run build`) |
| `/var/backups/setect-rsvp/` | Sauvegardes automatiques (Option A) |

---

## Support technique

Pour toute question : **tp.issom@setect.com** | +237 699 65 63 22
