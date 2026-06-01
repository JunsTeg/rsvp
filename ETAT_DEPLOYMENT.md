# COMPTE RENDU D'ANALYSE – ACCÈS À LA PLATEFORME RSVP SETECT

## Objet

Analyse de l'incident empêchant l'accès à la plateforme RSVP déployée à l'adresse :

https://rsvp.setect.com

## État des lieux

Les vérifications réalisées ont permis de confirmer les points suivants :

* Le déploiement de l'application Node.js a été effectué avec succès sur le VPS.
* Le frontend React est correctement compilé et accessible localement.
* Le backend Node.js est opérationnel et répond correctement aux requêtes.
* Le service PM2 est fonctionnel.
* La configuration Nginx dédiée à la plateforme RSVP est correcte.
* Les tests effectués directement sur le serveur permettent d'accéder à l'application sans anomalie.

L'application est donc correctement installée et fonctionnelle sur le serveur cible.

## Cause identifiée

L'analyse DNS a mis en évidence que le sous-domaine :

rsvp.setect.com

ne pointe actuellement pas vers le serveur hébergeant l'application RSVP.

Situation observée :

* VPS hébergeant l'application RSVP : **213.136.70.76**
* Résolution DNS actuelle de rsvp.setect.com : **82.208.21.167**

Les requêtes des utilisateurs sont donc dirigées vers un autre serveur, lequel retourne une erreur « 404 Not Found ».

Cette situation explique pourquoi l'application est accessible localement sur le VPS mais reste inaccessible depuis Internet.

## Solution retenue

Modifier l'enregistrement DNS du sous-domaine RSVP afin qu'il pointe vers le serveur hébergeant effectivement l'application.

Modification à effectuer :

| Enregistrement  | Valeur actuelle | Nouvelle valeur |
| --------------- | --------------- | --------------- |
| rsvp.setect.com | 82.208.21.167   | 213.136.70.76   |

## Impact attendu

Cette modification permettra aux utilisateurs accédant à :

https://rsvp.setect.com

d'être redirigés vers le serveur hébergeant réellement la plateforme RSVP.

Aucun impact n'est attendu sur :

* setect.com
* [www.setect.com](http://www.setect.com)
* erp.setect.com

sous réserve que seule l'entrée DNS du sous-domaine **rsvp** soit modifiée.

## Recommandation

Effectuer la modification DNS puis vérifier la propagation de l'enregistrement avant de procéder à la génération ou à la mise à jour du certificat SSL associé au sous-domaine RSVP.
