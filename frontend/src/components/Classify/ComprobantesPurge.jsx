import React from "react";
import { useState } from "react";
import { Box, Button, Typography, Paper } from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";

export const ComprobantesPurge = ({ comprobantes, setComprobantes, setLoading, progress, setProgress, setTotalTasks, setCurrentTaskLabel }) => {
    const [selectedFolderPath, setSelectedFolderPath] = useState("");
    const [destinationFolderHandle, setDestinationFolderHandle] = useState(null);

    const handleDestinationFolderSelect = async () => {
        try {
            const directoryHandle = await window.showDirectoryPicker();
            setSelectedFolderPath(directoryHandle.name);
            setDestinationFolderHandle(directoryHandle);
            console.log("Selected folder path:", directoryHandle.name);
        } catch (error) {
            console.error("Error selecting folder:", error);
        }
    };

    const moveFiles = async () => {
        if (!destinationFolderHandle) {
          console.error("No destination folder selected");
          return;
        }
        try {
          setLoading(true);
          setProgress(0);
          const nonProcessableComprobantes = comprobantes.filter(
            (comprobante) => !comprobante.procesable
          );
          setTotalTasks(nonProcessableComprobantes.length);
          setCurrentTaskLabel("Moviendo archivos...");
      
          let progress = 0;
          const batchSize = 30; // Actualiza el progreso cada 30 archivos
      
          for (let i = 0; i < nonProcessableComprobantes.length; i += batchSize) {
            const batch = nonProcessableComprobantes.slice(i, i + batchSize);
            const promises = batch.map(async (comprobante) => {
              const pdfFile = comprobante.pdf;
              const xmlFile = comprobante.xml;
      
              if (pdfFile) {
                const newFileHandle = await destinationFolderHandle.getFileHandle(
                  pdfFile.name,
                  { create: true }
                );
                const writable = await newFileHandle.createWritable();
                await writable.write(await pdfFile.arrayBuffer());
                await writable.close();
              }
      
              if (xmlFile) {
                const newFileHandle = await destinationFolderHandle.getFileHandle(
                  xmlFile.name,
                  { create: true }
                );
                const writable = await newFileHandle.createWritable();
                await writable.write(await xmlFile.arrayBuffer());
                await writable.close();
              }
            });
      
            await Promise.all(promises);
            progress += batch.length;
            setProgress(progress);
          }
      
          const updatedComprobantes = comprobantes.filter(
            (comprobante) => comprobante.procesable
          );
          setComprobantes(updatedComprobantes);
          console.log("Files moved successfully");
        } catch (error) {
          console.error("Error moving files:", error);
        } finally {
          setLoading(false);
        }
      };
    return (
        <Paper>
            <Typography variant="h6">Comprobantes procesables: {comprobantes.filter((comprobante) => comprobante.procesable).length}</Typography>
            <Typography variant="h6">Comprobantes no procesables: {comprobantes.filter((comprobante) => !comprobante.procesable).length}</Typography>
            {comprobantes.filter((comprobante) => !comprobante.procesable).length > 0 && (
                <Box>
                    <Typography variant="h6">Antes de continuar, mueve los comprobantes no procesables a una carpeta diferente</Typography>
                    <Button variant="contained" color="primary" startIcon={<FolderIcon />} onClick={handleDestinationFolderSelect}>
                        Seleccionar carpeta de destino
                    </Button>
                    {selectedFolderPath && <Typography variant="body1">Ruta de la carpeta seleccionada: {selectedFolderPath}</Typography>}
                    <Button variant="contained" color="secondary" onClick={moveFiles}>
                        Mover comprobantes no procesables
                    </Button>
                </Box>
            )}
        </Paper>
    );
};
