import xml.etree.ElementTree as ET
from datetime import datetime
import os
import shutil

def xml_to_json(xml_content):
    """Convert XML content to a JSON-like dictionary."""
    root = ET.fromstring(xml_content)
    
    def parse_element(element):
        """Recursively parse an XML element into a dictionary."""
        parsed_data = {**element.attrib}  # Include attributes if they exist
        for child in element:
            child_data = parse_element(child)
            if child.tag not in parsed_data:
                parsed_data[child.tag] = child_data
            else:
                if not isinstance(parsed_data[child.tag], list):
                    parsed_data[child.tag] = [parsed_data[child.tag]]
                parsed_data[child.tag].append(child_data)
        if element.text and element.text.strip():
            parsed_data['text'] = element.text.strip()
        return parsed_data
    
    return parse_element(root)

def parse_factura(factura_string):
    if not factura_string:
        raise ValueError('No se ha proporcionado un archivo o string de factura')

    factura = xml_to_json(factura_string)
    comprobante_string = factura['comprobante']['text']
    comprobante = xml_to_json(comprobante_string)
    factura['comprobante'] = comprobante

    return factura

def getDataFromFile(archivo, lista_docentes, formas_de_pago, formas_de_impuestos, tipos_de_documento):
    jsonFactura = parse_factura(archivo)
    numeroAutorizacion = jsonFactura['comprobante']['infoTributaria']['claveAcceso']['text']
    comprobante = jsonFactura['comprobante']
    infoTributaria = comprobante['infoTributaria']
    infoFactura = comprobante.get('infoFactura', {})
    infoNotaCredito = comprobante.get('infoNotaCredito', {})
    infoComprobante = infoFactura if infoFactura else infoNotaCredito
    fecha = infoComprobante['fechaEmision']['text'].strip()

    try:
        fecha_excel = datetime.fromisoformat(fecha).strftime('%d/%m/%Y')
        string_fecha = datetime.fromisoformat(fecha).strftime('%Y%m%d')
    except:
        string_fecha = fecha.split("/")[2] + fecha.split("/")[1] + fecha.split("/")[0]
        fecha_excel = fecha

    tipo = "factura" if infoFactura else "nota_credito" if infoNotaCredito else "otro"
    fechaEmisionDocSustento = infoComprobante.get('fechaEmisionDocSustento', {}).get('text', '')
    numDocModificado = infoComprobante.get('numDocModificado', {}).get('text', '')
    tipoIdentificacionComprador=infoComprobante.get('tipoIdentificacionComprador', {}).get('text', '')
    razonSocial = infoTributaria.get('razonSocial', {}).get('text', '')
    codDoc = infoTributaria.get('codDoc', {}).get('text', '')
    estab = infoTributaria.get('estab', {}).get('text', '')
    ptoEmi = infoTributaria.get('ptoEmi', {}).get('text', '')
    secuencial = infoTributaria.get('secuencial', {}).get('text', '')
    idComprobante = codDoc+estab+ptoEmi+secuencial
    ruc = infoTributaria.get('ruc', {}).get('text', '')
    _razonSocialComprador = infoComprobante.get('razonSocialComprador', {}).get('text', '')
    _razonSocialSujetoRetenido = infoComprobante.get('razonSocialSujetoRetenido', {}).get('text', '')
    nombre = _razonSocialComprador if _razonSocialComprador else _razonSocialSujetoRetenido
    regimenRimpe = infoComprobante.get('regimenRimpe', {}).get('text', '')
    fechaEmision = infoComprobante.get('fechaEmision', {}).get('text', '')
    valor = infoComprobante.get('importeTotal', {}).get('text', '')
    _infoAdicional = jsonFactura['comprobante'].get('infoAdicional', {}).get('campoAdicional', {})
    infoAdicional = _infoAdicional if _infoAdicional else ''

    try:
        formaPago = infoComprobante['pagos']['pago']['formaPago']['text']
        if len(formaPago) > 2:
            formaPago = "20"
    except:
        formaPago = "20"

    formaPagoAdmitida = False
    for forma in formas_de_pago:
        if str(forma['codigo']) == str(formaPago):
            formaPagoAdmitida = forma['admitido']
            break

    _totalImpuesto = infoComprobante.get('totalConImpuestos', {}).get('totalImpuesto', {})
    _codigoPorcentaje = []
    if isinstance(_totalImpuesto, list):
        for impuesto in _totalImpuesto:
            _codigoPorcentaje.append(impuesto.get('codigoPorcentaje', {}).get('text', ''))
    elif isinstance(_totalImpuesto, dict):
        _codigoPorcentaje.append(_totalImpuesto.get('codigoPorcentaje', {}).get('text', ''))
    else:
        _codigoPorcentaje.append("")

    codigoPorcentaje = str(_codigoPorcentaje)

    codigoAdmitido = False
    for codigo in formas_de_impuestos:
        if str(codigo['codigo']) in str(codigoPorcentaje):
            codigoAdmitido = codigo['admitido']
            break

    isDocente = str(ruc).strip() in lista_docentes

    if codDoc is not None:
        try:
            tipoDocumento = list(filter(lambda x: x['codigo'] == codDoc, tipos_de_documento))[0]
        except:
            tipoDocumento = "-"

    # Determine the paths where the documents will be saved
    if isDocente:
        dpath = os.path.join("docentes", string_fecha)
    elif formaPagoAdmitida:
        dpath = os.path.join("proveedores", razonSocial, f"{estab}{ptoEmi}{secuencial}")
    else:
        dpath = os.path.join("error_forma_pago", razonSocial)

    os.makedirs(dpath, exist_ok=True)

    xml_path = os.path.join(dpath, f"{estab}{ptoEmi}{secuencial}.xml")
    pdf_path = os.path.join(dpath, f"{estab}{ptoEmi}{secuencial}.pdf")

    try:
        shutil.copy(archivo, xml_path)
    except:
        print(f"[ERROR] Error copiando xml de {archivo}")

    try:
        shutil.copy(archivo.replace(".xml", ".pdf"), pdf_path)
    except:
        print(f"[ERROR] Error copiando pdf de {archivo}")

    return {
        "fechaEmisionDocSustento": fechaEmisionDocSustento,
        "numDocModificado": numDocModificado,
        "tipoIdentificacionComprador": tipoIdentificacionComprador,
        "razonSocial": razonSocial.strip().upper(),
        "codDoc": codDoc,
        "estab": estab,
        "ptoEmi": ptoEmi,
        "secuencial": secuencial,
        "idComprobante": idComprobante,
        "ruc": ruc,
        "isDocente": isDocente,
        "fecha": string_fecha,
        "formaPago": formaPago,
        "formaPagoAdmitida": formaPagoAdmitida,
        "nombre": nombre if nombre else "-",
        "contribuyenteRimpe": regimenRimpe,
        "fechaEmision": fechaEmision,
        "fechaAutorizacion": fecha_excel,
        "valor": valor if valor else "-",
        "infoAdicional": infoAdicional,
        "tipo": tipo,
        "codigoPorcentaje": codigoPorcentaje,
        "codigoAdmitido": codigoAdmitido,
        "tipoDocumento": tipoDocumento,
        "numeroAutorizacion": numeroAutorizacion,
        "xml_path": xml_path,
        "pdf_path": pdf_path,
        "raw": jsonFactura
    }