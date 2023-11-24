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

terrain_sport_association = db.Table(
    'terrain_sport_association',
    db.Column('terrain_id', db.Integer, db.ForeignKey('terrain.id')),
    db.Column('sport_id', db.Integer, db.ForeignKey('sport.id'))
)

class Terrain(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(100))
    adresse = db.Column(db.String(100))
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    ville_id = db.Column(db.Integer, db.ForeignKey('ville.id'))
    horaire_ouverture = db.Column(db.Time)
    horaire_fermeture = db.Column(db.Time)
    ville = db.relationship('Ville', backref=db.backref('terrains', lazy=True))
    sports = db.relationship('Sport', secondary=terrain_sport_association, backref=db.backref('terrains', lazy=True))


class Evenement(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(100))
    date = db.Column(db.Date)
    heure_debut = db.Column(db.Time)
    heure_fin = db.Column(db.Time)
    terrain_id = db.Column(db.Integer, db.ForeignKey('terrain.id'))
    terrain = db.relationship('Terrain', backref=db.backref('evenements', lazy=True))

class Sport(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)


# Création des tables dans la base de données
with app.app_context():
    db.create_all()

# Déplacez la liste de terrains à ajouter à l'intérieur de l'app_context
villes_a_ajouter = [
    Ville(nom="Nanterre", code_postal=92000, departement="Hauts-de-Seine"),
    Ville(nom="Bois-Colombes", code_postal=92270, departement="Hauts-de-Seine"),
    Ville(nom="Arcueil", code_postal=94110, departement="Val-de-Marne"),
    Ville(nom="Le Kremlin-Bicêtre", code_postal=94270, departement="Val-de-Marne"),
    Ville(nom= "Ivry-sur-Seine", code_postal=94200, departement="Val-de-Marne"),
    Ville(nom="Saint-Denis", code_postal=93200, departement="Seine-Saint-Denis"),
    Ville(nom="Rueil-Malmaison", code_postal=92500, departement="Hauts-de-Seine"),
    Ville(nom="Puteaux", code_postal=92800, departement="Hauts-de-Seine"),
    Ville(nom="Suresnes", code_postal=92150, departement="Hauts-de-Seine"),
    Ville(nom="Paris", code_postal=75000, departement="Paris"),
    Ville(nom="Boulogne-Billancourt", code_postal=92100, departement="Hauts-de-Seine"),
]
terrains_a_ajouter = [
    Terrain(nom="Stade Vincent Pascucci", adresse="135 Avenue de la Commune de Paris", latitude=48.907273, longitude=2.207743, ville_id=1, horaire_ouverture='08:00:00', horaire_fermeture='22:00:00'),
    Terrain(nom="Stade Jean Coteau", adresse="81 Avenue François Vincent Raspail", latitude=48.807719, longitude=2.341501, ville_id=3, horaire_ouverture='09:00:00', horaire_fermeture='00:00:00'),
    Terrain(nom="Stade Albert Smirlian", adresse="11 Avenue Renée", latitude=48.9193427, longitude=2.2699387, ville_id=2, horaire_ouverture='10:00:00', horaire_fermeture='02:00:00'),
    Terrain(nom="Stade Emile Anthoine", adresse="2 Avenue de Suffren", latitude=48.8469924, longitude=2.3073936, ville_id=10, horaire_ouverture='08:00:00', horaire_fermeture='23:00:00'),
    Terrain(nom="Stade du Parc", adresse="298 Avenue Napoléon Bonaparte", latitude=48.8719843, longitude=2.1616405, ville_id=7, horaire_ouverture='08:00:00', horaire_fermeture='21:00:00'),
    Terrain(nom="Stade Jean Moulin", adresse="131 Boulevard Washington", latitude=48.8768955904541016, longitude=2.2169318199157715,ville_id=9, horaire_ouverture='09:00:00', horaire_fermeture='20:00:00'),
    Terrain(nom="Stade Léon Rabbot", adresse="2 Allée Georges Hassoux", latitude=48.8773421, longitude=2.2440671,ville_id=8, horaire_ouverture='08:00:00', horaire_fermeture='22:00:00'),
    Terrain(nom="Stade Landy", adresse="Rue Calon", latitude=48.9255492, longitude=2.3434684,ville_id=6, horaire_ouverture='08:00:00', horaire_fermeture='22:00:00'),
    Terrain(nom="Stade de Gournail", adresse="179 Bouelvard de Stalingrad", latitude=48.80597686767578, longitude=2.3757195472717285,ville_id=5, horaire_ouverture='07:00:00', horaire_fermeture='18:00:00'),
    Terrain(nom="Stade des Glacières", adresse="65 Rue Nationale", latitude=48.82695770263672, longitude=2.242238998413086,ville_id=10, horaire_ouverture='07:00:00', horaire_fermeture='20:00:00'),
    Terrain(nom="Stade Gabriel Péri", adresse="136 Avenue Frédéric et Irène Joliot-Curie", latitude=48.89232635498047, longitude=2.209458112716675,ville_id=1, horaire_ouverture='09:00:00', horaire_fermeture='03:00:00'),
]

sports_a_ajouter = [
    Sport(name="Football"),
    Sport(name="Basketball"),
    Sport(name="Tennis"),
    Sport(name="Handball"),
    Sport(name="Rugby"),
    Sport(name="Volleyball"),
    Sport(name="Badminton"),
    Sport(name="Athlétisme"),
    Sport(name="Boxe"),
    Sport(name="Judo"),
    Sport(name="Yoga"),
    Sport(name="Zumba"),
]

with app.app_context():
    for ville in villes_a_ajouter:
        # Vérifiez si un enregistrement avec le même nom existe déjà
        existant = Ville.query.filter_by(nom=ville.nom).first()

        # Si l'enregistrement n'existe pas, ajoutez-le
        if not existant:
            db.session.add(ville)

    db.session.commit()

with app.app_context():
    for terrain in terrains_a_ajouter:
        # Vérifiez si un enregistrement avec le même nom existe déjà
        existant = Terrain.query.filter_by(nom=terrain.nom).first()

        # Si l'enregistrement n'existe pas, ajoutez-le
        if not existant:
            db.session.add(terrain)

    db.session.commit()

with app.app_context():
    for sport in sports_a_ajouter:
        existing_sport = Sport.query.filter_by(name=sport.name).first()

        if not existing_sport:
            db.session.add(sport)

    db.session.commit()

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

@app.route('/events-for-field/<int:fieldId>', methods=['GET', 'POST'])
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
            'departement': terrain.ville.departement,
            'horaire_ouverture': str(terrain.horaire_ouverture),
            'horaire_fermeture': str(terrain.horaire_fermeture)
        })
    return jsonify(terrain_data)

# Lancement du serveur
if __name__ == '__main__':
    app.run(debug=True)