import React from "react";
import {
  Paper,
  Typography,
  Box,
  Button,
  Chip,
} from "@mui/material";

const FeedbackList = ({ complaints, onSelectComplaint }) => {
  const resolvedComplaints = complaints.filter(
    (c) => c.status === "RESOLVED"
  );

  if (resolvedComplaints.length === 0) {
    return (
      <Typography sx={{ textAlign: "center", mt: 4 }}>
        No resolved complaints available for feedback
      </Typography>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Give Feedback
      </Typography>

      {resolvedComplaints.map((c) => (
        <Paper
          key={c.id}
          sx={{
            p: 2,
            mb: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography fontWeight="bold">{c.title}</Typography>
            <Chip
              label={c.category}
              size="small"
              sx={{ mt: 1 }}
            />
          </Box>

          <Button
            variant="contained"
            onClick={() => onSelectComplaint(c)}
          >
            Give Feedback
          </Button>
        </Paper>
      ))}
    </Paper>
  );
};

export default FeedbackList;
