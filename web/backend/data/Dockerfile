# Utilisation de l'image MySQL officielle comme base
FROM mysql:latest

# Définition des variables d'environnement pour la configuration de MySQL
ENV MYSQL_DATABASE=socsport \
    MYSQL_ROOT_PASSWORD=AliMaxou2002 \
    MYSQL_USER=socsport-user \
    MYSQL_PASSWORD=AliMaxou2002

# Exposition du port MySQL
EXPOSE 3306

# Commande pour exécuter MySQL
CMD ["mysqld", "--bind-address=172.29.0.2"]