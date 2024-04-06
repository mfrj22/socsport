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

# Utilisation d'une image légère d'nginx pour servir l'application construite
FROM nginx:alpine

# Suppression de la configuration par défaut de Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copie des fichiers construits de l'application React.js dans le répertoire de travail de nginx
COPY --from=builder /app/build /usr/share/nginx/html

# Exposition du port 80 pour nginx
EXPOSE 80

# Commande pour démarrer nginx
CMD ["nginx", "-g", "daemon off;"]