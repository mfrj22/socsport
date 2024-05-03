# Utilisation de l'image MySQL officielle comme base
FROM mysql:latest

COPY ./sql_password.txt /sql_password.txt
COPY ./init.sql /docker-entrypoint-initdb.d/init.sql

# Définition des variables d'environnement pour la configuration de MySQL
ENV MYSQL_DATABASE=socsport \
    MYSQL_ROOT_PASSWORD_FILE=sql_password.txt \
    MYSQL_USER=socsport-user \
    MYSQL_PASSWORD_FILE=sql_password.txt 

# Exposition du port MySQL
EXPOSE 3307:3306

# Commande pour exécuter MySQL
# CMD ["mysqld", "--bind-address=172.29.0.2"]
CMD ["mysqld", "--bind-address=0.0.0.0"]
