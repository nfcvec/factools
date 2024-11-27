import React from 'react';
import { Box, Button, Dialog, TextField, Typography } from '@mui/material';
import FileInput from './FileInput';
import { useFormValidation } from '../hooks/useFormValidation';
import FacturaDetails from './FacturaDetails';

function DocumentForm({ setLoading }) {

  const [factura, setFactura] = React.useState(null);
  const { formData, errors, handleChange, handleFileChange, handleSubmit, isFormValid } = useFormValidation(
    {
      setFactura,
      setLoading
    }
  );

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h4" component="h1" gutterBottom>
        Formulario de Documentos
      </Typography>

      <FileInput
        label="Archivo XML"
        type="xml"
        error={errors.xmlFile}
        onChange={(e) => handleFileChange(e, 'xmlFile')}
      />
      {factura && <FacturaDetails factura={factura} />}
      <FileInput
        label="Archivo PDF"
        type="pdf"
        error={errors.pdfFile}
        onChange={(e) => handleFileChange(e, 'pdfFile')}
      />
      <Button 
        variant="contained" 
        color="primary" 
        type="submit"
        disabled={!isFormValid()}
        fullWidth
        sx={{ py: 1.5 }}
      >
        Enviar
      </Button>
    </form>
  );
}

export default DocumentForm;