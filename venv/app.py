from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)

@app.route('/calcul', methods=['GET'])
def effectuer_calcul():
    # Effectuez votre calcul ici
    resultat = 42  # Remplacez ceci par votre propre calcul
    return jsonify({'resultat': resultat})

if __name__ == '__main__':
    app.run()
