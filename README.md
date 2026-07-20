# Oenaris

Oenaris est une application premium de gestion de cave à vin.

**Votre cave privée, enfin maîtrisée.**

Le site public présente le produit, permet de créer un compte et accompagne l’installation de la PWA. L’application exige une session Supabase valide et ne propose plus d’accès libre sans compte.

## Offre bêta

L’offre **Découverte** est gratuite pendant la bêta. Aucun paiement n’est actif et aucune donnée bancaire n’est demandée.

- Compte Oenaris requis
- Inventaire et cave virtuelle
- Exports JSON, CSV et PDF
- Scanner assisté avec IA optionnelle
- Installation PWA

## Architecture

- `index.html` : site public à onglets
- `app.html` : application de cave verrouillée par la session
- `app.js` : logique métier, stockage scoppé, rendu et synchronisation
- `src/auth-client.js` : client Supabase Auth partagé
- `src/landing-auth.js` : création de compte, connexion, reset et renvoi de confirmation
- `src/landing-tabs.js` : navigation du site et parcours d’installation
- `manifest.webmanifest` : configuration PWA
- `service-worker.js` : cache hors ligne
- `supabase/schema.sql` : schéma et politiques RLS
- `supabase/functions/` : fonctions IA optionnelles

## Parcours utilisateur

1. Découvrir Oenaris sur le site public.
2. Créer un compte ou se connecter dans l’onglet Compte.
3. Suivre le parcours Installer. L’installation est recommandée pour l’expérience complète.
4. Continuer vers `app.html` avec une session Supabase valide.

Si le navigateur ne propose pas l’installation PWA, l’utilisateur peut continuer après avoir consulté le parcours guidé. La session Supabase reste la barrière d’accès réelle.

Un nouveau compte démarre avec une cave vide. Aucun jeu de bouteilles de démonstration n’est injecté automatiquement.

## Isolation des données

Les données du navigateur sont séparées par compte avec des clés de la forme :

```text
oenaris:<userId>:wines
oenaris:<userId>:movements
oenaris:<userId>:wishlist
```

Lorsqu’anciennes données non scoppées sont trouvées, l’application propose de les importer, de les ignorer ou de les exporter avant migration. Elles ne sont jamais rattachées ou supprimées sans décision visible.

## Routes utiles

- `index.html?tab=compte&mode=signup` : création de compte
- `index.html?tab=compte&mode=signin` : connexion
- `index.html?tab=compte&mode=reset` : demande de réinitialisation
- `index.html?tab=telecharger` : installation et accès conditionnel
- `app.html` : application verrouillée
- `privacy.html` : confidentialité
- `terms.html` : conditions d’utilisation
- `legal.html` : mentions légales
- `data-deletion.html` : suppression des données

URL publique : `https://jcauchy48-star.github.io/Oenaris/`

L’ancien chemin de marque, s’il reste publié ou indexé, nécessite une redirection ou un réglage externe dans GitHub Pages. Le code de ce dépôt n’expose plus cet ancien chemin dans l’interface.

## Configuration Supabase

L’authentification Supabase est la source unique d’identité. Le frontend reçoit seulement l’URL du projet et la clé `anon` ou publishable dans `cloud-config.js`. Ne jamais y placer de clé `service_role`, de secret IA ou de clé de paiement.

Dans `Supabase Dashboard > Authentication > URL Configuration` :

```text
Site URL: https://jcauchy48-star.github.io/Oenaris/
Redirect URLs: https://jcauchy48-star.github.io/Oenaris/*
```

1. Exécuter `supabase/schema.sql` dans le projet Supabase.
2. Exécuter `supabase/seed.sql` uniquement si les références communes de départ sont souhaitées.
3. Vérifier manuellement que RLS est active et que les politiques ont bien été appliquées.
4. Déployer `cloud-config.js` à côté de `index.html` et `app.html`.

La sauvegarde utilise actuellement `cellar_snapshots`. Le modèle multi-appareils reste en cours de stabilisation ; les exports doivent rester la copie de sécurité de référence pendant la bêta.

## IA optionnelle

La configuration des fonctions sécurisées est décrite dans `docs/ai-setup.md`. Les clés OpenAI restent dans les secrets des Edge Functions Supabase. Sans fonction configurée, l’interface utilise un conseil intégré ou une détection limitée et ne promet aucun quota de scans IA.

## Développement local

Servir le dossier avec un serveur HTTP, puis ouvrir la vitrine. Une configuration Supabase valide et un compte sont nécessaires pour déverrouiller l’application.

```powershell
npx serve . -l 4173
```

- Site : `http://127.0.0.1:4173/`
- Application : `http://127.0.0.1:4173/app.html`

## Vérifications

```powershell
node --check app.js
node --check src/auth-client.js
node --check src/landing-auth.js
node --check src/landing-tabs.js
node --check service-worker.js
node scripts/verify.js
npm run lint
```

## Documentation

- [Sécurité](docs/security.md)
- [Feuille de route technique](docs/technical-roadmap.md)
- [Configuration IA](docs/ai-setup.md)

Le workflow GitHub Actions publie le site sur GitHub Pages après intégration sur `main`.
