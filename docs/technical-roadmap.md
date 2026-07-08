# Oenaris - Technical roadmap

## Assistant cave IA

Les fonctions Supabase `wine-advice` et `wine-tools` couvrent le sommelier, le scan d'etiquette, les notes de degustation, l'audit des fiches, les suggestions d'achat et le bilan de cave. Leur activation reste conditionnee au secret OpenAI et a la variable frontend documentee dans `docs/ai-setup.md`.

Le fallback local du sommelier et du scanner reste disponible si l'API est desactivee, indisponible ou sans quota.

## État actuel

Oenaris est une PWA statique publiée sur GitHub Pages. L'accès à l'application nécessite un compte Supabase valide et passe par un parcours d'installation. Les données de cave restent disponibles localement avec `localStorage` et peuvent être synchronisées via Supabase.

## Limites connues

- Compte : obligatoire pour charger l'interface et les données de cave.
- Supabase : requis pour l'authentification. Sans configuration ou session valide, l'application reste verrouillée.
- Mode hors ligne : disponible après une première connexion et la mise en cache de la PWA ; il ne remplace pas la création de compte.
- IA : optionnelle. Sans les fonctions Supabase actives, le sommelier et le scanner utilisent leurs fallbacks locaux.
- Paiement : non configuré. Les offres, abonnements et packs scans sont des écrans préparatoires.
- Modèle cloud : `cellar_snapshots` reste la sauvegarde minimale. Les tables métier normalisées viendront plus tard.

## Prochaines étapes techniques

1. Stabiliser la reprise de session hors ligne et la synchronisation multi-appareils.
2. Mesurer les coûts, la latence et la qualité des outils IA avant ouverture large.
3. Déplacer les photos vers IndexedDB ou Supabase Storage.
4. Normaliser progressivement les données cloud : `wines`, `tasting_notes`, `wishlist_items`, `cellar_layouts`, `cellar_slots`, `wine_photos`, `sync_events`.
5. Activer un vrai parcours paiement uniquement côté backend sécurisé.

## Principes

- Ne pas exposer de clé secrète dans le frontend.
- Conserver les données locales existantes et l'usage hors ligne après authentification.
- Préférer des migrations progressives au big bang.
- Ajouter des vérifications automatisées à chaque durcissement.
