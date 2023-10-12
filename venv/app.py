from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/calcul', methods=['GET'])
def effectuer_calcul():
    # Effectuez le calcul ici
    # Renvoyez le résultat en JSON
    result = {'resultat': 2+22}  # Remplacez par le résultat réel de votre calcul
    return jsonify(result)

if __name__ == '__main__':
    app.run()
