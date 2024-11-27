import React from 'react';
import { Box, Typography } from '@mui/material';

function FacturaDetails({ factura }) {
  if (!factura) return null;

return (
    <Box>
        <Typography variant="h6">Factura Details</Typography>
        <Typography variant="body1">Ambiente: {factura.ambiente?.text || ''}</Typography>
        <Typography variant="body1">Razon Social: {factura.comprobante.infoTributaria?.razonSocial?.text || ''}</Typography>
        <Typography variant="body1">RUC: {factura.comprobante.infoTributaria?.ruc?.text || ''}</Typography>
        <Typography variant="body1">Fecha Emision: {factura.comprobante.infoFactura?.fechaEmision?.text || ''}</Typography>
        <Typography variant="body1">Total: {factura.comprobante.infoFactura?.importeTotal?.text || ''}</Typography>
        {/* Add more fields as needed */}
    </Box>
);
}

export default FacturaDetails;