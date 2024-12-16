import React, { useState } from "react";
import { Container, Box, Typography } from "@mui/material";
import SidebarComponent from "./components/SidebarComponent";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ClassifyWizardComponent from "./components/Classify/ClassifyWizardComponent";

function App() {
  return (
    <BrowserRouter basename="/">
      <Box sx={{ display: "flex", position: "relative"}}>
        <SidebarComponent />
        <Container id="content" sx={{ width: "100%", padding:1}}>
          <Routes>
            <Route
              path="/"
              element={<Typography variant="h1">Home</Typography>}
            />
            <Route
              path="/clasificar"
              element={<ClassifyWizardComponent />}
            ></Route>
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Container>
      </Box>
    </BrowserRouter>
  );
}

export default App;
