# Oenaris - Sécurité

## Accès et sessions

- Un compte Supabase Auth valide est obligatoire avant le chargement et le rendu des données dans `app.html`.
- Un profil utilisateur connu ne suffit pas : les actions cloud exigent une session Supabase utilisable et non expirée.
- Supabase JS gère la persistance native de sa session. Le code Oenaris n’écrit jamais manuellement `accessToken` ou `refreshToken` dans `localStorage`.
- Sans session, l’accès direct à `app.html` affiche uniquement l’écran verrouillé.
- L’installation PWA est recommandée et guidée. Elle améliore l’expérience, mais la session reste la véritable barrière d’accès.
- La déconnexion retire les marqueurs de parcours d’installation actuels et historiques.

## Isolation des données par compte

Les données conservées dans le navigateur sont scoppées par identifiant Supabase :

```text
oenaris:<userId>:wines
oenaris:<userId>:movements
oenaris:<userId>:wishlist
oenaris:<userId>:tasting-notes
```

Le même principe s’applique aux préférences, sauvegardes, files de synchronisation, diagnostics, emplacements et états de l’application. Aucune donnée n’est chargée avant validation de la session.

Lorsqu’anciennes données non scoppées sont détectées, Oenaris demande une décision visible : importer dans le compte, ignorer ou exporter avant migration. Les anciennes clés ne sont jamais supprimées automatiquement.

## Supabase et RLS

La Row Level Security est obligatoire avant toute bêta publique. Le fichier `supabase/schema.sql` active déjà RLS sur les tables du projet et définit des politiques de propriété.

Pour chaque table contenant des données personnelles :

- une colonne `user_id` ou un identifiant propriétaire équivalent doit être présent ;
- `select` ne doit retourner que les lignes de `auth.uid()` ;
- `insert` doit vérifier que le propriétaire vaut `auth.uid()` ;
- `update` doit vérifier l’ancienne et la nouvelle propriété ;
- `delete` doit être limité au propriétaire ;
- la clé `service_role` ne doit jamais être exposée dans le frontend.

Contrôles présents dans le schéma :

- `profiles` : accès du propriétaire via `id = auth.uid()` ;
- `cellar_snapshots`, `wine_label_scans`, `wine_import_batches`, `cellar_layouts`, `ai_enrichment_queue` et `advice_feedback` : politiques propriétaire basées sur `user_id` ;
- `wine_references`, `wine_aliases` et `wine_vintages` : lecture communautaire contrôlée et écriture authentifiée selon le propriétaire ;
- `wine_contributions` : création par l’utilisateur connecté et lecture limitée à ses contributions ou aux références visibles.

À chaque évolution du schéma, les politiques doivent être revues dans Supabase après exécution de `supabase/schema.sql`. Une vérification manuelle dans le tableau de bord Supabase reste nécessaire, car un fichier SQL présent dans Git ne prouve pas qu’il a été appliqué en production.

## IA et scanner

- L’assistant distant passe par `supabase/functions/wine-advice` et exige une session Supabase valide.
- Les outils complémentaires passent par `supabase/functions/wine-tools` avec la même validation.
- `OPENAI_API_KEY` reste uniquement dans les secrets des Edge Functions Supabase.
- Sans fonction distante configurée, l’interface annonce une détection limitée ou un conseil intégré, sans promettre un scan IA.
- Le compteur d’usage n’est mis à jour qu’après une réponse API réellement réussie.
- Les images d’étiquette sont envoyées uniquement après une action explicite et ne sont pas stockées par la fonction actuelle.

## Imports et exports

- Les imports destructifs demandent une confirmation et créent une sauvegarde préalable.
- L’export CSV neutralise les formules tableur commençant par `=`, `+`, `-` ou `@`.
- Les anciennes données restent exportables avant toute migration vers un compte.

## Paiement

Aucun paiement n’est configuré pendant la bêta. Aucune donnée bancaire n’est demandée. Toute future intégration devra passer par un backend sécurisé ; aucune clé Stripe secrète ne devra être intégrée au frontend.

## Vérifications avant ouverture publique

1. Appliquer et contrôler les politiques RLS dans le projet Supabase de production.
2. Compléter le contact et l’identité de l’éditeur dans les pages légales.
3. Tester deux comptes différents sur le même navigateur et vérifier l’absence de mélange de données.
4. Tester la suppression du compte et des données associées côté Supabase.
5. Contrôler les URL de redirection Auth et les secrets des Edge Functions.
