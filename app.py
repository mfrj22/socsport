import os
from flask import Flask, request, jsonify
from geopy.distance import geodesic
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
from sqlalchemy import func
from sqlalchemy.sql import func
from sqlalchemy.sql.expression import text
import logging

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

db_password = os.getenv('DB_PASSWORD')

# Configuration de la base de données
app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+pymysql://root:{db_password}@localhost/socsport"
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


class Sport(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)

class Reservation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    evenement_id = db.Column(db.Integer, db.ForeignKey('evenement.id'))
    nom_participant = db.Column(db.String(100))
    prenom_participant = db.Column(db.String(100))
    email_participant = db.Column(db.String(100))
    tel_participant = db.Column(db.String(100))
    evenement = db.relationship('Evenement', backref=db.backref('reservations', lazy=True))
    username = db.Column(db.String(80), db.ForeignKey('user.username')) 

class Note(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    evenement_id = db.Column(db.Integer, db.ForeignKey('evenement.id'))
    note = db.Column(db.Integer)
    evenement = db.relationship('Evenement', backref=db.backref('notes', lazy=True))

class User(db.Model):
    username = db.Column(db.String(80), primary_key=True)

class Evenement(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(100))
    date = db.Column(db.Date)
    heure_debut = db.Column(db.Time)
    heure_fin = db.Column(db.Time)
    nb_participants = db.Column(db.Integer)
    terrain_id = db.Column(db.Integer, db.ForeignKey('terrain.id'))
    terrain = db.relationship('Terrain', backref=db.backref('evenements', lazy=True))
    username = db.Column(db.String(80), db.ForeignKey('user.username'), nullable=False)
    mot_de_passe = db.Column(db.String(100)) 


class StatUser(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), db.ForeignKey('user.username'))
    score = db.Column(db.Float)

class Connaissance(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), db.ForeignKey('user.username'))
    connaissance = db.Column(db.String(80), db.ForeignKey('user.username'))

# Création des tables dans la base de données
with app.app_context():
    db.create_all()


# Déplacer la liste de terrains à ajouter à l'intérieur de l'app_context
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
    Terrain(nom="Stade Jean Coteau", adresse="81 Avenue François Vincent Raspail", latitude=48.807719, longitude=2.341501, ville_id=3, horaire_ouverture='09:00:00', horaire_fermeture='23:00:00'),
    Terrain(nom="Stade Albert Smirlian", adresse="11 Avenue Renée", latitude=48.9193427, longitude=2.2699387, ville_id=2, horaire_ouverture='10:00:00', horaire_fermeture='21:00:00'),
    Terrain(nom="Stade Emile Anthoine", adresse="2 Avenue de Suffren", latitude=48.8469924, longitude=2.3073936, ville_id=10, horaire_ouverture='08:00:00', horaire_fermeture='23:00:00'),
    Terrain(nom="Stade du Parc", adresse="298 Avenue Napoléon Bonaparte", latitude=48.8719843, longitude=2.1616405, ville_id=7, horaire_ouverture='08:00:00', horaire_fermeture='21:00:00'),
    Terrain(nom="Stade Jean Moulin", adresse="131 Boulevard Washington", latitude=48.8768955904541016, longitude=2.2169318199157715,ville_id=9, horaire_ouverture='09:00:00', horaire_fermeture='20:00:00'),
    Terrain(nom="Stade Léon Rabbot", adresse="2 Allée Georges Hassoux", latitude=48.8773421, longitude=2.2440671,ville_id=8, horaire_ouverture='08:00:00', horaire_fermeture='22:00:00'),
    Terrain(nom="Stade Landy", adresse="Rue Calon", latitude=48.9255492, longitude=2.3434684,ville_id=6, horaire_ouverture='08:00:00', horaire_fermeture='22:00:00'),
    Terrain(nom="Stade de Gournail", adresse="179 Bouelvard de Stalingrad", latitude=48.80597686767578, longitude=2.3757195472717285,ville_id=5, horaire_ouverture='07:00:00', horaire_fermeture='18:00:00'),
    Terrain(nom="Stade des Glacières", adresse="65 Rue Nationale", latitude=48.82695770263672, longitude=2.242238998413086,ville_id=10, horaire_ouverture='07:00:00', horaire_fermeture='20:00:00'),
    Terrain(nom="Stade Gabriel Péri", adresse="136 Avenue Frédéric et Irène Joliot-Curie", latitude=48.89232635498047, longitude=2.209458112716675,ville_id=1, horaire_ouverture='09:00:00', horaire_fermeture='23:00:00'),
]

