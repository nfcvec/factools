import { Box, Paper, Button, Typography } from "@mui/material";
import { ComprobantesFileTable } from "./ComprobantesFileTable";
import axios from "axios";
import { ComprobantesTable } from "./ComprobantesTable";
import { useEffect } from "react";

export const AnalyzeComprobantesStepComponent = ({
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
}) => {
    const handleAnalyzeComprobantes = async () => {
        console.log("Analyzing comprobantes...");
        setLoading(true);
        setProgress(0);
        setTotalTasks(comprobantes.length);
        setCurrentTaskLabel("Analizando comprobantes...");

        const batchSize = 200; // Actualiza el progreso cada 30 archivos

        for (let i = 0; i < comprobantes.length; i += batchSize) {
            const batch = comprobantes.slice(i, i + batchSize);
            const promises = batch.map(async (comprobante) => {
                if (!comprobante.xml) {
                    return;
                }

                const formData = new FormData();
                formData.append("xml", comprobante.xml);

                try {
                    const response = await axios.post("http://127.0.0.1:5000/api/parse", formData, {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    });

                    if (response.data.success) {
                        console.log("Comprobante analyzed successfully:", response.data);
                        comprobante.parsed = response.data.comprobante;
                        comprobante.procesable = true;
                        setComprobantes([...comprobantes]);
                    } else {
                        console.error("Error analyzing comprobante:", response.data.error);
                        comprobante.procesable = false;
                        setComprobantes([...comprobantes]);
                    }
                } catch (error) {
                    console.error("Error analyzing comprobante:", error);
                    comprobante.procesable = false;
                    setComprobantes([...comprobantes]);
                }

                setProgress((prevProgress) => prevProgress + 1);
            });

            await Promise.all(promises);
            setProgress(i + batchSize);
        }

        setLoading(false);
    };

    useEffect(() => {
        if (comprobantes.length > 0) {
            handleAnalyzeComprobantes();
        }
    },[]);

    return (
        <Box>
            <Paper>
                <Box>
                    <Typography variant="h5">Comprobantes procesables: { 
                        comprobantes.filter((comprobante) => comprobante.procesable).length
                    }</Typography>
                    <Typography variant="h5">Comprobantes no procesables: { 
                        comprobantes.filter((comprobante) => !comprobante.procesable).length
                    }</Typography>
                </Box>

                <ComprobantesTable comprobantes={comprobantes} />
            </Paper>
        </Box>
    );
};
