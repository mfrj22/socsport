# Utilisation d'une image Python avec la version spécifiée
FROM python:3.12.0

# Définition du répertoire de travail dans l'image
WORKDIR /app

# Copie du fichier des dépendances Python
COPY ./requirements.txt .

# Installation des dépendances Python
RUN python -m pip install --upgrade pip && \
    pip install -r requirements.txt

RUN apt-get update && apt-get install -y default-mysql-client

# Copie du point d'entrée de l'application Flask
COPY ./app.py .

COPY ./.env .

# Exposition du port 5000 pour Flask
EXPOSE 5000

# Commande pour démarrer l'application Flask
CMD ["python", "app.py", "--host", "172.29.0.3"]