sports_a_ajouter = [
    Sport(name="Football"),
    Sport(name="Basketball"),
    Sport(name="Tennis"),
    Sport(name="Handball"),
    Sport(name="Rugby"),
    Sport(name="Boxe"),
]

with app.app_context():
    for ville in villes_a_ajouter:
        # Vérifier si un enregistrement avec le même nom existe déjà
        existant = Ville.query.filter_by(nom=ville.nom).first()

        # Si l'enregistrement n'existe pas, on l'ajoute
        if not existant:
            db.session.add(ville)

    db.session.commit()

with app.app_context():
    for terrain in terrains_a_ajouter:
        # Vérifier si un enregistrement avec le même nom existe déjà
        existant = Terrain.query.filter_by(nom=terrain.nom).first()

        # Si l'enregistrement n'existe pas, on l'ajoute
        if not existant:
            db.session.add(terrain)

    db.session.commit()

with app.app_context():
    for sport in sports_a_ajouter:
        existing_sport = Sport.query.filter_by(name=sport.name).first()

        if not existing_sport:
            db.session.add(sport)

    db.session.commit()

with app.app_context():
    # Ajouter les associations entre les terrains et les sports dans la table d'association
    # Terrain 1
    # Terrain 1
    terrain1 = Terrain.query.get(1)
    football = Sport.query.get(1)
    basketball = Sport.query.get(2)
    tennis = Sport.query.get(3)
    handball = Sport.query.get(4)
    rugby = Sport.query.get(5)
    boxe = Sport.query.get(6)

    # vérifier que l'association n'existe pas déjà
    if football not in terrain1.sports and basketball not in terrain1.sports and tennis not in terrain1.sports and handball not in terrain1.sports and rugby not in terrain1.sports and boxe not in terrain1.sports:
        # Ajouter les associations entre le terrain et les sports dans la table d'association
        terrain1.sports.append(football)
        terrain1.sports.append(basketball)
        terrain1.sports.append(handball)

    # Terrain 2
    terrain2 = Terrain.query.get(2)
    if football not in terrain2.sports and basketball not in terrain2.sports and tennis not in terrain2.sports and handball not in terrain2.sports and rugby not in terrain2.sports and boxe not in terrain2.sports:
        terrain2.sports.append(boxe)

    # Terrain 3
    terrain3 = Terrain.query.get(3)
    if football not in terrain3.sports and basketball not in terrain3.sports and tennis not in terrain3.sports and handball not in terrain3.sports and rugby not in terrain3.sports and boxe not in terrain3.sports:
        terrain3.sports.append(tennis)
        terrain3.sports.append(rugby)

    # Terrain 4
    terrain4 = Terrain.query.get(4)
    if football not in terrain4.sports and basketball not in terrain4.sports and tennis not in terrain4.sports and handball not in terrain4.sports and rugby not in terrain4.sports and boxe not in terrain4.sports:
        terrain4.sports.append(football)
        terrain4.sports.append(basketball)
        terrain4.sports.append(tennis)
        terrain4.sports.append(handball)
        terrain4.sports.append(rugby)
        terrain4.sports.append(boxe)


    # Terrain 5
    terrain5 = Terrain.query.get(5)
    if football not in terrain5.sports and basketball not in terrain5.sports and tennis not in terrain5.sports and handball not in terrain5.sports and rugby not in terrain5.sports and boxe not in terrain5.sports:
        terrain5.sports.append(football)
        terrain5.sports.append(basketball)
        terrain5.sports.append(tennis)
        terrain5.sports.append(handball)
        terrain5.sports.append(rugby)
        terrain5.sports.append(boxe)

    # Terrain 6
    terrain6 = Terrain.query.get(6)
    if football not in terrain6.sports and basketball not in terrain6.sports and tennis not in terrain6.sports and handball not in terrain6.sports and rugby not in terrain6.sports and boxe not in terrain6.sports:
        terrain6.sports.append(football)
        terrain6.sports.append(basketball)
        terrain6.sports.append(tennis)

    # Terrain 7
    terrain7 = Terrain.query.get(7)
    if football not in terrain7.sports and basketball not in terrain7.sports and tennis not in terrain7.sports and handball not in terrain7.sports and rugby not in terrain7.sports and boxe not in terrain7.sports:
        terrain7.sports.append(football)
        terrain7.sports.append(basketball)
        terrain7.sports.append(tennis)
        terrain7.sports.append(handball)


    # Terrain 8
    terrain8 = Terrain.query.get(8)
    if football not in terrain8.sports and basketball not in terrain8.sports and tennis not in terrain8.sports and handball not in terrain8.sports and rugby not in terrain8.sports and boxe not in terrain8.sports:
        terrain8.sports.append(football)
        terrain8.sports.append(basketball)

    # Terrain 9
    terrain9 = Terrain.query.get(9)
    if football not in terrain9.sports and basketball not in terrain9.sports and tennis not in terrain9.sports and handball not in terrain9.sports and rugby not in terrain9.sports and boxe not in terrain9.sports:
        terrain9.sports.append(football)
        terrain9.sports.append(basketball)
        terrain9.sports.append(tennis)

    # Terrain 10
    terrain10 = Terrain.query.get(10)
    if football not in terrain10.sports and basketball not in terrain10.sports and tennis not in terrain10.sports and handball not in terrain10.sports and rugby not in terrain10.sports and boxe not in terrain10.sports:
        terrain10.sports.append(football)
        terrain10.sports.append(basketball)

    # Terrain 11
    terrain11 = Terrain.query.get(11)
    if football not in terrain11.sports and basketball not in terrain11.sports and tennis not in terrain11.sports and handball not in terrain11.sports and rugby not in terrain11.sports and boxe not in terrain11.sports:
        terrain11.sports.append(football)
        terrain11.sports.append(basketball)

    db.session.commit()
