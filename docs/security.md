# Oenova - Security notes

## Données et sessions

- `localStorage` conserve les données locales de cave et des informations UI non sensibles.
- Oenova utilise un compte unique Supabase Auth depuis la landing et l'application ; aucun second système d'identité n'est créé.
- La session Supabase native est partagée entre `index.html` et `app.html` sur le même domaine.
- Les `accessToken` et `refreshToken` Supabase ne doivent pas être écrits manuellement dans `localStorage` par le code applicatif.
- Supabase JS gère sa session native lorsque le cloud est configuré.
- Un profil utilisateur connu localement ne suffit pas : les actions cloud exigent une session Supabase utilisable.

## Supabase

- Utiliser uniquement la clé `anon` / publishable côté frontend.
- Ne jamais publier de clé `service_role`.
- Ne jamais placer de clé secrète ou de clé IA dans `index.html`, `app.html` ou les scripts frontend.
- Garder les règles RLS actives sur les données personnelles.
- Les fichiers de référence actuels sont `supabase/schema.sql` et `supabase/seed.sql`.

## IA et scanner

- Le scanner IA est optionnel.
- Sans backend `/api/scan-wine-label` configuré, l'app affiche une analyse locale limitée.
- Un crédit scan ne doit être consommé qu'après une réponse API réussie.
- Aucune clé IA ne doit être stockée dans le frontend.

## Exports

- L'export CSV neutralise les formules tableur dangereuses commençant par `=`, `+`, `-` ou `@`.
- Les imports destructifs doivent rester confirmés par l'utilisateur.

## Paiement

- Le paiement n'est pas configuré.
- Les libellés d'abonnement et de packs scans sont préparatoires.
- Toute future intégration paiement devra passer par un backend sécurisé.
