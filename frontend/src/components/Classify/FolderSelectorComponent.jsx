import React from "react";
import { Box, IconButton, TextField, Button } from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";

export default function FolderSelectorComponent({ handleFolderSelect }) {

  return (
    <Box
      width="100%"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
    >
      <Button color="primary" component="label" startIcon={<FolderIcon />}>
        Examinar
        <input
          type="file"
          webkitdirectory="true"
          directory="true"
          multiple
          hidden
          onChange={handleFolderSelect}
        />
      </Button>
    </Box>
  );
}
