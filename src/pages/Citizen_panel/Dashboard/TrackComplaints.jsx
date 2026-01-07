import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Box,
  Chip,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Badge,
} from "@mui/material";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const TrackComplaints = ({ initialComplaints, loading, token }) => {
  const [complaints, setComplaints] = useState(initialComplaints || []);
  const [updatedComplaintId, setUpdatedComplaintId] = useState(null); // highlight updated
  const orangeColor = "#FF9800";

  const stageOrder = ["REGISTERED", "VERIFIED", "IN_PROGRESS", "ACTION_TAKEN", "RESOLVED"];
  const stageLabels = ["Registered", "Verified", "In Progress", "Action Taken", "Resolved"];

  // Map backend status to frontend stage
  const mapStatusToStage = (status) => {
    switch (status) {
      case "PENDING":
        return "REGISTERED";
      case "IN_PROGRESS":
        return "IN_PROGRESS";
      case "RESOLVED":
        return "RESOLVED";
      case "REJECTED":
        return "ACTION_TAKEN";
      case "REOPENED":
        return "VERIFIED";
      default:
        return "REGISTERED";
    }
  };

  // ------------------ WebSocket for live updates ------------------
  useEffect(() => {
    if (!token) return;

    const socket = new SockJS("http://localhost:8081/ws");
    const stompClient = new Client({
      webSocketFactory: () => socket,
      connectHeaders: { Authorization: `Bearer ${token}` },
      debug: (str) => console.log("STOMP: " + str),
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      onConnect: () => {
        console.log("✅ TrackComplaints WS connected");

        stompClient.subscribe("/user/queue/notify", (message) => {
          const payload = JSON.parse(message.body);
          console.log("🟢 TrackComplaints received notification:", payload);

          setComplaints((prev) =>
            prev.map((c) =>
              c.id === payload.complaintId
                ? { ...c, status: payload.status }
                : c
            )
          );

          setUpdatedComplaintId(payload.complaintId);
          setTimeout(() => setUpdatedComplaintId(null), 5000);
        });
      },
    });

    stompClient.activate();
    return () => stompClient.deactivate();
  }, [token]);

  console.log("✅ TrackComplaints complaints prop:", complaints);

  // ------------------ Loading and empty state ------------------
  if (loading) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <CircularProgress sx={{ color: orangeColor }} />
      </Box>
    );
  }

  if (!complaints || complaints.length === 0) {
    return (
      <Typography sx={{ textAlign: "center", color: "gray", mt: 4 }}>
        ⚠ No complaints to track
      </Typography>
    );
  }

  // ------------------ Render complaints ------------------
  return (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3 }}>
        Track Complaints
      </Typography>

      {complaints.map((c) => {
        const mappedStage = mapStatusToStage(c.status);
        const activeStep = stageOrder.indexOf(mappedStage);
        const isUpdated = c.id === updatedComplaintId;

        return (
          <Paper
            key={c.id}
            sx={{
              p: 2,
              mb: 3,
              borderLeft: `5px solid ${orangeColor}`,
              boxShadow: isUpdated ? `0 0 10px 2px ${orangeColor}` : "none",
              transition: "box-shadow 0.5s ease",
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">{c.title}</Typography>
              {isUpdated && (
                <Badge
                  color="secondary"
                  badgeContent="Updated"
                  sx={{ fontSize: "0.8rem" }}
                />
              )}
            </Box>

            <Chip
              label={mappedStage.replace("_", " ")}
              sx={{ backgroundColor: orangeColor, color: "#fff", mt: 1 }}
            />

            <Typography mt={1}>
              <b>ID:</b> {c.id}
            </Typography>

            <Typography>
              <b>Date:</b>{" "}
              {c.submissionDate
                ? new Date(c.submissionDate).toLocaleDateString()
                : "N/A"}
            </Typography>

            <Box sx={{ mt: 2 }}>
              <Stepper activeStep={activeStep >= 0 ? activeStep : 0} alternativeLabel>
                {stageLabels.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>
          </Paper>
        );
      })}
    </Paper>
  );
};

export default TrackComplaints;
