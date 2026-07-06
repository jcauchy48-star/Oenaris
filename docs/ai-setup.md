# Assistant IA Oenaris

L'assistant IA utilise une fonction Supabase Edge. La cle OpenAI reste uniquement dans les secrets Supabase et n'est jamais envoyee au navigateur.

## Deploiement initial

Depuis la racine du depot :

```bash
supabase login
supabase link --project-ref gdrpihlnfrfmnsbvrooc
supabase secrets set OPENAI_API_KEY=votre_cle_openai
supabase secrets set OPENAI_MODEL=gpt-5.4-mini
supabase functions deploy wine-advice --no-verify-jwt
```

La fonction valide elle-meme la session Supabase de l'utilisateur. Ne jamais ajouter `OPENAI_API_KEY` dans `cloud-config.js`, GitHub Pages ou une variable JavaScript frontend.

## Activation frontend

Dans GitHub, ajouter une variable Actions :

```text
CAVE_WINE_ADVICE_API_ENABLED=true
```

Relancer ensuite le workflow GitHub Pages. Sans cette variable, Oenaris conserve son conseil local instantane.

## Verification

1. Se connecter a Oenaris.
2. Ouvrir `Assistant cave`.
3. Demander un conseil avec au moins une bouteille en stock.
4. Verifier que le resultat affiche `Conseil IA securise`.
5. Retirer temporairement la variable d'activation et verifier le fallback `Analyse locale`.
