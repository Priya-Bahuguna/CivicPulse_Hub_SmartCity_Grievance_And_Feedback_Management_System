import React from "react";
import { Drawer, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import RateReviewIcon from "@mui/icons-material/RateReview";
import logoImg from "../../assets/logo.jpg";

const drawerWidth = 260;

const Sidebar = ({ selected, setSelected }) => {
  const menuItems = [
    { label: "Dashboard", icon: <DashboardIcon /> },
    { label: "All Complaints", icon: <AssignmentIcon /> },
    { label: "Feedback", icon: <RateReviewIcon /> },
    { label: "Profile", icon: <PersonIcon /> },
    { label: "Logout", icon: <LogoutIcon />, color: "error" },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        "& .MuiDrawer-paper": { width: drawerWidth, p: 2, bgcolor: "#f8f9fa" },
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <img src={logoImg} alt="CivicPulse Hub Logo" style={{ width: '40px', height: '40px' }} />
        <Typography variant="h6" fontWeight="bold">
          Civic Pulse Hub
        </Typography>
      </div>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton
              selected={selected === item.label}
              onClick={() => {
                if (item.label === "Logout") {
                  localStorage.removeItem("token");
                  window.location.href = "/";
                } else {
                  setSelected(item.label);
                }
              }}
              sx={{ borderRadius: 2, '&:hover': { backgroundColor: 'var(--border-soft)' } }}
            >
              <ListItemIcon
                sx={{
                  color:
                    item.color === "error"
                      ? "red"
                      : selected === item.label
                      ? "var(--primary)"
                      : "var(--text-muted)",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} sx={{ '& .MuiListItemText-primary': { color: 'var(--text-primary)' } }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
