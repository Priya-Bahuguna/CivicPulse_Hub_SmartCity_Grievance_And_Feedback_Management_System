import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  CircularProgress,
} from "@mui/material";
import { getOfficerFeedback } from "../../../api/officer";

const OfficerFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOfficerFeedback()
      .then(res => setFeedbacks(res.data))
      .catch(err => {
        console.error("Error loading feedbacks:", err);
        alert(`Failed to load feedbacks: ${err.response?.data?.message || err.message}`);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <CircularProgress />;

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" mb={2}>
        Feedback on Your Resolved Complaints
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Complaint</TableCell>
            <TableCell>Citizen</TableCell>
            <TableCell>Rating</TableCell>
            <TableCell>Behaviour</TableCell>
            <TableCell>Timeliness</TableCell>
            <TableCell>Comment</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {feedbacks.map((f, i) => (
            <TableRow key={i}>
              <TableCell>
                #{f.complaintId} – {f.complaintTitle}
              </TableCell>
              <TableCell>
                {f.citizenName} ({f.citizenLocation})
              </TableCell>
              <TableCell>
                <Chip label={`${f.rating} ★`} color="success" />
              </TableCell>
              <TableCell>{f.officerBehaviourRating} ★</TableCell>
              <TableCell>{f.timeliness}</TableCell>
              <TableCell>{f.feedbackComment}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default OfficerFeedback;
