# Oenova

Site vitrine et application de gestion de cave à vin, installable en PWA et utilisable hors ligne.

## Architecture web

- `index.html` : site vitrine public Oenova.
- `app.html` : application complète de gestion de cave.
- `styles.css` : styles partagés, avec la vitrine isolée sous `.landing-body`.
- `src/auth-client.js` : client Supabase Auth partagé par la vitrine et l'application.
- `manifest.webmanifest` : installation PWA avec démarrage direct sur `app.html`.
- `service-worker.js` : cache hors ligne de la vitrine et de l'application.

Depuis la vitrine, le bouton **Ouvrir l'application** mène à `./app.html`. L'application reste utilisable sans compte et sans backend.

## Fonctionnalités

- Ajout, modification et suppression de bouteilles
- Ajout rapide avec détails avancés
- Recherche, filtres avancés et tri
- Favoris, tags et photos de bouteilles
- Gestion des emplacements cave / casier / rangée / colonne
- Consommation de bouteille avec journal de cave des mouvements
- Alertes intelligentes et statistiques avancées
- Suggestions du moment
- Export/import JSON et CSV pour sauvegarder les données
- Vue imprimable pour inventaire PDF
- Fiche bouteille détaillée avec notes de dégustation
- Liste À acheter pour les achats à venir
- Sommelier personnel avec conseil local sans clé API
- Sidebar avec vues dédiées pour désengorger le dashboard
- Bibliothèque locale et commune Supabase de références vins alimentée par les ajouts
- Scan de bouteille mobile/PC avec fallback manuel sans API
- Vue Abonnement et packs IA prêts pour un futur backend sécurisé
- Caches de recherche/rendu pour garder l'interface fluide sur gros inventaires
- Vue Compte client avec connexion, création de compte et migration locale vers cloud quand Supabase est configuré
- Centre de contrôle : feedback, rapport technique, changelog, sauvegarde/restauration
- Manifest PWA, icône et service worker

## Comptes client et cloud

La version web reste fonctionnelle sans compte. Supabase est préparé avec `cloud-config.js` et une clé publishable frontend.

### Compte Oenova unique

- La création de compte et la connexion sont disponibles depuis `index.html` comme depuis `app.html`.
- Les deux pages utilisent le même projet Supabase Auth : il n'existe aucun compte séparé pour la vitrine.
- La session Supabase native est partagée sur le même domaine, sans stockage manuel des `accessToken` ou `refreshToken` par le code Oenova.
- Le compte reste optionnel. La cave fonctionne toujours en local et hors ligne sans connexion.
- Les données locales restent sur l'appareil tant que l'utilisateur ne choisit pas de les synchroniser.
- Après connexion, la vue Compte permet d'envoyer la cave locale vers Supabase ou de restaurer la dernière cave cloud.
- Sur un autre navigateur ou appareil, il faut se connecter au même compte puis restaurer la cave cloud.

Dans `Supabase Dashboard > Authentication > URL Configuration`, configurer :

```text
Site URL: https://jcauchy48-star.github.io/Oenova/app.html
Redirect URLs: https://jcauchy48-star.github.io/Oenova/*
```

Cette wildcard couvre la landing, `app.html` et les routes `?view=account&mode=signin|signup`.

1. Dans Supabase, exécuter `supabase/schema.sql` depuis ce dépôt.
2. Exécuter ensuite `supabase/seed.sql` depuis ce dépôt pour ajouter quelques références communes.
3. Déployer `cloud-config.js` à côté de `app.html`.
4. Ne jamais placer de clé `service_role` ou de secret dans le frontend.

`supabase-schema.sql` reste présent comme schéma minimal historique, mais le chemin de référence pour la version web est `supabase/schema.sql`.

Le stockage cloud utilise `cellar_snapshots` pour la cave utilisateur, `profiles` pour le compte client et `wine_references` / `wine_vintages` pour la bibliothèque commune. Les politiques RLS limitent les données personnelles à leur propriétaire et gardent la bibliothèque commune lisible.

### Synchronisation utilisateur

Apres connexion, l'app verifie automatiquement le cloud :

- si aucune cave cloud n'existe, la cave locale est migree vers le compte ;
- si une cave cloud existe et que le navigateur n'a pas de cave locale, elle est restauree ;
- si une cave cloud existe deja et qu'une cave locale est presente, l'utilisateur choisit depuis la vue Compte entre envoyer la cave locale ou restaurer le cloud ;
- chaque modification personnelle est ensuite synchronisee automatiquement apres un court delai.

## Utilisation locale

Servir le dossier avec un petit serveur local, puis ouvrir la vitrine ou l'application :

- vitrine : `http://127.0.0.1:8080/`
- application : `http://127.0.0.1:8080/app.html`

Avec Node.js :

```powershell
node -e "const http=require('http'),fs=require('fs'),path=require('path');http.createServer((req,res)=>{const p=path.join(process.cwd(),req.url==='/'?'index.html':req.url);fs.readFile(p,(e,d)=>{if(e){res.writeHead(404);res.end('Not found');return;}res.end(d);});}).listen(8080,'127.0.0.1',()=>console.log('http://127.0.0.1:8080'))"
```

## Publication GitHub Pages

Le workflow GitHub Actions inclus publie automatiquement le site sur GitHub Pages à chaque push sur `main`.

La racine GitHub Pages affiche la vitrine. L'application est disponible sous `/Oenova/app.html`.

Dans GitHub, aller dans `Settings > Pages`, puis choisir `GitHub Actions` comme source.