@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
    response.headers['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE,OPTIONS'
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    return response

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')

    # Vérifier si l'utilisateur existe dans la base de données
    user = User.query.filter_by(username=username).first()

    if user:
        response = {'message': 'Utilisateur connecté'}
    else:
        # Créer l'utilisateur s'il n'existe pas
        new_user = User(username=username)
        db.session.add(new_user)
        db.session.commit()
        response = {'message': 'Nouvel utilisateur créé'}

    return jsonify(response)


# Routes de l'API
@app.route('/nearest-fields', methods=['POST'])
def nearest_fields():
    user_location = request.get_json()  # Les coordonnées GPS de l'utilisateur
    user_coordinates = (user_location['latitude'], user_location['longitude'])

    nearest = []
    for terrain in Terrain.query.all():
        distance = geodesic(user_coordinates, (terrain.latitude, terrain.longitude)).kilometers
        nearest.append({
                'id': terrain.id,
                'nom': terrain.nom,
                'latitude': terrain.latitude,
                'longitude': terrain.longitude,
                'distance': distance,
                'horaire_ouverture': str(terrain.horaire_ouverture),
                'horaire_fermeture': str(terrain.horaire_fermeture),
                'sports': [sport.name for sport in terrain.sports],
            })

    nearest = sorted(nearest, key=lambda x: x['distance'])

    return jsonify(nearest)

# @app.route('/create-event/<int:fieldId>', methods=['POST'])
# def create_event(fieldId):
#     data = request.get_json()
#     if 'name' in data and 'date' in data and 'startTime' in data and 'endTime' in data and 'nbParticipants' in data:
#         terrain = Terrain.query.get(fieldId)
#         if terrain:
#             new_event = Evenement(
#                 nom=data['name'],
#                 date=data['date'],
#                 heure_debut=data['startTime'],
#                 heure_fin=data['endTime'],
#                 nb_participants=data['nbParticipants'],
#                 terrain_id=fieldId
#             )
#             db.session.add(new_event)
#             db.session.commit()
#             return jsonify({'message': 'Event created successfully'})
#         else:
#             # Terrain avec l'ID donné non trouvé
#             return jsonify({'message': 'Invalid field ID'}), 400
#     else:
#         # Clés JSON manquantes
#         return jsonify({'message': 'Invalid JSON data'}), 400
@app.route('/create-event/<int:fieldId>', methods=['POST'])
def create_event(fieldId):
    data = request.get_json()
    if 'name' in data and 'date' in data and 'startTime' in data and 'endTime' in data and 'nbParticipants' in data and 'username' in data:
        terrain = Terrain.query.get(fieldId)
        user = User.query.get(data['username'])
        if terrain:
            # Vérifier si un événement se déroule déjà à la même date et heure
            existing_events = Evenement.query.filter(Evenement.date==data['date'], Evenement.terrain_id==fieldId, Evenement.heure_debut<data['endTime'], Evenement.heure_fin>data['startTime']).all()
            if existing_events:
                # Un ou plusieurs événements existent déjà à la même date et heure
                return jsonify({'message': 'An event already exists at the same date and time'}), 400

            new_event = Evenement(
                nom=data['name'],
                date=data['date'],
                heure_debut=data['startTime'],
                heure_fin=data['endTime'],
                nb_participants=data['nbParticipants'],
                terrain_id=fieldId,
                username=data['username'],
                mot_de_passe=data['mot_de_passe']
            )
            db.session.add(new_event)
            db.session.commit()
            
            # Récupérer le nom du terrain associé à l'ID
            terrain_name = terrain.nom  # Assurez-vous que votre modèle Terrain a un attribut 'nom'
            
            # Retourner la réponse JSON avec le nom du terrain
            return jsonify({'message': 'Event created successfully', 'terrain_name': terrain_name})
        else:
            # Terrain avec l'ID donné non trouvé
            return jsonify({'message': 'Invalid field ID'}), 400
    else:
        # Clés JSON manquantes
        return jsonify({'message': 'Invalid JSON data'}), 400

@app.route('/add-reservation', methods=['POST'])
def create_reservation():
    data = request.get_json()

    if 'evenement_id' in data and 'nom_participant' in data and 'prenom_participant' in data and 'email_participant' in data and 'tel_participant' in data and 'event_password' in data:
        evenement_id = data['evenement_id']
        evenement = Evenement.query.get(evenement_id)

        if evenement and evenement.nb_participants > 0 and evenement.mot_de_passe==data.get('event_password'):

            new_reservation = Reservation(
                evenement_id=evenement_id,
                nom_participant=data['nom_participant'],
                prenom_participant=data['prenom_participant'],
                email_participant=data['email_participant'],
                tel_participant=data['tel_participant'],
                username=data['username'],
            )
            # décrémenter le nombre de participants
            evenement.nb_participants -= 1

            db.session.add(new_reservation)
            db.session.commit()

            # récupérer l'id de la réservation créée
            reservation_id = new_reservation.id

            # récupérer les détails de l'événement
            event_details = {
                'id': evenement.id,
                'nom': evenement.nom,
                'date': str(evenement.date),
                'heure_debut': str(evenement.heure_debut),
                'heure_fin': str(evenement.heure_fin),
                'nb_participants': evenement.nb_participants,
                'mot_de_passe': evenement.mot_de_passe
            }

            return jsonify({
                'message': 'Reservation created successfully',
                'evenement_id': evenement_id,
                'event_details': event_details

            })
        else:
            # Événement avec l'ID donné non trouvé
            return jsonify({'message': 'Invalid'}), 400
    else:
        # Clés JSON manquantes
        return jsonify({'message': 'Invalid JSON data'}), 400


@app.route('/events-for-field/<int:fieldId>', methods=['GET', 'POST'])
def events_for_field(fieldId):
    terrain = Terrain.query.get(fieldId)
    if terrain:
        events = Evenement.query.filter_by(terrain_id=fieldId).all()
        event_data = [{
            'id': event.id,  # Ajouter l'ID de l'événement à la réponse JSON
            'nom': event.nom,
            'date': str(event.date),
            'heure_debut': str(event.heure_debut),
            'heure_fin': str(event.heure_fin),
            'nb_participants': event.nb_participants,
        } for event in events]
        return jsonify(event_data)
    else:
        return jsonify({'message': 'Terrain non trouvé'}), 404

@app.route('/ajouter-terrain', methods=['POST'])
def ajouter_terrain():
    data = request.get_json()
    nom = data.get('nom')
    adresse = data.get('adresse')
    latitude = data.get('latitude')
    longitude = data.get('longitude')
    ville_nom = data.get('ville')
    code_postal = data.get('code_postal')
    departement = data.get('departement')
    horaire_ouverture = data.get('horaire_ouverture')
    horaire_fermeture = data.get('horaire_fermeture')
    # sports_ids = data.get('sport')  # Utiliser les ID des sports sélectionnés
    #Utilise les ids des sports sélectionnés par l'utilisateur dans la checkbox
    sports_ids = Sport.query.filter(Sport.id.in_(data.get('sport'))).all()

    # Vérifier si la ville existe dans la base de données
    ville = Ville.query.filter_by(nom=ville_nom).first()
    if not ville:
        # Si la ville n'existe pas, on l'ajoute
        ville = Ville(nom=ville_nom, code_postal=code_postal, departement=departement)

        db.session.add(ville)
        db.session.commit()

    # Ajouter le terrain
    nouveau_terrain = Terrain(
        nom=nom,
        adresse=adresse,
        latitude=latitude,
        longitude=longitude,
        ville_id=ville.id,
        horaire_ouverture=horaire_ouverture,
        horaire_fermeture=horaire_fermeture,
    )

    db.session.add(nouveau_terrain)
    db.session.commit()

    # Ajouter les associations entre le terrain et les sports dans la table d'association
    for sport_id in sports_ids:
        sport = Sport.query.get(sport_id.id)
        if sport:
            # association = terrain_sport_association.insert().values(terrain_id=nouveau_terrain.id, sport_id=sport_id)
            nouveau_terrain.sports.append(sport)

    # Commit les changements dans la base de données
    db.session.commit()

    return jsonify({'message': 'Terrain ajouté avec succès'})


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

@app.route('/sports')
def sports():
    sports = Sport.query.all()
    sports_data = [{'id': sport.id, 'name': sport.name} for sport in sports]
    return jsonify(sports_data)

@app.route('/events-for-sport/<int:sportId>', methods=['GET'])
def events_for_sport(sportId):
    sport = Sport.query.get(sportId)
    if sport:
        terrains = sport.terrains
        events = []
        for terrain in terrains:
            for event in terrain.evenements:
                events.append({
                    'id': event.id,
                    'nom': event.nom,
                    'date': str(event.date),
                    'heure_debut': str(event.heure_debut),
                    'heure_fin': str(event.heure_fin),
                    'nb_participants': event.nb_participants,
                    'terrain': {
                        'id': terrain.id,
                        'nom': terrain.nom,
                        'adresse': terrain.adresse,
                        'latitude': terrain.latitude,
                        'longitude': terrain.longitude,
                        'ville': terrain.ville.nom,
                        'code_postal': terrain.ville.code_postal,
                        'departement': terrain.ville.departement,
                        'horaire_ouverture': str(terrain.horaire_ouverture),
                        'horaire_fermeture': str(terrain.horaire_fermeture),
                        'sports': [sport.name for sport in terrain.sports]
                    }
                })
        return jsonify(events)
    else:
        return jsonify({'message': 'Sport non trouvé'}), 404

@app.route('/all-reservations', methods=['GET'])
def get_all_reservations():
    reservations = Reservation.query.all()
    reservations_data = []

    for reservation in reservations:
        reservations_data.append({
            'id': reservation.id,
            'evenement_id': reservation.evenement_id,
            'nom_participant': reservation.nom_participant,
            'prenom_participant': reservation.prenom_participant,
            'email_participant': reservation.email_participant,
            'tel_participant': reservation.tel_participant,
            'user_id': reservation.user_id,
        })

    return jsonify(reservations_data)

@app.route('/note-event/<int:eventId>', methods=['POST'])
def add_note_to_event(eventId):
    data = request.get_json()
    if 'note' in data:
        event = Evenement.query.get(eventId)
        if event:
            new_note = Note(
                evenement_id=eventId,
                note=data['note']
            )
            db.session.add(new_note)
            db.session.commit()
            return jsonify({'message': 'Note added successfully'})
        else:
            return jsonify({'message': 'Invalid event ID'}), 400
    else:
        return jsonify({'message': 'Invalid JSON data'}), 400

@app.route('/average-notes')
def get_average_notes():
    average_notes = (
        db.session.query(Note.evenement_id, func.avg(Note.note).label('average_note'))
        .group_by(Note.evenement_id)
        .all()
    )

    average_notes_dict = {event_id: average_note for event_id, average_note in average_notes}

    return jsonify(average_notes_dict)

@app.route('/classement-events')
def get_classement():
    average_notes = (
        db.session.query(
            Evenement.id.label('evenement_id'),
            Evenement.nom.label('evenement_nom'),
            func.avg(Note.note).label('average_note')
        )
        .join(Note, Evenement.id == Note.evenement_id)
        .group_by(Evenement.id, Evenement.nom)
        .all()
    )

    average_notes_list = [
        {'evenement_id': event_id, 'evenement_nom': evenement_nom, 'average_note': average_note}
        for event_id, evenement_nom, average_note in average_notes
    ]

    return jsonify(average_notes_list)

@app.route('/classement-users')
def get_classement_users():
    users = (
        db.session.query(
            User.id.label('user_id'),
            User.username.label('username'),
            func.sum(StatUser.score).label('total_score')
        )
        .join(StatUser, User.id == StatUser.user_id)
        .group_by(User.id, User.username)
        .all()
    )

    users_list = [
        {'user_id': user_id, 'username': username, 'total_score': total_score}
        for user_id, username, total_score in users
    ]

    return jsonify(users_list)

@app.route('/add-score', methods=['POST'])
def add_score():
    data = request.get_json()
    if 'username' in data and 'score' in data:
        user = User.query.get(data['username'])
        if user:
            new_score = StatUser(
                username=data['username'],
                score=data['score']
            )
            db.session.add(new_score)
            db.session.commit()
            return jsonify({'message': 'Score added successfully'})
        else:
            return jsonify({'message': 'Invalid user ID'}), 400
    else:
        return jsonify({'message': 'Invalid JSON data'}), 400


@app.route('/historique/<string:username>', methods=['GET'])
def get_historique(username):
    user = User.query.filter_by(username=username).first()

    if user:
        historique = Reservation.query.filter_by(username=username).all()
        historique_data = [
            {
                'id': res.id,
                'nom': res.evenement.nom,
                'date': str(res.evenement.date),
                'heure_debut': str(res.evenement.heure_debut),
                'heure_fin': str(res.evenement.heure_fin),
                'evenement_id': res.evenement_id,
            }
            for res in historique
        ]
        return jsonify(historique_data)
    else:
        return jsonify({'message': 'Utilisateur non trouvé'}), 404

@app.route('/notifications/<string:username>', methods=['GET'])
def get_notifications(username):
    user = User.query.filter_by(username=username).first()

    if user:
        notifications = (
            db.session.query(
                Evenement.id.label('evenement_id'),
                Evenement.nom.label('evenement_nom'),
                Evenement.date.label('evenement_date'),
                Evenement.heure_debut.label('evenement_heure_debut'),
                Evenement.heure_fin.label('evenement_heure_fin'),
                Terrain.id.label('terrain_id'),
                Terrain.nom.label('terrain_nom'),
                Terrain.adresse.label('terrain_adresse'),
                Ville.nom.label('ville_nom'),
                Ville.code_postal.label('ville_code_postal'),
                Ville.departement.label('ville_departement'),
            )
            .join(Terrain, Evenement.terrain_id == Terrain.id)
            .join(Ville, Terrain.ville_id == Ville.id)
            .join(Reservation, Evenement.id == Reservation.evenement_id)
            .filter(Reservation.username == username)
            .filter(Evenement.date <= func.date_add(func.curdate(), text('interval 7 day')))
            .filter(Evenement.date >= func.curdate())
            .all()
        )

        notifications_list = [
            {
                'evenement_id': evenement_id,
                'evenement_nom': evenement_nom,
                'evenement_date': str(evenement_date),
                'evenement_heure_debut': str(evenement_heure_debut),
                'evenement_heure_fin': str(evenement_heure_fin),
                'terrain_id': terrain_id,
                'terrain_nom': terrain_nom,
                'terrain_adresse': terrain_adresse,
                'ville_nom': ville_nom,
                'ville_code_postal': ville_code_postal,
                'ville_departement': ville_departement,
            }
            for (
                evenement_id,
                evenement_nom,
                evenement_date,
                evenement_heure_debut,
                evenement_heure_fin,
                terrain_id,
                terrain_nom,
                terrain_adresse,
                ville_nom,
                ville_code_postal,
                ville_departement,
            ) in notifications
        ]

        return jsonify(notifications_list)
    else:
        return jsonify({'message': 'Utilisateur non trouvé'}), 404

# fonction pour supprimer une réservation d'un événement
@app.route('/delete-reservation/<int:reservationId>', methods=['DELETE'])
def delete_reservation(reservationId):
    reservation = Reservation.query.get(reservationId)
    if reservation:
        evenement = Evenement.query.get(reservation.evenement_id)
        if evenement:
            evenement.nb_participants += 1
            db.session.delete(reservation)
            db.session.commit()
            return jsonify({'message': 'Reservation deleted successfully'})
        else:
            return jsonify({'message': 'Associated event not found'}), 404
    else:
        return jsonify({'message': 'Invalid reservation ID'}), 400


# réservations de l'utilisateur
@app.route('/user-reservations/<string:username>', methods=['GET'])
def get_user_reservations(username):
    user = User.query.filter_by(username=username).first()

    if user:
        reservations = Reservation.query.filter_by(username=username).all()
        reservations_data = [
            {
                'id': res.id,
                'evenement_id': res.evenement_id,
                'nom_participant': res.nom_participant,
                'prenom_participant': res.prenom_participant,
                'email_participant': res.email_participant,
                'tel_participant': res.tel_participant,
            }
            for res in reservations
        ]
        return jsonify(reservations_data)
    else:
        return jsonify({'message': 'Utilisateur non trouvé'}), 404

# fonction pour calculer la moyenne des scores des participants
@app.route('/average-score-users', methods=['GET'])
def get_average_score_users():
    average_scores = (
        db.session.query(
            Reservation.username.label('username'),
            func.avg(StatUser.score).label('average_score')
        )
        .join(StatUser, Reservation.username == StatUser.username)
        .group_by(Reservation.username)
        .all()
    )

    average_scores_dict = {username: average_score for username, average_score in average_scores}

    return jsonify(average_scores_dict)

# fonction pour calculer la moyenne des scores des participants d'un événement et l'ajouter à la base de données
@app.route('/average-score-event/<int:eventId>', methods=['GET'])
def get_average_score_event(eventId):
    average_scores = (
        db.session.query(
            Reservation.evenement_id.label('evenement_id'),
            func.avg(StatUser.score).label('average_score')
        )
        .join(StatUser, Reservation.username == StatUser.username)
        .group_by(Reservation.evenement_id)
        .filter(Reservation.evenement_id == eventId)
        .all()
    )

    average_scores_dict = {evenement_id: average_score for evenement_id, average_score in average_scores}

    return jsonify(average_scores_dict)

# fonction pour récupérer les événements qui ne sont pas encore passés
@app.route('/upcoming-events', methods=['GET'])
def get_upcoming_events():
    upcoming_events = (
        db.session.query(
            Evenement.id.label('evenement_id'),
            Evenement.nom.label('evenement_nom'),
            Evenement.date.label('evenement_date'),
            Evenement.heure_debut.label('evenement_heure_debut'),
            Evenement.heure_fin.label('evenement_heure_fin'),
            Terrain.id.label('terrain_id'),
            Terrain.nom.label('terrain_nom'),
            Terrain.adresse.label('terrain_adresse'),
            Ville.nom.label('ville_nom'),
            Ville.code_postal.label('ville_code_postal'),
            Ville.departement.label('ville_departement'),
        )
        .join(Terrain, Evenement.terrain_id == Terrain.id)
        .join(Ville, Terrain.ville_id == Ville.id)
        .filter(Evenement.date >= func.curdate())
        .all()
    )

    upcoming_events_list = [
        {
            'evenement_id': evenement_id,
            'evenement_nom': evenement_nom,
            'evenement_date': str(evenement_date),
            'evenement_heure_debut': str(evenement_heure_debut),
            'evenement_heure_fin': str(evenement_heure_fin),
            'terrain_id': terrain_id,
            'terrain_nom': terrain_nom,
            'terrain_adresse': terrain_adresse,
            'ville_nom': ville_nom,
            'ville_code_postal': ville_code_postal,
            'ville_departement': ville_departement,
        }
        for (
            evenement_id,
            evenement_nom,
            evenement_date,
            evenement_heure_debut,
            evenement_heure_fin,
            terrain_id,
            terrain_nom,
            terrain_adresse,
            ville_nom,
            ville_code_postal,
            ville_departement,
        ) in upcoming_events
    ]

    return jsonify(upcoming_events_list)

# fonction pour calculer la moyenne des scores des participants de chaque événement qui ne sont pas encore passés avec l'id de l'événement, le nom, la date, l'heure et le terrain, si l'événement n'a pas de note, la moyenne est de 0
@app.route('/average-score-events', methods=['GET'])
def get_average_score_upcoming_events():
    average_scores = (
        db.session.query(
            Evenement.id.label('evenement_id'),
            Evenement.nom.label('evenement_nom'),
            Evenement.date.label('evenement_date'),
            Evenement.heure_debut.label('evenement_heure_debut'),
            Evenement.heure_fin.label('evenement_heure_fin'),
            Terrain.id.label('terrain_id'),
            Terrain.nom.label('terrain_nom'),
            Terrain.adresse.label('terrain_adresse'),
            Ville.nom.label('ville_nom'),
            Ville.code_postal.label('ville_code_postal'),
            Ville.departement.label('ville_departement'),
            func.avg(StatUser.score).label('average_score')
        )
        .join(Terrain, Evenement.terrain_id == Terrain.id)
        .join(Ville, Terrain.ville_id == Ville.id)
        .join(Reservation, Evenement.id == Reservation.evenement_id)
        .join(StatUser, Reservation.username == StatUser.username)
        .filter(Evenement.date >= func.curdate())
        .group_by(Evenement.id, Evenement.nom, Evenement.date, Evenement.heure_debut, Evenement.heure_fin, Terrain.id, Terrain.nom, Terrain.adresse, Ville.nom, Ville.code_postal, Ville.departement)
        .all()
    )

    average_scores_list = [
        {
            'evenement_id': evenement_id,
            'evenement_nom': evenement_nom,
            'evenement_date': str(evenement_date),
            'evenement_heure_debut': str(evenement_heure_debut),
            'evenement_heure_fin': str(evenement_heure_fin),
            'terrain_id': terrain_id,
            'terrain_nom': terrain_nom,
            'terrain_adresse': terrain_adresse,
            'ville_nom': ville_nom,
            'ville_code_postal': ville_code_postal,
            'ville_departement': ville_departement,
            'average_score': average_score
        }
        for (
            evenement_id,
            evenement_nom,
            evenement_date,
            evenement_heure_debut,
            evenement_heure_fin,
            terrain_id,
            terrain_nom,
            terrain_adresse,
            ville_nom,
            ville_code_postal,
            ville_departement,
            average_score
        ) in average_scores
    ]

    return jsonify(average_scores_list)

# fonction pour récupérer la moyenne des scores d'un user
@app.route('/average-score/<string:username>', methods=['GET'])
def get_average_score_user(username):
    average_scores = (
        db.session.query(
            Reservation.username.label('username'),
            func.avg(StatUser.score).label('average_score')
        )
        .join(StatUser, Reservation.username == StatUser.username)
        .group_by(Reservation.username)
        .filter(Reservation.username == username)
        .all()
    )

    average_scores_dict = {username: average_score for username, average_score in average_scores}

    return jsonify(average_scores_dict)

# fonction pour ajouter une connaissance à un user si la connaissance n'existe pas déjà
@app.route('/add-connaissance/<string:username>', methods=['POST'])
def add_connaissance(username):
    data = request.get_json()
    if 'connaissance' in data:
        user = User.query.get(username)
        if user:
            new_connaissance = Connaissance(
                username=username,
                connaissance=data['connaissance']
            )
            db.session.add(new_connaissance)
            db.session.commit()
            return jsonify({'message': 'Connaissance added successfully'})
        else:
            return jsonify({'message': 'Invalid user ID'}), 400
    else:
        return jsonify({'message': 'Invalid JSON data'}), 400

# fonction qui récupère les Event créés (champ username de la table Event) par un user qui nous connait (champ connaissance de la table Connaissance) sans utiliser la table Reservation
@app.route('/events-connaissance/<string:username>', methods=['GET'])
def get_events_connaissance(username):
    events = (
        db.session.query(
            User.username.label('connaissance_nom'),
            Evenement.id.label('evenement_id'),
            Evenement.nom.label('evenement_nom'),
            Evenement.date.label('evenement_date'),
            Evenement.heure_debut.label('evenement_heure_debut'),
            Evenement.heure_fin.label('evenement_heure_fin'),
            Terrain.nom.label('terrain_nom'),
        )
        .join(Connaissance, User.username == Connaissance.connaissance)
        .join(Evenement, Connaissance.connaissance == Evenement.username)
        .join(Terrain, Evenement.terrain_id == Terrain.id)
        .filter(Connaissance.username == username)
        .all()
    )

    events_list = [
        {
            'connaissance_nom': connaissance_nom,
            'evenement_id': evenement_id,
            'evenement_nom': evenement_nom,
            'evenement_date': str(evenement_date),
            'evenement_heure_debut': str(evenement_heure_debut),
            'evenement_heure_fin': str(evenement_heure_fin),
            'terrain_nom': terrain_nom,
        }
        for (
            connaissance_nom,
            evenement_id,
            evenement_nom,
            evenement_date,
            evenement_heure_debut,
            evenement_heure_fin,
            terrain_nom,
        ) in events
    ]

    return jsonify(events_list)


if __name__ == '__main__':
    app.run(debug=True)