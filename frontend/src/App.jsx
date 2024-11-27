import React, { useState } from 'react';
import { ThemeProvider, CssBaseline, Container, Box, Dialog, Typography, Grid, Divider } from '@mui/material';

import FolderSelector from './components/FolderSelector';
import FacturaViewer from './components/FacturaViewer';
import ThemeToggle from './components/ThemeToggle';
import { createCustomTheme } from './theme/theme';

function App() {
  const [mode, setMode] = useState('dark');
  const theme = createCustomTheme(mode);
  const [loading, setLoading] = useState({
    open: false,
    message: ''
  });
  const [selectedFactura, setSelectedFactura] = useState(null);
  const [parseResult, setParseResult] = useState(null);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}
      >
        <Box height="7%" sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <ThemeToggle size="small" mode={mode} setMode={setMode} />
        </Box>
        <Box height="30%" width="100%" bgcolor="background.gray" overflow="auto" flexGrow={1}>
          <FolderSelector onFacturaSelect={setParseResult} setLoading={setLoading} />
        </Box>
        <Divider height="3%" />
        <Box height="60%" width="100%" overflow="auto" flexGrow={1}>
          <FacturaViewer parseResult={parseResult} />
        </Box>
      </Box>
      <Dialog open={loading.open}>
        <Box sx={{ p: 2 }}>
          <Typography variant="body1">{loading.message}</Typography>
        </Box>
      </Dialog>
    </ThemeProvider>
  );
}

export default App;