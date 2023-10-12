from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/calcul', methods=['GET'])
def effectuer_calcul():

    result = {'resultat': 2+22}  
    return jsonify(result)

if __name__ == '__main__':
    app.run()
