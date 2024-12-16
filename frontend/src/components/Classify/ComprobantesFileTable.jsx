import React from "react";
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import axios from "axios";

export const ComprobantesFileTable = ({ comprobantes, setComprobantes, setLoading, setCurrentTaskLabel }) => {
    const handleAnalyzeSingleComprobante = async (comprobante) => {
        console.log("Analyzing comprobante:", comprobante);
        setLoading(true);
        setCurrentTaskLabel("Analizando comprobante...");
        const formData = new FormData();
        formData.append("xml", comprobante.xml);
        try {
            const response = await axios.post("http://localhost:5000/api/parse", formData, {
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
        setLoading(false);
    };


    return (
        <TableContainer component={Paper}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Procesable</TableCell>
                        <TableCell>Id</TableCell>
                        <TableCell>Acciones</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {comprobantes.sort((a, b) => a.procesable - b.procesable).map((comprobante, index) => (
                            <TableRow key={index}>
                                <TableCell align="center">{comprobante.procesable ? "✓" : "✗"}</TableCell>
                                <TableCell>{comprobante.id}</TableCell>
                                <TableCell>
                                    <Button onClick={() => handleAnalyzeSingleComprobante(comprobante)}>Analizar</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
