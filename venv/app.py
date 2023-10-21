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
    
# Routes de l'API
@app.route('/nearest-fields', methods=['POST'])
def nearest_fields():
    user_location = request.get_json()  # Les coordonnées GPS de l'utilisateur
    user_coordinates = (user_location['latitude'], user_location['longitude'])

    nearest = []
    for terrain in Terrain.query.all():
        distance = geodesic(user_coordinates, (terrain.latitude, terrain.longitude)).kilometers
        nearest.append({'id': terrain.id, 'nom': terrain.nom, 'latitude': terrain.latitude, 'longitude': terrain.longitude, 'distance': distance})

    nearest = sorted(nearest, key=lambda x: x['distance'])

    return jsonify(nearest)

@app.route('/create-event/<int:fieldId>', methods=['POST'])
def create_event(fieldId):
    data = request.get_json()
    if 'name' in data and 'date' in data and 'startTime' in data and 'endTime' in data:
        terrain = Terrain.query.get(fieldId)
        if terrain:
            new_event = Evenement(
                nom=data['name'],
                date=data['date'],
                heure_debut=data['startTime'],
                heure_fin=data['endTime'],
                terrain_id=fieldId
            )
            db.session.add(new_event)
            db.session.commit()
            return jsonify({'message': 'Event created successfully'})
        else:
            # Terrain avec l'ID donné non trouvé
            return jsonify({'message': 'Invalid field ID'}), 400
    else:
        # Clés JSON manquantes
        return jsonify({'message': 'Invalid JSON data'}), 400

@app.route('/events-for-field/<int:fieldId>', methods=['GET'])
def events_for_field(fieldId):
    terrain = Terrain.query.get(fieldId)
    if terrain:
        events = Evenement.query.filter_by(terrain_id=fieldId).all()
        event_data = [{
            'nom': event.nom,
            'date': str(event.date),
            'heure_debut': str(event.heure_debut),
            'heure_fin': str(event.heure_fin)
        } for event in events]
        return jsonify(event_data)
    else:
        return jsonify({'message': 'Terrain non trouvé'}), 404

@app.route('/')
def index():
    # Renvoie la liste des terrains
    terrains = Terrain.query.all()
    terrain_data = []
    for terrain in terrains:
        terrain_data.append({
            'id': terrain.id,
            'nom': terrain.nom,
            'adresse': terrain.adresse,
            'latitude': terrain.latitude,
            'longitude': terrain.longitude,
            'ville': terrain.ville.nom,
            'code_postal': terrain.ville.code_postal,
            'departement': terrain.ville.departement
        })
    return jsonify(terrain_data)

# Lancement du serveur
if __name__ == '__main__':
    app.run(debug=True)