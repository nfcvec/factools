#import cors but not used
from flask_cors import CORS
from flask import Flask, request, jsonify,render_template
import os
from utils import parse_factura, getDataFromFile
import chardet
import json


# Create the Flask app
app = Flask(__name__, static_folder="/frontend/dist/assets", template_folder="frontend/dist")

# Enable CORS with all options disabled
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Define constants for getDataFromFile
with open("docentes.json", "r") as f:
    docentes = f.read()
    docentes = json.loads(docentes)
    
lista_docentes = docentes

formas_de_pago = [
    {"codigo": "1", "descripcion": "Sin utilizacion del sistema financiero", "admitido": False},
    {"codigo": "15", "descripcion": "Compensacion de deudas", "admitido": False},
    {"codigo": "16", "descripcion": "Tarjeta de débito", "admitido": False},
    {"codigo": "17", "descripcion": "Dinero electrónico", "admitido": False},
    {"codigo": "18", "descripcion": "Tarjeta prepago", "admitido": False},
    {"codigo": "19", "descripcion": "Tarjeta de crédito", "admitido": True},
    {"codigo": "20", "descripcion": "Otros con utilización del sistema financiero", "admitido": True},
    {"codigo": "21", "descripcion": "Endoso de títulos", "admitido": False}
]
formas_de_impuestos = [
    {"codigo": "0", "descripcion": "0%", "admitido": True},
    {"codigo": "2", "descripcion": "12%", "admitido": True},
    {"codigo": "6", "descripcion": "No objeto de impuesto", "admitido": False},
    {"codigo": "7", "descripcion": "Exento de IVA", "admitido": False},
    {"codigo": "4", "descripcion": "15%", "admitido": True}
]
tipos_de_documento = [
    {"codigo": "1", "descripcion": "FACTURA"},
    {"codigo": "4", "descripcion": "NOTA DE CRÉDITO"},
    {"codigo": "5", "descripcion": "NOTA DE DÉBITO"},
    {"codigo": "6", "descripcion": "GUÍA DE REMISIÓN"},
    {"codigo": "7", "descripcion": "COMPROBANTE DE RETENCIÓN"}
]

# Define the routes

#Serve the built react app
@app.route("/")
def hello():
    return render_template("index.html")

@app.route('/api/parse', methods=['POST'])
def parse_factura_endpoint():
    xml_file = request.files['xml']
    if xml_file.filename == '':
        return jsonify({'error': 'No se ha proporcionado el archivo XML'}), 400
    
    try:
        # Try reading the file with the default encoding
        xml_content = xml_file.read().decode('utf-8')
    except UnicodeDecodeError:
        # Detect encoding if there's a decoding error
        xml_file.seek(0)  # Reset file pointer to the beginning
        encoding = chardet.detect(xml_file.read())['encoding']
        xml_file.seek(0)  # Reset file pointer to the beginning again
        xml_content = xml_file.read().decode(encoding)


    try:
        factura = getDataFromFile(xml_content, lista_docentes, formas_de_pago, formas_de_impuestos, tipos_de_documento)
    except Exception as e:
        return jsonify({
            'error': str(e),
            'success': False
        }), 500
    
    return jsonify({
        'comprobante': factura,
        'success': True
        })


if __name__ == '__main__':
    app.run(debug=True)