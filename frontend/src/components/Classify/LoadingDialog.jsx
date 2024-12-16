import React from "react";
import { Dialog, DialogContent, DialogTitle, LinearProgress, Typography, Box } from "@mui/material";

export default function LoadingDialog({ open, progress, total, label }) {
    return (
        <Dialog open={open}>
            <DialogTitle>Cargando...</DialogTitle>
            <DialogContent>
                <Box display="flex" flexDirection="column" alignItems="center">
                    <Typography variant="body1">{label}</Typography>
                    <Box width="100%" mt={2}>
                        <LinearProgress variant="determinate" 
                        transition="none"
                        value={(progress / total) * 100} />
                    </Box>
                    <Typography variant="body2" mt={2}>
                        {progress} de {total} tareas completadas
                    </Typography>
                </Box>
            </DialogContent>
        </Dialog>
    );
}
