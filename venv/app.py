from flask import Flask, request, jsonify
from geopy.distance import geodesic
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
CORS(app)

# Configuration de la base de données
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:AliMaxou2002@localhost/socsport'
db = SQLAlchemy(app)

# Modèles de données
class Ville(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(100))
    code_postal = db.Column(db.Integer)
    departement = db.Column(db.String(100))

class Terrain(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(100))
    adresse = db.Column(db.String(100))
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    ville_id = db.Column(db.Integer, db.ForeignKey('ville.id'))
    ville = db.relationship('Ville', backref=db.backref('terrains', lazy=True))

class Evenement(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(100))
    date = db.Column(db.Date)
    heure_debut = db.Column(db.Time)
    heure_fin = db.Column(db.Time)
    terrain_id = db.Column(db.Integer, db.ForeignKey('terrain.id'))
    terrain = db.relationship('Terrain', backref=db.backref('evenements', lazy=True))

# Création des tables dans la base de données
with app.app_context():
    db.create_all()

# Lancement du serveur
if __name__ == '__main__':
    app.run(debug=True)