import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Folder } from "@mui/icons-material";
import FolderSelectorComponent from "./FolderSelectorComponent";
import OpenFolderStepComponent from "./OpenFolderStepComponent";
import LoadingDialog from "./LoadingDialog";
import { AnalyzeComprobantesStepComponent } from "./AnalyzeComprobantesStepComponent";
import { ClassifyComprobantesComponent } from "./ClassifyComprobantesComponent";

const steps = ["Abrir carpeta de origen", "Verificar la información", "Clasificar los archivos"];

export default function HorizontalLinearStepper() {
    const [activeStep, setActiveStep] = React.useState(0);
    const [skipped, setSkipped] = React.useState(new Set());
    const [files, setFiles] = React.useState([]);
    const [comprobantes, setComprobantes] = React.useState([]);
    const [stepCompleted, setStepCompleted] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [progress, setProgress] = React.useState(0);
    const [totalTasks, setTotalTasks] = React.useState(0);
    const [currentTaskLabel, setCurrentTaskLabel] = React.useState("");

    const isStepOptional = (step) => {
        return false;
    };

    const isStepSkipped = (step) => {
        return skipped.has(step);
    };

    const handleNext = () => {
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleSkip = () => {
        if (!isStepOptional(activeStep)) {
            // You probably want to guard against something like this,
            // it should never occur unless someone's actively trying to break something.
            throw new Error("No puedes saltar un paso que es obligatorio.");
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped((prevSkipped) => {
            const newSkipped = new Set(prevSkipped.values());
            newSkipped.add(activeStep);
            return newSkipped;
        });
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    return (
        <Box sx={{ width: "100%" }}>
            <Stepper activeStep={activeStep} orientation="horizontal">
                {steps.map((label, index) => {
                    const stepProps = {};
                    const labelProps = {};
                    // if (isStepOptional(index)) {
                    //     labelProps.optional = (
                    //     <Typography variant="caption">Opcional</Typography>
                    //     );
                    //     // }
                    //   if (isStepSkipped(index)) {
                    //     stepProps.completed = false;
                    //   }
                    return (
                        <Step key={label} {...stepProps}>
                            <StepLabel {...labelProps}>{label}</StepLabel>
                        </Step>
                    );
                })}
            </Stepper>
            {activeStep === steps.length ? (
                <React.Fragment>
                    <Typography sx={{ mt: 2, mb: 1 }}>Listo, has clasificado todos los archivos.</Typography>
                    <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                        <Box sx={{ flex: "1 1 auto" }} />
                        <Button onClick={handleReset}>Volver a empezar</Button>
                    </Box>
                </React.Fragment>
            ) : (
                <React.Fragment>
                    <Typography sx={{ mt: 2, mb: 1 }}>Paso {activeStep + 1}</Typography>
                    <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                        <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
                            Atrás
                        </Button>
                        <Box sx={{ flex: "1 1 auto" }} />
                        {isStepOptional(activeStep) && (
                            <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                                Saltar
                            </Button>
                        )}
                        <Button onClick={handleNext} disabled={!stepCompleted}>
                            {activeStep === steps.length - 1 ? "Finalizar" : "Continuar"}
                        </Button>
                    </Box>
                    <Box>
                        {activeStep === 0 && (
                            <OpenFolderStepComponent
                                files={files}
                                setFiles={setFiles}
                                comprobantes={comprobantes}
                                setComprobantes={setComprobantes}
                                stepCompleted={stepCompleted}
                                setStepCompleted={setStepCompleted}
                                setLoading={setLoading}
                                progress={progress}
                                setProgress={setProgress}
                                setTotalTasks={setTotalTasks}
                                setCurrentTaskLabel={setCurrentTaskLabel}
                            />
                        )}
                        {activeStep === 1 && (
                            <AnalyzeComprobantesStepComponent
                                files={files}
                                setFiles={setFiles}
                                comprobantes={comprobantes}
                                setComprobantes={setComprobantes}
                                stepCompleted={stepCompleted}
                                setStepCompleted={setStepCompleted}
                                setLoading={setLoading}
                                progress={progress}
                                setProgress={setProgress}
                                setTotalTasks={setTotalTasks}
                                setCurrentTaskLabel={setCurrentTaskLabel}
                            />
                        )}
                        {activeStep === 2 && (
                            <ClassifyComprobantesComponent
                                comprobantes={comprobantes}
                                setComprobantes={setComprobantes}
                                loading={loading}
                                setLoading={setLoading}
                                progress={progress}
                                setProgress={setProgress}
                                totalTasks={totalTasks}
                                setTotalTasks={setTotalTasks}
                                currentTaskLabel={currentTaskLabel}
                                setCurrentTaskLabel={setCurrentTaskLabel}
                            />
                        )}
                    </Box>
                </React.Fragment>
            )}
            <LoadingDialog open={loading} progress={progress} total={totalTasks} label={currentTaskLabel} />
        </Box>
    );
}
