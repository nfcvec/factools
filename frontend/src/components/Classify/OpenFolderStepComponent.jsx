import React, { useEffect, useState } from "react";
import { Box, Button, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import FolderSelectorComponent from "./FolderSelectorComponent";
import { ComprobantesFileTable } from "./ComprobantesFileTable";
import { ComprobantesPurge } from "./ComprobantesPurge";

export default function OpenFolderStepComponent({
    files,
    setFiles,
    comprobantes,
    setComprobantes,
    stepCompleted,
    setStepCompleted,
    setLoading,
    progress,
    setProgress,
    setTotalTasks,
    setCurrentTaskLabel,
}) {
    const [selectedFolderPath, setSelectedFolderPath] = useState("");
    const [loadedSourceFolder, setLoadedSourceFolder] = useState(false);

    useEffect(() => {
        checkStepCompleted();
        setLoadedSourceFolder(comprobantes.length > 0);
    }, [comprobantes]);

    const checkStepCompleted = () => {
        const allFilesAreProcessable = comprobantes.every((comprobante) => comprobante.procesable) && comprobantes.length > 0;
        console.log("All files are processable:", allFilesAreProcessable);
        setStepCompleted(allFilesAreProcessable);
    };

    const handleFolderSelect = async (event) => {
        console.log("event.target.files:", event.target.files);

        const folder = event.target.files;
        const comprobantesMap = {};

        const processFiles = (startIndex) => {
            const batchSize = 100; // Process 100 files at a time
            for (let i = startIndex; i < Math.min(startIndex + batchSize, folder.length); i++) {
                const file = folder[i];
                const fileName = file.name;

                // Filtrar solo archivos con extensión .pdf y .xml
                if (!fileName.endsWith(".pdf") && !fileName.endsWith(".xml")) {
                    continue;
                }

                const comprobanteId = fileName.split(".")[0]; // Assuming the file name format is "comprobanteId.pdf" or "comprobanteId.xml"

                if (!comprobantesMap[comprobanteId]) {
                    comprobantesMap[comprobanteId] = { pdf: null, xml: null };
                }

                if (fileName.endsWith(".pdf")) {
                    comprobantesMap[comprobanteId].pdf = file;
                } else if (fileName.endsWith(".xml")) {
                    comprobantesMap[comprobanteId].xml = file;
                }

                comprobantesMap[comprobanteId].procesable = !!(comprobantesMap[comprobanteId].pdf && comprobantesMap[comprobanteId].xml);
            }

            if (startIndex + batchSize < folder.length) {
                setTimeout(() => processFiles(startIndex + batchSize), 0); // Schedule next batch
            } else {
                const comprobantesList = Object.keys(comprobantesMap).map((comprobanteId) => ({
                    id: comprobanteId,
                    ...comprobantesMap[comprobanteId],
                }));

                console.log("comprobantes list:", comprobantesList); // Log comprobantes list
                setComprobantes(comprobantesList);
            }
        };
        processFiles(0); // Start processing files from index 0
    };

    return (
        <Box p={2} display="flex" flexDirection="column" justifyContent="flex-start" alignItems="flex-start">
            <Box>
                <FolderSelectorComponent handleFolderSelect={handleFolderSelect} />
            </Box>
            {loadedSourceFolder && (
                <Box>
                    <ComprobantesPurge
                        comprobantes={comprobantes}
                        setComprobantes={setComprobantes}
                        setLoading={setLoading}
                        progress={progress}
                        setProgress={setProgress}
                        setTotalTasks={setTotalTasks}
                        setCurrentTaskLabel={setCurrentTaskLabel}
                    />
                    <ComprobantesFileTable comprobantes={comprobantes} setComprobantes={setComprobantes} />
                </Box>
            )}
        </Box>
    );
}
