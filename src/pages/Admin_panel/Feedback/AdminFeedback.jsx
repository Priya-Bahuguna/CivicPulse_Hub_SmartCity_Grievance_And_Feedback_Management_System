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
import api from "../../../api/axios";

const AdminFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/admin/feedback/all")
      .then(res => setFeedbacks(res.data))
      .catch(() => alert("Failed to load feedbacks"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <CircularProgress />;

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" mb={2}>
        All Citizen Feedback
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Complaint</TableCell>
            <TableCell>Citizen</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Rating</TableCell>
            <TableCell>Officer Behaviour</TableCell>
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
              <TableCell>{f.complaintCategory}</TableCell>
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

export default AdminFeedback;
