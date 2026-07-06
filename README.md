# Oenaris

Oenaris est une application premium de gestion de cave à vin.
**Votre cave privée, enfin maîtrisée.**

La configuration de l'assistant IA securise est documentee dans `docs/ai-setup.md`.

Le site public présente le service, permet de créer un compte privé et accompagne l'installation de la PWA.

## Architecture web

- `index.html` : site vitrine public Oenaris.
- `app.html` : application complète de gestion de cave.
- `styles.css` : styles partagés, avec la vitrine isolée sous `.landing-body`.
- `src/auth-client.js` : client Supabase Auth partagé par la vitrine et l'application.
- `src/landing-tabs.js` : navigation accessible du site public et passage contrôlé vers l'installation.
- `manifest.webmanifest` : installation PWA avec démarrage sur `app.html`, protégé par la session.
- `service-worker.js` : cache hors ligne de la vitrine et de l'application.

La vitrine propose sept onglets (`?tab=accueil`, `fonctionnalites`, `demo`, `tarifs`, `securite`, `telecharger`, `compte`). La création ou la connexion à un compte Oenaris est obligatoire avant l'ouverture de l'application.

## Parcours utilisateur

1. Découvrir Oenaris depuis les onglets du site public.
2. Créer un compte ou se connecter depuis l'onglet Compte.
3. Suivre les instructions de l'onglet Installer pour ajouter la PWA.
4. Continuer vers `app.html` avec une session Supabase valide.

`app.html` reste verrouillée sans session. Une cave nouvellement créée est vide : les bouteilles de démonstration ne sont jamais injectées dans l'inventaire réel. L'installation est requise pour l'expérience complète ; un passage contrôlé depuis l'onglet Installer reste prévu pour les navigateurs qui ne proposent pas l'installation PWA.

## Routes utiles

- `index.html?tab=compte&mode=signup` : création de compte.
- `index.html?tab=compte&mode=signin` : connexion.
- `index.html?tab=telecharger` : installation et accès conditionnel.
- `app.html` : application verrouillée par la session et le parcours d'installation.

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

La version web exige un compte. Supabase est configuré avec `cloud-config.js` et une clé publishable frontend.

### Configuration Supabase requise

L'authentification Supabase est la source unique d'identité. L'URL du projet et sa clé publishable doivent être fournies dans `cloud-config.js`; aucune clé `service_role`, clé IA ou autre secret ne doit être ajouté au frontend.

### Compte Oenaris unique

- La création de compte et la connexion sont disponibles depuis l'onglet Compte de `index.html`; le verrou de `app.html` y renvoie si nécessaire.
- Les deux pages utilisent le même projet Supabase Auth : il n'existe aucun compte séparé pour la vitrine.
- La session Supabase native est partagée sur le même domaine, sans stockage manuel des `accessToken` ou `refreshToken` par le code Oenaris.
- Une session Supabase valide est exigée avant que `app.html` charge et affiche les données de cave.
- Les données locales existantes restent sur l'appareil et ne sont pas supprimées par cette évolution.
- Un nouveau compte sur un navigateur vierge démarre avec une cave vide, sans bouteilles de démonstration injectées.
- Après connexion, la vue Compte permet d'envoyer la cave locale vers Supabase ou de restaurer la dernière cave cloud.
- Sur un autre navigateur ou appareil, il faut se connecter au même compte puis restaurer la cave cloud.

Dans `Supabase Dashboard > Authentication > URL Configuration`, configurer :

```text
Site URL: https://jcauchy48-star.github.io/Oenaris/
Redirect URLs: https://jcauchy48-star.github.io/Oenaris/*
```

Cette wildcard couvre la landing, la confirmation de compte et les onglets `?tab=compte&mode=signin|signup`.

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

## Développement local

Servir le dossier avec un petit serveur local, puis ouvrir la vitrine. Une configuration Supabase valide et un compte sont nécessaires pour déverrouiller l'application :

- vitrine : `http://127.0.0.1:8080/`
- application : `http://127.0.0.1:8080/app.html`

Avec Node.js :

```powershell
node -e "const http=require('http'),fs=require('fs'),path=require('path');http.createServer((req,res)=>{const p=path.join(process.cwd(),req.url==='/'?'index.html':req.url);fs.readFile(p,(e,d)=>{if(e){res.writeHead(404);res.end('Not found');return;}res.end(d);});}).listen(8080,'127.0.0.1',()=>console.log('http://127.0.0.1:8080'))"
```

## Publication GitHub Pages

Le workflow GitHub Actions inclus publie automatiquement le site sur GitHub Pages à chaque push sur `main`.

La racine GitHub Pages affiche la vitrine. L'application est disponible sous `/Oenaris/app.html`.

Dans GitHub, aller dans `Settings > Pages`, puis choisir `GitHub Actions` comme source.
