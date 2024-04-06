docker rm --force docker-data-instance
docker rm --force docker-back-instance
docker rm --force docker-front-instance

# Démarrage du conteneur docker-data
docker run --net ResProjet -d --name docker-data-instance docker-data

sleep 40

# Démarrage du conteneur docker-back
docker run --net ResProjet -d --name docker-back-instance docker-back

# Attendre quelques secondes avant de démarrer le conteneur docker-front
sleep 10

# Démarrage du conteneur docker-front
docker run --net ResProjet -d --name docker-front-instance docker-front