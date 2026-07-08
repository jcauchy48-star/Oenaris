# Suite IA Oenaris

La suite IA utilise deux fonctions Supabase Edge. La cle OpenAI reste uniquement dans les secrets Supabase et n'est jamais envoyee au navigateur.

- `wine-advice` : recommandations du sommelier avec fallback local.
- `wine-tools` : scan d'etiquette, aide aux notes de degustation, audit des fiches, suggestions d'achat et bilan de cave.

## Deploiement initial

Depuis la racine du depot :

```bash
supabase login
supabase link --project-ref gdrpihlnfrfmnsbvrooc
supabase secrets set OPENAI_API_KEY=votre_cle_openai
supabase secrets set OPENAI_MODEL=gpt-5.4-mini
supabase functions deploy wine-advice --no-verify-jwt
supabase functions deploy wine-tools --no-verify-jwt
```

La fonction valide elle-meme la session Supabase de l'utilisateur. Ne jamais ajouter `OPENAI_API_KEY` dans `cloud-config.js`, GitHub Pages ou une variable JavaScript frontend.

## Activation frontend

Dans GitHub, ajouter une variable Actions :

```text
CAVE_WINE_ADVICE_API_ENABLED=true
```

Relancer ensuite le workflow GitHub Pages. La meme variable active les deux fonctions IA. Sans cette variable, Oenaris conserve son conseil local et son scanner local limite.

## Verification

1. Se connecter a Oenaris.
2. Ouvrir `Assistant cave`.
3. Demander un conseil avec au moins une bouteille en stock.
4. Verifier que le resultat affiche `Conseil IA securise`.
5. Ouvrir `Scanner`, analyser une image et verifier le badge `Analyse IA`.
6. Tester les trois boutons `Outils IA` dans l'assistant.
7. Ouvrir une note de degustation, saisir quelques impressions et demander une suggestion.
8. Retirer temporairement la variable d'activation et verifier le fallback `Analyse locale`.

Les appels distants necessitent un solde API OpenAI actif. Un echec de quota ne bloque jamais le conseil local ni la saisie manuelle.
