import json
import pytest
import sys
sys.path.append('C:\\Users\\maxim\\Documents\\devops_socsport\\socsport\\socsport')
from app import app, db, Ville, Terrain, Evenement

@pytest.fixture
def client():
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:AliMaxou2002@localhost/socsport'
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
            villes_a_ajouter = [
                Ville(nom="Nanterre", code_postal=92000, departement="Hauts-de-Seine"),
                Ville(nom="Bois-Colombes", code_postal=92270, departement="Hauts-de-Seine"),
            ]
            terrains_a_ajouter = [
                Terrain(nom="Stade Vincent Pascucci", adresse="135 Avenue de la Commune de Paris", latitude=48.907273, longitude=2.207743, ville_id=1),
                Terrain(nom="Stade Jean Coteau", adresse="81 Avenue François Vincent Raspail", latitude=48.807719, longitude=2.341501, ville_id=2),
            ]
            db.session.add_all(villes_a_ajouter)
            db.session.add_all(terrains_a_ajouter)
            db.session.commit()
        yield client
        db.session.remove()

def test_index(client):
    response = client.get('/')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert len(data['terrains']) == 2
    assert data['terrains'][0]['nom'] == 'Stade Vincent Pascucci'
    assert data['terrains'][1]['nom'] == 'Stade Jean Coteau'

def test_nearest_fields(client):
    data = {'latitude': 48.906, 'longitude': 2.207}
    response = client.post('/nearest-fields', json=data)
    assert response.status_code == 200
    data = json.loads(response.data)
    assert len(data) == 2
    assert data[0]['nom'] == 'Stade Vincent Pascucci'
    assert data[1]['nom'] == 'Stade Jean Coteau'

def test_create_event(client):
    terrain_id = 1
    data = {'name': 'Test Event', 'date': '2022-01-01', 'startTime': '10:00', 'endTime': '12:00'}
    response = client.post(f'/create-event/{terrain_id}', json=data)
    assert response.status_code == 200
    assert Evenement.query.count() == 1
    event = Evenement.query.first()
    assert event.nom == 'Test Event'
    assert event.date == '2022-01-01'
    assert event.heure_debut == '10:00:00'
    assert event.heure_fin == '12:00:00'
    assert event.terrain_id == terrain_id

def test_create_event_invalid_field_id(client):
    terrain_id = 999
    data = {'name': 'Test Event', 'date': '2022-01-01', 'startTime': '10:00', 'endTime': '12:00'}
    response = client.post(f'/create-event/{terrain_id}', json=data)
    assert response.status_code == 400
    assert Evenement.query.count() == 0

def test_create_event_invalid_json_data(client):
    terrain_id = 1
    data = {'name': 'Test Event', 'date': '2022-01-01'}
    response = client.post(f'/create-event/{terrain_id}', json=data)
    assert response.status_code == 400
    assert Evenement.query.count() == 0

def test_events_for_field(client):
    terrain_id = 1
    event_data = [
        {'nom': 'Event 1', 'date': '2022-01-01', 'heure_debut': '10:00:00', 'heure_fin': '12:00:00'},
        {'nom': 'Event 2', 'date': '2022-01-02', 'heure_debut': '14:00:00', 'heure_fin': '16:00:00'},
    ]
    for data in event_data:
        event = Evenement(nom=data['nom'], date=data['date'], heure_debut=data['heure_debut'], heure_fin=data['heure_fin'], terrain_id=terrain_id)
        db.session.add(event)
    db.session.commit()
    response = client.get(f'/events-for-field/{terrain_id}')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert len(data) == 2
    assert data[0]['nom'] == 'Event 1'
    assert data[1]['nom'] == 'Event 2'

def test_events_for_field_invalid_field_id(client):
    terrain_id = 999
    response = client.get(f'/events-for-field/{terrain_id}')
    assert response.status_code == 404