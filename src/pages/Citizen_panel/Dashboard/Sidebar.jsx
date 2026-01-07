import React from "react";
import { Drawer, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import NotificationsIcon from "@mui/icons-material/Notifications";
import FeedbackIcon from "@mui/icons-material/Feedback";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import logoImg from "../../../assets/logo.jpg";

const Sidebar = ({ drawerWidth, selected, setSelected, notifications, navigate }) => {
  const sidebarItems = [
    { label: "Dashboard", icon: <DashboardIcon /> },
    { label: "Submit Grievance", icon: <MenuBookIcon /> },
    { label: "Track Complaints", icon: <TimelineOutlinedIcon /> },
    { label: "Notifications", icon: <NotificationsIcon /> },
    { label: "Feedback", icon: <FeedbackIcon /> },
    { label: "My Profile", icon: <PersonIcon /> },
    { label: "Logout", icon: <LogoutIcon />, color: "error" },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{ width: drawerWidth, "& .MuiDrawer-paper": { width: drawerWidth, p: 2, bgcolor: "#f8f9fa", color: "var(--text-primary)" } }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <img src={logoImg} alt="CivicPulse Hub Logo" style={{ width: '40px', height: '40px' }} />
        <Typography variant="h6" sx={{ color: "var(--primary)" }}>
          Civic Pulse Hub
        </Typography>
      </div>
      <List>
        {sidebarItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton
              selected={selected === item.label}
              onClick={() => {
                if (item.label === "Logout") {
                  localStorage.removeItem("token");
                  navigate("/");
                } else setSelected(item.label);
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText
                primary={
                  item.label === "Notifications" && notifications.length > 0
                    ? `Notifications (${notifications.length})`
                    : item.label
                }
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
