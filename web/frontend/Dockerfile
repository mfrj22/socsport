# Utilisation d'une image Node.js avec la version spécifiée
FROM node:20.8.0 AS builder

# Définition du répertoire de travail dans l'image
WORKDIR /app

ENV FRONTEND_IP=172.29.0.4

# Copie des fichiers package.json et package-lock.json dans le répertoire de travail
COPY ./package*.json ./

# Installation des dépendances
RUN npm install

# Copie du reste des fichiers du frontend dans le répertoire de travail
COPY ./src ./src
COPY ./public ./public

# Construction de l'application React.js
RUN npm run build

# Définit l'URL à 0.0.0.0 avant de démarrer l'application
ENV HOST=0.0.0.0

# Démarre l'application React.js
CMD ["npm", "start"]
