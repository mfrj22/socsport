import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import json
import pytest
from flask import Flask, jsonify
from app import app, db, Evenement, Note, StatUser, User, Connaissance, Terrain, Ville, Reservation, Sport

@pytest.fixture
def client():
    app.config['TESTING'] = True
    client = app.test_client()

    # Mise en place de la base de données (si nécessaire) avant les tests
    with app.app_context():
        db.create_all() 

    yield client

    # Nettoyage de la base de données après les tests
    with app.app_context():
        db.drop_all()

def test_login(client):
    with app.app_context():
        response = client.post('/login', json={'username': 'test_user'})
        assert response.status_code == 200
        assert response.json == {'message': 'Nouvel utilisateur créé'}

def test_create_event(client):
    with app.app_context():
        # Créer l'utilisateur seulement s'il n'existe pas déjà
        if User.query.filter_by(username='test_user').first() is None:
            user = User(username='test_user')
            db.session.add(user)
            db.session.commit()

    # Créez un terrain pour le test
        terrain = Terrain(nom='Test Terrain', latitude=0.0, longitude=0.0)
        db.session.add(terrain)
        db.session.commit()

    # Test du point d'API /create-event/<int:fieldId>
        response = client.post('/create-event/1', json={
            'name': 'Test Event',
            'date': '2024-01-20',
            'startTime': '12:00',
            'endTime': '14:00',
            'nbParticipants': 10,
            'username': 'test_user'
        })

        assert response.status_code == 200
        assert response.json['message'] == 'Event created successfully'
        assert 'terrain_name' in response.json

def test_nearest_fields(client):
    # Test du point d'API /nearest-fields
    with app.app_context():
        response = client.post('/nearest-fields', json={'latitude': 0.0, 'longitude': 0.0})
        assert response.status_code == 200
        assert isinstance(response.json, list)

def test_add_reservation(client):
    # Créez un utilisateur pour le test
    with app.app_context():
        # Créer l'utilisateur seulement s'il n'existe pas déjà
        if User.query.filter_by(username='test_user').first() is None:
            user = User(username='test_user')
            db.session.add(user)
            db.session.commit()

        # Créez un terrain et un événement pour le test
        terrain = Terrain(nom='Test Terrain', latitude=0.0, longitude=0.0)
        db.session.add(terrain)
        db.session.commit()

        evenement = Evenement(
            nom='Test Event',
            date='2024-01-20',
            heure_debut='12:00',
            heure_fin='14:00',
            nb_participants=10,
            terrain_id=1,
            username='test_user'
        )
        db.session.add(evenement)
        db.session.commit()

        # Test du point d'API /add-reservation
        response = client.post('/add-reservation', json={
            'evenement_id': 1,
            'nom_participant': 'John',
            'prenom_participant': 'Doe',
            'email_participant': 'john.doe@example.com',
            'tel_participant': '1234567890',
            'username': 'test_user'
        })

        assert response.status_code == 200
        assert response.json['message'] == 'Reservation created successfully'
        assert 'evenement_id' in response.json
        assert 'event_details' in response.json

def test_add_note_to_event(client):
    with app.app_context():
        # Créez un utilisateur pour le test
        user = User(username='test_user')
        db.session.add(user)
        db.session.commit()

        # Créez un événement pour le test
        evenement = Evenement(nom='Test Event', date='2024-01-20', heure_debut='12:00', heure_fin='14:00', username='test_user')
        db.session.add(evenement)
        db.session.commit()

    # Test du point d'API /note-event/<int:eventId>
    response = client.post('/note-event/1', json={'note': 4})
    assert response.status_code == 200
    assert response.json == {'message': 'Note added successfully'}

def test_get_classement(client):
    with app.app_context():
        # Créez un utilisateur pour le test
        user = User(username='test_user')
        db.session.add(user)
        db.session.commit()

        # Créez des événements avec des notes
        evenement1 = Evenement(nom='Event 1', username='test_user')
        evenement2 = Evenement(nom='Event 2', username='test_user')
        db.session.add_all([evenement1, evenement2])
        db.session.commit()

        note1 = Note(evenement_id=1, note=4)
        note2 = Note(evenement_id=2, note=5)
        db.session.add_all([note1, note2])
        db.session.commit()

    # Test du point d'API /classement-events
    response = client.get('/classement-events')
    assert response.status_code == 200
    assert isinstance(response.json, list)

def test_sports(client):
    # Envoi de la requête GET pour obtenir la liste des sports
    response = client.get('/sports')

    # Vérification de la réponse
    assert response.status_code == 200
    assert isinstance(response.json, list)


# Exemple de test pour la route /delete-reservation/<int:reservationId>
def test_delete_reservation(client):
    with app.app_context():
        # Créez un utilisateur pour le test
        user = User(username='test_user')
        db.session.add(user)

        ville = Ville(
            nom="Nanterre", 
            code_postal=92000, 
            departement="Hauts-de-Seine"
        )
        db.session.add(ville)
        db.session.commit()

        sport = Sport(
            name="Football"
        )
        db.session.add(sport)
        db.session.commit()

        terrain = Terrain(
            nom='TestTerrain',
            adresse='123 Rue du Test',
            latitude=12.345,
            longitude=67.890,
            ville_id=ville.id,  # Utilisez l'ID de la ville créée
            horaire_ouverture='08:00',
            horaire_fermeture='18:00',
            sports=[Sport.query.get(1)],
        )
        db.session.add(terrain)
        db.session.commit()

        event = Evenement(
            nom='TestEvent',
            date='2024-01-20',
            heure_debut='12:00',
            heure_fin='14:00',
            nb_participants=10,
            terrain_id=terrain.id,  # Utilisez l'ID du terrain créé
            username='test_user',
        )
        db.session.add(event)
        db.session.commit()

        reservation = Reservation(
            evenement_id=event.id,  # Utilisez l'ID de l'événement créé
            nom_participant='John',
            prenom_participant='Doe',
            email_participant='john.doe@example.com',
            tel_participant='1234567890',
            username='test_user',
        )
        db.session.add(reservation)
        db.session.commit()

    # Envoi de la requête DELETE pour supprimer la réservation
    response = client.delete('/delete-reservation/1')

    # Vérification de la réponse
    assert response.status_code == 200
    assert response.json == {'message': 'Reservation deleted successfully'}
