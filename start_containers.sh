docker rm --force docker-data-instance
docker rm --force docker-back-instance
docker rm --force docker-front-instance

# Démarrage du conteneur docker-data
docker run --net ResProjet -d --name docker-data-instance docker-data

# Attendre que le conteneur docker-data soit prêt
# echo "Vérification de la disponibilité du conteneur docker-data..."

# while true; do
#     if [ "$(docker inspect -f '{{.State.Running}}' docker-data-instance)" == "true" ]; then
#         echo "Conteneur docker-data en cours de démarrage..."
#         # if docker logs docker-data-instance | grep "ready for connections"; then
#         #     echo "Conteneur docker-data prêt."
#         break
#     else
#         echo "Attente de 10 secondes pour que docker-data soit prêt..."
#         sleep 10
#     fi
#     # fi
# done

sleep 60

# Démarrage du conteneur docker-back
docker run --net ResProjet -d --name docker-back-instance docker-back

# Attendre quelques secondes avant de démarrer le conteneur docker-front
sleep 60

# Démarrage du conteneur docker-front
docker run --net ResProjet -d --name docker-front-instance docker-front