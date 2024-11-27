#import cors but not used
from flask_cors import CORS
from flask import Flask, request, jsonify,render_template
import os
from utils import parse_factura, getDataFromFile

# Create the Flask app
app = Flask(__name__, static_folder="/frontend/dist/assets", template_folder="frontend/dist")

# Enable CORS with all options disabled
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Define constants for getDataFromFile
lista_docentes = [
    '1718425570001'
]
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

@app.route("/")
def hello():
    return render_template('index.html')

@app.route('/api/parse', methods=['POST'])
def parse_factura_endpoint():
    xml_file = request.files['xml']
    if xml_file.filename == '':
        return jsonify({'error': 'No se ha proporcionado el archivo XML'}), 400
    
    #check if filename includes route and remove it
    if xml_file.filename.find('\\') != -1:
        xml_file.filename = xml_file.filename.split('\\')[-1]
    if xml_file.filename.find('/') != -1:
        xml_file.filename = xml_file.filename.split('/')[-1]
    xml_path = os.path.join('uploads', xml_file.filename)
    xml_file.save(xml_path)

    try:
        # Try reading the file with the default encoding
        with open(xml_path, 'r') as file:
            xml_content = file.read()
    except UnicodeDecodeError:
        import chardet
        # Detect encoding if there's a decoding error
        with open(xml_path, 'rb') as file:
            encoding = chardet.detect(file.read())['encoding']
        # Read file with detected encoding
        with open(xml_path, 'r', encoding=encoding) as file:
            xml_content = file.read()

    try:
        factura = getDataFromFile(xml_content, lista_docentes, formas_de_pago, formas_de_impuestos, tipos_de_documento)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
    return jsonify({'factura': factura})


if __name__ == '__main__':
    app.run(debug=True)