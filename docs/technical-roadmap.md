# Oenova - Technical roadmap

## État actuel

Oenova est une PWA statique publiée sur GitHub Pages. L'application reste utilisable en local/offline avec `localStorage`, et peut synchroniser une sauvegarde cloud via Supabase lorsque la configuration est présente.

## Limites connues

- Mode local : les données restent dans le navigateur tant que l'utilisateur ne se connecte pas à Supabase.
- Supabase : optionnel. Sans configuration ou session valide, les actions cloud restent désactivées.
- IA scanner : optionnelle. Sans backend `/api/scan-wine-label` explicitement configuré, le scanner utilise une analyse locale limitée.
- Paiement : non configuré. Les offres, abonnements et packs scans sont des écrans préparatoires.
- Modèle cloud : `cellar_snapshots` reste la sauvegarde minimale. Les tables métier normalisées viendront plus tard.

## Prochaines étapes techniques

1. Stabiliser les parcours compte client et synchronisation.
2. Introduire une API backend sécurisée pour le scan IA et les conseils avancés.
3. Déplacer les photos vers IndexedDB ou Supabase Storage.
4. Normaliser progressivement les données cloud : `wines`, `tasting_notes`, `wishlist_items`, `cellar_layouts`, `cellar_slots`, `wine_photos`, `sync_events`.
5. Activer un vrai parcours paiement uniquement côté backend sécurisé.

## Principes

- Ne pas exposer de clé secrète dans le frontend.
- Garder le mode local/offline fonctionnel.
- Préférer des migrations progressives au big bang.
- Ajouter des vérifications automatisées à chaque durcissement.
