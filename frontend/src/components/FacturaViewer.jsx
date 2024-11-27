import React from 'react';
import { Box, Typography } from '@mui/material';

function FacturaViewer({ parseResult }) {
  //parse result can be undefined, null, or an object
  const { factura, error } = parseResult || {};


  return (
    <Box width="100%"  p={2}>
      <Typography variant="h6">Información de la Factura</Typography>
      {error ? (
        <Typography variant="body1">
          <strong>Error: </strong> {error}
        </Typography>
      ) : factura ? (
        <Typography variant="body1" >
          <strong>Razón Social: </strong> {factura.razonSocial}<br />
          <strong>RUC: </strong> {factura.ruc}<br />
          <strong>Fecha de Autorización: </strong> {factura.fechaAutorizacion}<br />
          <strong>Valor: </strong> {factura.valor}<br />
          <strong>PDF: </strong> {factura.pdf_path ? factura.pdf_path : 'No disponible'}<br />
          <strong>XML: </strong> {factura.xml_path ? factura.xml_path : 'No disponible'}<br />
          <strong>Cod Doc: </strong> {factura.codDoc}<br />
          <strong>Código Admitido: </strong> {factura.codigoAdmitido ? 'Sí' : 'No'}<br />
          <strong>Código Porcentaje: </strong> {factura.codigoPorcentaje}<br />
          <strong>Contribuyente RIMPE: </strong> {factura.contribuyenteRimpe}<br />
          <strong>Establecimiento: </strong> {factura.estab}<br />
          <strong>Fecha: </strong> {factura.fecha}<br />
          <strong>Fecha de Emisión: </strong> {factura.fechaEmision}<br />
          <strong>Forma de Pago: </strong> {factura.formaPago}<br />
          <strong>Forma de Pago Admitida: </strong> {factura.formaPagoAdmitida ? 'Sí' : 'No'}<br />
          <strong>Es Docente: </strong> {factura.isDocente ? 'Sí' : 'No'}<br />
          <strong>Nombre: </strong> {factura.nombre}<br />
          <strong>Número de Autorización: </strong> {factura.numeroAutorizacion}<br />
          <strong>Punto de Emisión: </strong> {factura.ptoEmi}<br />
          <strong>Secuencial: </strong> {factura.secuencial}<br />
          <strong>Tipo: </strong> {factura.tipo}<br />
          <strong>Tipo de Documento: </strong> {factura.tipoDocumento}<br />
        </Typography>
      ) : (
        <Typography variant="body1">Seleccione una factura para ver su información</Typography>
      )}
    </Box>
  );
}

export default FacturaViewer;