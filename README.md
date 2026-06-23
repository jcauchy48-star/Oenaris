# Cave a vin

Mini application de gestion de cave a vin, installable en PWA et utilisable hors ligne.

## Fonctionnalites

- Ajout, modification et suppression de bouteilles
- Ajout rapide avec details avances
- Recherche, filtres avances et tri
- Favoris, tags et photos de bouteilles
- Gestion des emplacements cave / casier / rangee / colonne
- Consommation de bouteille avec historique des mouvements
- Alertes intelligentes et statistiques avancees
- Liste des bouteilles a surveiller
- Export/import JSON et CSV pour sauvegarder les donnees
- Vue imprimable pour inventaire PDF
- Fiche bouteille detaillee avec notes de degustation
- Wishlist d'achats a venir
- Assistant cave avec conseil local sans cle API
- Outils beta : feedback, diagnostic, changelog, sauvegarde/restauration
- Manifest PWA, icone et service worker

## Utilisation locale

Ouvrir `index.html` dans un navigateur, ou servir le dossier avec un petit serveur local.

Avec Node.js :

```powershell
node -e "const http=require('http'),fs=require('fs'),path=require('path');http.createServer((req,res)=>{const p=path.join(process.cwd(),req.url==='/'?'index.html':req.url);fs.readFile(p,(e,d)=>{if(e){res.writeHead(404);res.end('Not found');return;}res.end(d);});}).listen(8080,'127.0.0.1',()=>console.log('http://127.0.0.1:8080'))"
```

## Publication GitHub Pages

Le workflow GitHub Actions inclus publie automatiquement le site sur GitHub Pages a chaque push sur `main`.

Dans GitHub, aller dans `Settings > Pages`, puis choisir `GitHub Actions` comme source.
