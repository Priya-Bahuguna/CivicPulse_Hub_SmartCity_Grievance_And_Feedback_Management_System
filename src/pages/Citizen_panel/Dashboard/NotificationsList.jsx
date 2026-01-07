import React, { useEffect, useState, useRef } from "react";
import { Box, Paper, Typography, Button, Snackbar, Slide } from "@mui/material";

const NotificationsList = ({ notifications = [], setNotifications }) => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(null);

  const shownNotificationsRef = useRef(new Set()); // track already shown notifications
  const queueRef = useRef([]); // queue for snackbar messages
  const initializedRef = useRef(false); // avoid double run in strict mode

  const SlideTransition = (props) => <Slide {...props} direction="down" />;

  // Convert raw message to a friendly format
  const friendlyMessage = (msg) => {
    if (!msg) return "";

    const match = msg.match(/Complaint #(.*?) status updated to (.*)/);
    if (match) {
      const [, id, status] = match;
      switch (status) {
        case "IN_PROGRESS":
          return `Good news! Your complaint #${id} is now being processed.`;
        case "RESOLVED":
          return `Your complaint #${id} has been resolved. Thank you for your patience!`;
        case "REJECTED":
          return `Unfortunately, your complaint #${id} could not be resolved. Please contact support.`;
        default:
          return `Complaint #${id} status updated: ${status}`;
      }
    }

    return msg;
  };

  // Process incoming notifications
  useEffect(() => {
    // Skip first mount in strict mode
    if (!initializedRef.current) {
      initializedRef.current = true;
      return;
    }

    // Push new notifications to queue
    notifications.forEach((note) => {
      if (!shownNotificationsRef.current.has(note)) {
        queueRef.current.push(note);
        shownNotificationsRef.current.add(note);
      }
    });

    if (!openSnackbar && queueRef.current.length > 0) {
      const processQueue = () => {
        if (queueRef.current.length === 0) return;

        const next = queueRef.current.shift();

        // async update to avoid cascading renders
        setTimeout(() => {
          const index = notifications.findIndex((n) => n === next);

          setSnackbarMsg(friendlyMessage(next));
          setOpenSnackbar(true);
          setHighlightedIndex(index);

          // Remove highlight after 3s
          setTimeout(() => setHighlightedIndex(null), 3000);

          // process next notification after snackbar hides
          setTimeout(processQueue, 4000);
        }, 0);
      };

      processQueue();
    }
  }, [notifications, openSnackbar]);

  // Notifications are now permanent - no deletion allowed
  // const markAsRead = (index) => {
  //   setNotifications((prev) => prev.filter((_, i) => i !== index));
  // };

  return (
    <Box sx={{ p: 2 }}>
      {notifications.length === 0 ? (
        <Typography>No notifications</Typography>
      ) : (
        notifications.map((note, index) => (
          <Paper
            key={index}
            sx={{
              p: 2,
              mb: 1,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              bgcolor: highlightedIndex === index ? "#e3f2fd" : "white",
              transition: "background-color 0.5s ease",
            }}
          >
            <Typography>{friendlyMessage(note)}</Typography>
            <Button size="small" onClick={() => markAsRead(index)}>
              Mark as Read
            </Button>
          </Paper>
        ))
      )}

      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        message={snackbarMsg}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        TransitionComponent={SlideTransition}
      />
    </Box>
  );
};

export default NotificationsList;
