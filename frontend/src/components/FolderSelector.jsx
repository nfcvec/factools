import React, { useState } from 'react';
import { Box, Button, Typography, List, ListItem, TextField, IconButton } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import axios from 'axios';

function FolderSelector({ onFacturaSelect, setLoading }) {
  const [facturas, setFacturas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleFolderSelect = async (event) => {
    const folder = event.target.files;
    const facturasMap = {};

    const processFiles = (startIndex) => {
      const batchSize = 100; // Process 100 files at a time
      for (let i = startIndex; i < Math.min(startIndex + batchSize, folder.length); i++) {
        const file = folder[i];
        const fileName = file.name;

        // Filtrar solo archivos con extensión .pdf y .xml
        if (!fileName.endsWith('.pdf') && !fileName.endsWith('.xml')) {
          continue;
        }

        const facturaId = fileName.split('.')[0]; // Assuming the file name format is "facturaId.pdf" or "facturaId.xml"

        if (!facturasMap[facturaId]) {
          facturasMap[facturaId] = { pdf: null, xml: null };
        }

        if (fileName.endsWith('.pdf')) {
          facturasMap[facturaId].pdf = file;
        } else if (fileName.endsWith('.xml')) {
          facturasMap[facturaId].xml = file;
        }
      }

      if (startIndex + batchSize < folder.length) {
        setTimeout(() => processFiles(startIndex + batchSize), 0); // Schedule next batch
      } else {
        const facturasList = Object.keys(facturasMap).map(facturaId => ({
          id: facturaId,
          ...facturasMap[facturaId]
        }));

        console.log('Facturas list:', facturasList); // Log facturas list
        setFacturas(facturasList);
      }
    };
    setLoading({ open: true, message: 'Procesando archivos...' });
    processFiles(0); // Start processing files from index 0
    setLoading({ open: false, message: '' });
  };

  const handleFacturaClick = async (factura) => {
    if (!factura.xml) return;

    const formData = new FormData();
    formData.append('xml', factura.xml);

    try {
      const response = await axios.post('http://localhost:5000/api/parse', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Factura details:', response.data.factura); // Log factura details
      onFacturaSelect(response.data);
    } catch (error) {
      onFacturaSelect(error.response.data);
      console.error('Error fetching factura details:', error.response.data);
    }
  };

  const filteredFacturas = facturas.filter(factura =>
    factura.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box p={2}>
      <Box width="100%" display="flex" justifyContent="space-between" alignItems="center">
        <IconButton color="primary" component="label">
          <FolderIcon />
          <input type="file" webkitdirectory="true" directory="true" multiple hidden onChange={handleFolderSelect} />
        </IconButton>
        <TextField size="small" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </Box>
      <Box>
        <TableContainer component={Paper} >
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell align="center">PDF</TableCell>
                <TableCell align="center">XML</TableCell>
                <TableCell>Numero</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredFacturas.sort(
                (a, b) => {
                  if (!a.pdf || !a.xml) return -1;
                  if (!b.pdf || !b.xml) return 1;
                  return 0;
                }
              ).map((factura, index) => (
                <TableRow
                  key={index}
                  onClick={() => handleFacturaClick(factura)}
                  sx={{
                    backgroundColor: 'background.paper',
                    cursor: factura.xml ? 'pointer' : 'default',
                    '&:hover': {
                      backgroundColor: 'background.default'
                    }
                  }}
                >
                  <TableCell align="center">{factura.pdf ? '✓' : '✗'}</TableCell>
                  <TableCell align="center">{factura.xml ? '✓' : '✗'}</TableCell>
                  <TableCell>{factura.id}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box >
  );
}

export default FolderSelector;