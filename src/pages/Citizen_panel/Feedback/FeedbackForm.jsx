import React, { useState } from "react";
import {
  Paper,
  Typography,
  Rating,
  TextField,
  MenuItem,
  Button,
} from "@mui/material";
import api from "../../../api/axios";

const FeedbackForm = ({ complaint, onBack }) => {
  const [form, setForm] = useState({
    rating: 0,
    officerBehaviourRating: 0,
    resolutionStatus: "",
    timeliness: "",
    feedbackComment: "",
  });

  const submit = async () => {
    try {
      await api.post(
        `/api/citizen/feedback/submit/${complaint.id}`,
        form
      );
      alert("Feedback submitted successfully");
      onBack();
    } catch (err) {
      alert("Feedback already submitted or failed");
    }
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 600, mx: "auto" }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Feedback for Complaint #{complaint.id}
      </Typography>

      <Typography>Overall Rating</Typography>
      <Rating
        value={form.rating}
        onChange={(_, v) => setForm({ ...form, rating: v })}
      />

      <Typography sx={{ mt: 2 }}>Officer Behaviour</Typography>
      <Rating
        value={form.officerBehaviourRating}
        onChange={(_, v) =>
          setForm({ ...form, officerBehaviourRating: v })
        }
      />

      <TextField
        select
        fullWidth
        label="Resolution Status"
        sx={{ mt: 3 }}
        onChange={(e) =>
          setForm({ ...form, resolutionStatus: e.target.value })
        }
      >
        <MenuItem value="RESOLVED">Resolved</MenuItem>
        <MenuItem value="PARTIALLY_RESOLVED">
          Partially Resolved
        </MenuItem>
        <MenuItem value="NOT_RESOLVED">Not Resolved</MenuItem>
      </TextField>

      <TextField
        select
        fullWidth
        label="Timeliness"
        sx={{ mt: 2 }}
        onChange={(e) =>
          setForm({ ...form, timeliness: e.target.value })
        }
      >
        <MenuItem value="ON_TIME">On Time</MenuItem>
        <MenuItem value="SLIGHT_DELAY">Slight Delay</MenuItem>
        <MenuItem value="VERY_LATE">Very Late</MenuItem>
      </TextField>

      <TextField
        fullWidth
        multiline
        rows={3}
        label="Comment"
        sx={{ mt: 2 }}
        onChange={(e) =>
          setForm({ ...form, feedbackComment: e.target.value })
        }
      />

      <Button
        fullWidth
        variant="contained"
        sx={{ mt: 3 }}
        onClick={submit}
      >
        SUBMIT FEEDBACK
      </Button>

      <Button
        fullWidth
        variant="outlined"
        sx={{ mt: 1 }}
        onClick={onBack}
      >
        BACK
      </Button>
    </Paper>
  );
};

export default FeedbackForm;
