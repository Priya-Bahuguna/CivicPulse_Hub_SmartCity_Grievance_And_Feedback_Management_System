import React, { useEffect, useState, useCallback } from "react";
import { Box, AppBar, Toolbar, Typography, Snackbar } from "@mui/material";
import { useNavigate } from "react-router-dom";

import Sidebar from "./Sidebar";
import ComplaintsTable from "./ComplaintsTable";
import NotificationsList from "./NotificationsList";
import SubmitGrievance from "./SubmitGrievance";
import TrackComplaints from "./TrackComplaints";
import FeedbackContainer from "../Feedback/FeedbackContainer";
import CitizenProfile from "./CitizenProfile";

const drawerWidth = 260;

const UserDashboard = () => {
  const navigate = useNavigate();

  const [selected, setSelected] = useState("Dashboard");
  const [complaints, setComplaints] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [complaintLoading, setComplaintLoading] = useState(false);
  const [feedbackComplaint, setFeedbackComplaint] = useState(null);

  // Load notifications from localStorage on mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem("userNotifications");
    if (savedNotifications) {
      try {
        setNotifications(JSON.parse(savedNotifications));
      } catch (error) {
        console.error("Error parsing saved notifications:", error);
      }
    }
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("userNotifications", JSON.stringify(notifications));
  }, [notifications]);

  // Snackbar state
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const token = localStorage.getItem("token");

  // ================= AUTH CHECK =================
  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [navigate, token]);

  // ================= FETCH COMPLAINTS =================
  const fetchComplaints = useCallback(async () => {
    try {
      setComplaintLoading(true);

      const res = await fetch("http://localhost:8081/api/citizen/complaints", {
        headers: { Authorization: "Bearer " + token },
      });

      const data = await res.json();
      console.log("📦 Complaints from API:", data);

      setComplaints(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("❌ Error fetching complaints:", error);
      setComplaints([]);
    } finally {
      setComplaintLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  // ================= WEBSOCKET NOTIFICATIONS =================
  useEffect(() => {
    if (!token) return;

    import("@stomp/stompjs").then(({ Client }) => {
      import("sockjs-client").then(({ default: SockJS }) => {
        const socket = new SockJS("http://localhost:8081/ws");
        const stompClient = new Client({
          webSocketFactory: () => socket,
          connectHeaders: { Authorization: `Bearer ${token}` },
          debug: (str) => console.log("STOMP: " + str),
          reconnectDelay: 5000,
          heartbeatIncoming: 10000,
          heartbeatOutgoing: 10000,
          onConnect: () => {
            console.log("✅ WebSocket connected");

            stompClient.subscribe("/user/queue/notify", (message) => {
              const payload = JSON.parse(message.body);
              console.log("🟢 Received notification:", payload);

              // Update complaint list live
              setComplaints((prev) =>
                prev.map((c) =>
                  c.id === payload.complaintId
                    ? { ...c, status: payload.status || payload.message }
                    : c
                )
              );

              // Add notification to notifications list
              const messageText = `Complaint #${payload.complaintId} status updated to ${payload.status}`;
              setNotifications((prev) => [messageText, ...prev]);

              // Show snackbar
              setSnackbarMsg(messageText);
              setOpenSnackbar(true);
            });
          },
        });

        stompClient.activate();

        return () => stompClient.deactivate();
      });
    });
  }, [token]);

  // ================= UI =================
  return (
    <Box sx={{ display: "flex", bgcolor: "var(--page-bg)", minHeight: "100vh" }}>
      <Sidebar
        drawerWidth={drawerWidth}
        selected={selected}
        setSelected={setSelected}
        notifications={notifications}
        navigate={navigate}
      />

      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={{ bgcolor: "var(--surface)", color: "var(--text-primary)" }}>
          <Toolbar>
            <Typography variant="h5" fontWeight="bold">
              Citizen Dashboard
            </Typography>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: 3 }}>
         {selected === "Dashboard" && (
            <ComplaintsTable
              complaints={complaints}
               loading={complaintLoading}
              fetchComplaints={fetchComplaints}
               onFeedback={(complaint) => {
              setFeedbackComplaint(complaint);
               setSelected("Feedback");
           }}
          />
          )}

          {selected === "Submit Grievance" && (
            <SubmitGrievance complaints={complaints} setComplaints={setComplaints} setNotifications={setNotifications} />
          )}

          {selected === "Track Complaints" && (
            <TrackComplaints
              initialComplaints={complaints}
              loading={complaintLoading}
              token={token}
            />
          )}

          {selected === "Notifications" && (
            <NotificationsList
              notifications={notifications}
              setNotifications={setNotifications}
            />
          )}

         {selected === "Feedback" && (
            <FeedbackContainer
              complaints={complaints}
              selectedComplaint={feedbackComplaint}
              clearSelection={() => setFeedbackComplaint(null)}
            />
          )}

          {selected === "My Profile" && <CitizenProfile />}

        </Box>
      </Box>

      {/* Snackbar for live notifications */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        message={snackbarMsg}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      />
    </Box>
  );
};

export default UserDashboard;
