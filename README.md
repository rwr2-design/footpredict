# FootPredict AI : déploiement rapide
1. Clé gratuite : https://www.football-data.org/client/register (reçue par e-mail).
2. Déployer : importer ce dossier sur vercel.com (New Project), puis ajouter la variable d'environnement FOOTBALL_DATA_TOKEN = votre clé. Deploy.
   En local : `npm install`, copier .env.example en .env.local, `npm run dev`.
Limites : offre gratuite = 10 requêtes/min (cache 5 min matchs, 1 h classements), Europa League non incluse.
