docker rm --force docker-data-instance
docker rm --force docker-back-instance
docker rm --force docker-front-instance
docker network rm ResProjet

docker network create --subnet 172.29.0.0/16 ResProjet

# Démarrage du conteneur docker-data
docker run --net ResProjet -d --name docker-data-instance docker-data

sleep 40

# Démarrage du conteneur docker-back
docker run --net ResProjet -p 5000:5000 -d --name docker-back-instance docker-back

# Attendre quelques secondes avant de démarrer le conteneur docker-front
sleep 10

# Démarrage du conteneur docker-front
docker run --net ResProjet -p 3000:3000 -d --name docker-front-instance docker-front