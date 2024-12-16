import React, { useState } from "react";
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from "@mui/material";
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { Link } from "react-router-dom";

const SidebarComponent = () => {
  const [open, setOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    if (isCollapsed) {
      document.getElementById("sidebar").style.position = "fixed";
    } else {
      document.getElementById("sidebar").style.position = "relative";
    }
  };

  return (
    <Box
      id="sidebar"
      sx={{
        zIndex: 100,
      }}
    >
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 240,
            transition: "width 0.3s",
          },
        }}
      >
        <List>
          <ListItem>
            <ListItemIcon>
              <MenuIcon />
            </ListItemIcon>
          </ListItem>
          <Divider />
          <ListItem component={Link} to="/">
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem
            component={Link}
            to="/clasificar"
          >
            <ListItemText primary="Clasificar" />
          </ListItem>
        </List>
      </Drawer>
    </Box>
  );
};

export default SidebarComponent;
