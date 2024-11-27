import { useState } from 'react';
import { validateRuc, validateFile } from '../utils/validators';
import axios from 'axios';

export function useFormValidation(
  { setFactura, setLoading } = { setFactura: () => { }, setLoading: () => { } }
) {
  const [formData, setFormData] = useState({
    ruc: '',
    pdfFile: null,
    xmlFile: null
  });

  const [errors, setErrors] = useState({
    ruc: '',
    pdfFile: '',
    xmlFile: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'ruc') {
      setErrors({
        ...errors,
        ruc: validateRuc(value) ? '' : 'RUC debe tener 13 dígitos numéricos'
      });
    }
  };

  const handleXMLFileChange = async (file) => {
    setLoading({ open: true, message: 'Parsing XML file...' });
    const formDataToSend = new FormData();
    formDataToSend.append('xml', file);
    try {
      const response = await axios.post('http://localhost:5000/api/parse', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });
      setFactura(response.data.factura);
      setLoading({ open: false, message: '' });
    } catch (error) {
      console.error('Error during XML parsing:', error);
      setFactura(null);
      setLoading({ open: false, message: '' });
    }
  };

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    setFormData({ ...formData, [fileType]: file });
    setErrors({
      ...errors,
      [fileType]: validateFile(file, fileType.replace('File', ''))
        ? ''
        : `Archivo ${fileType === 'pdfFile' ? 'PDF' : 'XML'} inválido`
    });

    if (fileType === 'xmlFile') {
      handleXMLFileChange(file);
    }
  };

  const isFormValid = () => {
    return validateRuc(formData.ruc) &&
      validateFile(formData.pdfFile, 'pdf') &&
      validateFile(formData.xmlFile, 'xml') &&
      !errors.ruc &&
      !errors.pdfFile &&
      !errors.xmlFile;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isFormValid()) {
      try {
        const formDataToSend = new FormData();
        formDataToSend.append('ruc', formData.ruc);
        formDataToSend.append('pdf', formData.pdfFile);
        formDataToSend.append('xml', formData.xmlFile);

        const response = await fetch('http://localhost:5000/upload', {
          method: 'POST',
          body: formDataToSend,
        });

        const result = await response.json();
        if (response.ok) {
          console.log('Upload successful:', result);
          // Add success notification here
        } else {
          throw new Error(result.error);
        }
      } catch (error) {
        console.error('Upload failed:', error);
        // Add error notification here
      }
    }
  };

  return {
    formData,
    errors,
    handleChange,
    handleFileChange,
    handleSubmit,
    isFormValid
  };
}