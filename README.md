# Cave a vin

Mini application de gestion de cave a vin, installable en PWA et utilisable hors ligne.

## Fonctionnalites

- Ajout, modification et suppression de bouteilles
- Recherche, filtre par couleur et tri
- Statistiques de cave et valeur estimee
- Liste des bouteilles a surveiller
- Export/import JSON pour sauvegarder les donnees
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
