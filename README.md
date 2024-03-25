[![Build](https://github.com/mfrj22/socsport/actions/workflows/python-app.yml/badge.svg)](https://github.com/mfrj22/socsport/actions/workflows/python-app.yml)
[![license: Apache 2.0](https://img.shields.io/badge/license-Apache_2.0-green)](LICENSE)
[![Tag](https://img.shields.io/github/v/release/mfrj22/socsport?label=Dernière%20version)](https://github.com/mfrj22/socsport/releases)

[![Test Coverage](https://api.codeclimate.com/v1/badges/a99728c8bb5241ef2c7f/test_coverage)](https://codeclimate.com/github/mfrj22/socsport/test_coverage)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=mfrj22_socsport&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=mfrj22_socsport)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=mfrj22_socsport&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=mfrj22_socsport)

[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=mfrj22_socsport&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=mfrj22_socsport)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=mfrj22_socsport&metric=bugs)](https://sonarcloud.io/summary/new_code?id=mfrj22_socsport)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=mfrj22_socsport&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=mfrj22_socsport)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=mfrj22_socsport&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=mfrj22_socsport)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=mfrj22_socsport&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=mfrj22_socsport)

# SocSport

SocSport - Application de Réservation de Terrains Sportifs :
Bienvenue dans SocSport, une application web qui permet aux utilisateurs de réserver des terrains sportifs à proximité de leur domicile. Cette application est construite avec un front React JS et un back Python, reliés entre eux à l'aide de l'API Flask.

## Installation
Avant de pouvoir utiliser SocSport sur votre système, vous devez effectuer quelques étapes d'installation. 

### 0. Prérequis
Assurez-vous d'avoir Python installé sur votre machine avec une version compatible (Python 3.12 ou supérieur recommandé). Vous pouvez vérifier si Python est installé en exécutant `python --version` dans votre terminal. Dans le cas où Python n'est pas installé, vous pouvez le faire en suivant les instructions sur le site officiel de Python : [Installation de Python](https://www.python.org/downloads/).

### 1. Installation de Flask
Vous pouvez installer Flask en lançant votre terminal de commande en tant qu'administrateur puis en entrant cette ligne de commande :

```
pip install Flask
```

### 2. Installation de Node.js
Si vous n'avez pas Node.js installé sur votre système, vous pouvez dans un premier temps le télécharger sur le site officiel : [Installation de Node.js](https://nodejs.org/fr).

### 3. Clonage du projet
Maintenant que Node.js et Flask sont installés, vous pouvez cloner le dépôt Github de SocSport sur votre machine locale en utilisant la commande suivante :

```
git clone https://github.com/mfrj22/socsport.git
```

### 4. Installation des librairies Python
Pour notre projet, nous avons utilisés différentes bibliothèques Python :

SQLAlchemy permet d'intégrer une base de donées SQL dans notre application Flask.
```
pip install Flask-SQLAlchemy
```

PyMySQL permet d'assurer la connectivité et la communication avec notre base de données MySQL.
```
pip install pymysql
```

Cryptography est utilisé pour renforcer la sécurité.
```
pip install cryptography
```

Geopy gère les opérations de géocalisation (calcul de distances entre des points géopgraphiques).
```
pip install geopy
```

PyTest permet d'exécuter des tests unitaires.
```
pip install pytest
```

Coverage permet d'obtenir la couverture de code et de créer un fichier avec les résultats.
```
pip install coverage
```

Python_Dotenv est utilisé pour utiliser les variables d'environnement du fichier .env.
```
pip install python_dotenv
```

### 4. Installation des modules React
Pour le bon fonctionnement de notre application, nous avons ajoutés des modules React :

```
npm install
```

```
npm install react-router-dom
```

```
npm install react-slick slick-carousel
```
### 5. Installation des modules Ollama

Si vous n'avez pas Ollama installé sur votre système, vous pouvez dans un premier temps le télécharger sur le site officiel : [Installation de Ollama](https://ollama.com/).

Une fois installé, vous pouvez l'utiliser sur notre application après avoir effectué la commande : 

```
pip install ollama
```

Vous avez la possibilité d'utiliser différents modèles. Nous avons choisi le modèle "mistral". 
Vous pouvez faire de même avec la commande :

```
 ollama run mistral
```

## Lancement de l'Application
Vous êtes maintenant prêt à lancer l'application !
Utilisez la commande suivante pour démarrer le serveur de développement :

```
npm start
```
Pour lancer l'API Flask, il vous faudra lancer un terminal depuis la racine du projet puis lancer cette ligne de commande :

```
python app.py
```

L'application sera disponible à l'adresse : [http://localhost:3000](http://localhost:3000)

L'API Flask sera disponible à l'adresse : [http://localhost:5000](http://localhost:5000)

## Utilisation de l'Application (v1.1)
La v1.1 de notre application SocSport vous permet de créer un événement en limitant l'inscription aux perosnnes possédant le mot de passe de l'événement. Elle permet également d'empêcher les organisateurs de créer des événements qui ont lieu au même moment et au même endroit. 
Ensuite, l'application permet de visualiser une fiche pour chaque terrain présent sur la carte avec :
* L'emplacement du terrain
* La météo actuelle sur le terrain
* Les points d'intêrets à proximité (la distance à ceux là, l'adresse et la catégorie)
Enfin, la v1.1 intègre un chatbot qui permet de répondre à toutes les questions de nutrition, blessures sportives, équipements...

Nous apprécions toutes les contributions et le feedback de la communauté !

---

Merci d'avoir choisi SocSport pour vos réservations de terrains sportifs. 

**L'équipe SocSport**
