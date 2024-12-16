import React from "react";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from "@mui/material";
import * as XLSX from "xlsx";

export const ComprobantesTable = ({ comprobantes }) => {
    const handleDownloadExcel = () => {
        //create an array with all comprobante.parsed (where is the data)
        const parsedComprobantes = comprobantes.map((comprobante) => comprobante.parsed);
        const ws = XLSX.utils.json_to_sheet(parsedComprobantes);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Comprobantes");
        XLSX.writeFile(wb, "comprobantes.xlsx");
    };

    return (
        <>
            <Button onClick={handleDownloadExcel}>Descargar Excel</Button>
            <TableContainer component={Paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Fecha Emision Doc Sustento</TableCell>
                            <TableCell>Num Doc Modificado</TableCell>
                            <TableCell>Tipo Identificacion Comprador</TableCell>
                            <TableCell>Razon Social</TableCell>
                            <TableCell>Cod Doc</TableCell>
                            <TableCell>Estab</TableCell>
                            <TableCell>Pto Emi</TableCell>
                            <TableCell>Secuencial</TableCell>
                            <TableCell>Id Comprobante</TableCell>
                            <TableCell>Ruc</TableCell>
                            <TableCell>Is Docente</TableCell>
                            <TableCell>Fecha</TableCell>
                            <TableCell>Forma Pago</TableCell>
                            <TableCell>Forma Pago Admitida</TableCell>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Contribuyente Rimpe</TableCell>
                            <TableCell>Fecha Emision</TableCell>
                            <TableCell>Fecha Autorizacion</TableCell>
                            <TableCell>Valor</TableCell>
                            <TableCell>Tipo</TableCell>
                            <TableCell>Codigo Porcentaje</TableCell>
                            <TableCell>Codigo Admitido</TableCell>
                            <TableCell>Tipo Documento</TableCell>
                            <TableCell>Numero Autorizacion</TableCell>
                            <TableCell>XML Path</TableCell>
                            <TableCell>PDF Path</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {comprobantes.map((comprobante, index) => (
                             <TableRow key={index}>
                                <TableCell>{comprobante.parsed?.fechaEmisionDocSustento?? "N/A"}</TableCell>
                                <TableCell>{comprobante.parsed?.numDocModificado?? "N/A"}</TableCell>
                                <TableCell>{comprobante.parsed?.tipoIdentificacionComprador?? "N/A"}</TableCell>
                                <TableCell>{comprobante.parsed?.razonSocial?? "N/A"}</TableCell>
                                <TableCell>{comprobante.parsed?.codDoc?? "N/A"}</TableCell>
                                <TableCell>{comprobante.parsed?.estab?? "N/A"}</TableCell>
                                <TableCell>{comprobante.parsed?.ptoEmi?? "N/A"}</TableCell>
                                <TableCell>{comprobante.parsed?.secuencial?? "N/A"}</TableCell>
                                <TableCell>{comprobante.parsed?.idComprobante?? "N/A"}</TableCell>
                                <TableCell>{comprobante.parsed?.ruc?? "N/A"}</TableCell>
                                <TableCell>{comprobante.parsed?.isDocente?"Y":"N" ?? "N/A"}</TableCell>
                                <TableCell>{comprobante.parsed?.fecha?? "N/A"}</TableCell>
                                <TableCell>{comprobante.parsed?.formaPago?? "N/A"}</TableCell>
                                <TableCell>{comprobante.parsed?.formaPagoAdmitida?"Y":"N"?? "N/A"}</TableCell>
                                <TableCell>{comprobante.parsed?.nombre?? "N/A"}</TableCell>
                                <TableCell>{comprobante.parsed?.contribuyenteRimpe?? "N/A"}</TableCell>
                                <TableCell>{comprobante.parsed?.fechaEmision?? "N/A"}</TableCell>
                                <TableCell>{comprobante.parsed?.fechaAutorizacion?? "N/A"}</TableCell>
                                <TableCell>{comprobante.parsed?.valor?? "N/A"}</TableCell>
                                <TableCell>{comprobante.parsed?.tipo?? "N/A"}</TableCell>
                                <TableCell>{comprobante.parsed?.codigoPorcentaje?? "N/A"}</TableCell>
                                <TableCell>{comprobante.parsed?.codigoAdmitido?"Y":"N"?? "N/A"}</TableCell>
                                <TableCell>{comprobante.parsed?.tipoDocumento?? "N/A"}</TableCell>
                                <TableCell>{comprobante.parsed?.numeroAutorizacion?? "N/A"}</TableCell>
                                <TableCell>{comprobante.parsed?.xml_path?? "N/A"}</TableCell>
                                <TableCell>{comprobante.parsed?.pdf_path?? "N/A"}</TableCell>
                            </TableRow>

                        )
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};
