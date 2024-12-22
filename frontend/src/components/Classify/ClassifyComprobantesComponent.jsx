import React from "react";
import { Button, Paper, Typography, TextField } from "@mui/material";

export const ClassifyComprobantesComponent = ({
    comprobantes,
    setComprobantes,
    loading,
    setLoading,
    progress,
    setProgress,
    totalTasks,
    setTotalTasks,
    currentTaskLabel,
    setCurrentTaskLabel,
}) => {
    const [destinationPath, setDestinationPath] = React.useState("");
    const [destinationFolderHandle, setDestinationFolderHandle] = React.useState(null);
    const [folderName, setFolderName] = React.useState("");

    const sanitizeFileName = (name) => {
        return name
            .replace(/[\\/:*?"<>|.]/g, "")
            .trim()
            .replace(/\s+/g, " ")
            .toUpperCase(); // Trim and replace multiple spaces
    };

    const handleCreateFolder = async () => {
        if (!destinationFolderHandle) {
            console.error("No destination folder selected");
            return;
        }

        try {
            const newFolderHandle = await destinationFolderHandle.getDirectoryHandle(sanitizeFileName(folderName), { create: true });
            console.log("Created folder:", newFolderHandle.name);
        } catch (error) {
            console.error("Error creating folder:", error);
        }
    };

    const handleDestinationPath = async () => {
        try {
            const directoryHandle = await window.showDirectoryPicker();
            setDestinationPath(directoryHandle.name);
            setDestinationFolderHandle(directoryHandle);
            console.log("Selected folder path:", directoryHandle.name);
        } catch (error) {
            console.error("Error selecting folder:", error);
        }
    };

    const handleClassify = async () => {
        if (!destinationFolderHandle) {
            console.error("No destination folder selected");
            return;
        }
        setLoading(true);
        setProgress(0);
        setTotalTasks(1);
        setCurrentTaskLabel("Clasificando archivos...");

        for (const comprobante of comprobantes) {
            let xmlfile, pdffile, filePath, xmlpath, pdfpath;
            xmlfile = comprobante.xml;
            pdffile = comprobante.pdf;
            filePath = comprobante.parsed.xml_path;

            const fileParts = filePath.split("/");
            const fileName = fileParts[fileParts.length - 1].split(".")[0];
            let currentFolderHandle = destinationFolderHandle;

            for (const part of fileParts.slice(0, fileParts.length - 1)) {
                try {
                    currentFolderHandle = await currentFolderHandle.getDirectoryHandle(sanitizeFileName(part), { create: true });
                } catch (error) {
                    console.error("Error creating folder:", part, error);
                }
            }

            try {
                xmlpath = await currentFolderHandle.getFileHandle(`${sanitizeFileName(fileName)}.xml`, { create: true });
                const xmlWritable = await xmlpath.createWritable();
                await xmlWritable.write(xmlfile);
                await xmlWritable.close();
            } catch (error) {
                console.error("Error creating XML file:", fileName, error);
            }

            try {
                pdfpath = await currentFolderHandle.getFileHandle(`${sanitizeFileName(fileName)}.pdf`, { create: true });
                const pdfWritable = await pdfpath.createWritable();
                await pdfWritable.write(pdffile);
                await pdfWritable.close();
            } catch (error) {
                console.error("Error creating PDF file:", error);
            }
        }

        setLoading(false);
    };

    return (
        <>
            <Paper>
                <Typography variant="h6" align="center">
                    Carpeta Proveedores: {comprobantes.filter((comprobante) => comprobante.parsed.xml_path.includes("proveedores"))?.length}
                </Typography>
                <Typography variant="h6" align="center">
                    Carpeta Docentes: {comprobantes.filter((comprobante) => comprobante.parsed.xml_path.includes("docentes"))?.length}
                </Typography>
                <Typography variant="h6" align="center">
                    Carpeta Error Forma de Pago: {comprobantes.filter((comprobante) => comprobante.parsed.xml_path.includes("error_forma_pago"))?.length}
                </Typography>
                <Button variant="contained" color="primary" onClick={handleDestinationPath}>
                    Seleccionar Carpeta Destino
                </Button>
                <Button variant="contained" color="primary" onClick={handleClassify}>
                    Clasificar
                </Button>

                {/* section to test the creation of folders with a name written in a text field */}

                <TextField
                    id="outlined-basic"
                    label="Nombre de la carpeta"
                    variant="outlined"
                    value={folderName}
                    onChange={(e) => setFolderName(e.target.value)}
                />
                <Button variant="contained" color="primary" onClick={handleCreateFolder}>
                    Crear Carpeta
                </Button>
                    
            </Paper>
        </>
    );
};
