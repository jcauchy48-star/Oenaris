# Oenaris - Feuille de route technique

## État de la bêta

Oenaris est une PWA statique publiée sur GitHub Pages. L’application est verrouillée sans session Supabase valide et l’installation est recommandée par un parcours guidé.

Les données du navigateur sont séparées par identifiant utilisateur. Un nouveau compte démarre avec une cave vide. Les données historiques non scoppées ne sont importées qu’après une confirmation visible et restent intactes à leur emplacement d’origine.

L’offre Découverte est gratuite pendant la bêta. Aucun paiement n’est actif.

## Services optionnels

- **Supabase Auth** : requis pour ouvrir l’application.
- **Sauvegarde Supabase** : disponible lorsque le projet et les tables sont correctement configurés ; le modèle `cellar_snapshots` reste une première étape.
- **IA** : optionnelle. Les fonctions `wine-advice` et `wine-tools` nécessitent les secrets Supabase adéquats. En cas d’indisponibilité, Oenaris utilise un conseil intégré ou une détection limitée et l’indique clairement.
- **Paiement** : non configuré. Aucun parcours Stripe n’est actif.

## Limites connues

- Une première connexion nécessite un accès réseau à Supabase.
- La synchronisation multi-appareils repose encore principalement sur un snapshot global de cave.
- Les photos en dataURL peuvent atteindre les limites de stockage du navigateur malgré la compression.
- La détection d’installation PWA varie selon le navigateur ; le parcours permet donc de continuer après consultation des instructions.
- La suppression complète d’un compte nécessite encore une procédure opérateur côté Supabase.
- Les coordonnées légales doivent être complétées avant l’ouverture publique.

## Prochaines étapes

1. Tester l’isolation des données avec deux comptes et plusieurs navigateurs.
2. Vérifier et appliquer RLS dans le projet Supabase de production.
3. Stabiliser les conflits de synchronisation multi-appareils.
4. Déplacer les photos vers IndexedDB ou Supabase Storage.
5. Normaliser progressivement `wines`, `tasting_notes`, `wishlist_items`, `cellar_layouts`, `cellar_slots`, `wine_photos` et `sync_events`.
6. Mesurer coûts, latence et qualité des fonctions IA avant ouverture large.
7. Mettre en place la suppression autonome du compte et compléter les pages légales.
8. Étudier un paiement uniquement après validation du modèle commercial, via un backend sécurisé.

## Principes

- Aucune clé secrète dans le frontend.
- RLS obligatoire pour chaque donnée personnelle.
- Pas de chargement de cave avant validation de la session.
- Pas de migration silencieuse susceptible de mélanger deux utilisateurs.
- Exports disponibles avant les opérations destructives.
- Migrations progressives et vérifications automatisées à chaque étape.
