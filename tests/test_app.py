import json
import pytest
import sys
sys.path.append('C:\\Users\\Asus\\OneDrive\\Bureau\\COURS M1 MIAGE\\Projet_devops\\socsport')
from app import app, db, Terrain, Evenement 


@pytest.fixture
def client():
    app.config['TESTING'] = True
    client = app.test_client()

    # Mise en place de la base de données (si nécessaire) avant les tests
    with app.app_context():
        db.create_all()

    yield client

def test_nearest_fields(client):
    # Tester la route /nearest-fields
    response = client.post('/nearest-fields', json={'latitude': 48.906, 'longitude': 2.207})

    assert response.status_code == 200
    data = response.get_json()

    # Vérifier que les données renvoyées correspondent à nos attentes
    assert data[0]['nom'] == 'Stade Vincent Pascucci'
    assert data[1]['nom'] == 'Stade Gabriel Péri'
    assert data[2]['nom'] == 'Stade Jean Moulin'    

def test_create_event(client):
    # Tester la route /create-event/2
    response = client.post('/create-event/2', json={
        'name': 'Nom de l\'événement',
        'date': '2023-11-01',
        'startTime': '10:00:00',
        'endTime': '12:00:00',
    })

    assert response.status_code == 200
    data = response.get_json()

def test_index_route(client):
    # Tester la route '/'
    response = client.get('/')
    
    assert response.status_code == 200
    data = response.get_json()
    
    # Vérifier que la réponse est une liste de terrains au format JSON
    assert isinstance(data, list)
    assert all('id' in terrain and 'nom' in terrain and 'adresse' in terrain and 'code_postal' in terrain and 'departement' in terrain and 'latitude' in terrain and 'longitude' in terrain and 'ville' in terrain for terrain in data)