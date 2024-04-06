# Utilisation de l'image MySQL officielle comme base
FROM mysql:latest

COPY ./sql_password /sql_password

# Définition des variables d'environnement pour la configuration de MySQL
ENV MYSQL_DATABASE=socsport \
    # MYSQL_ROOT_PASSWORD=AliMaxou2002 \
    MYSQL_ROOT_PASSWORD_FILE=sql_password \
    MYSQL_USER=socsport-user \
    # MYSQL_PASSWORD=AliMaxou2002
    MYSQL_PASSWORD_FILE=sql_password 

# Exposition du port MySQL
EXPOSE 3306

# Commande pour exécuter MySQL
CMD ["mysqld", "--bind-address=172.29.0.2"]