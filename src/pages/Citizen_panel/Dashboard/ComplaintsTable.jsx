import React, { useState } from "react";
import {
  Box,
  Paper,
  Grid,
  Typography,
  TextField,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Chip,
  Modal,
  CircularProgress,
} from "@mui/material";

/**
 * Backend now returns imageUrl starting with /uploads/complaints/filename.jpg
 * So we can safely prepend backend URL
 */
const BACKEND_URL = "http://localhost:8081";

const ComplaintsTable = ({ complaints, loading, fetchComplaints, onFeedback  }) => {
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const handleView = (complaint) => {
    setSelectedComplaint(complaint);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this complaint?")) return;

    try {
      await fetch(`${BACKEND_URL}/api/citizen/complaints/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      fetchComplaints();
    } catch {
      alert("Delete failed");
    }
  };

  const filteredComplaints = complaints.filter(
    (c) =>
      c.title?.toLowerCase().includes(search.toLowerCase()) ||
      c.category?.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status) => {
    if (status === "PENDING") return "warning";
    if (status === "IN_PROGRESS") return "secondary";
    if (status === "RESOLVED") return "success";
    return "default";
  };

  return (
    <>
      {/* ===== Stats ===== */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography>Total Complaints</Typography>
            <Typography variant="h4">{complaints.length}</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* ===== Table ===== */}
      <Paper sx={{ mt: 4, p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6">Recent Complaints</Typography>
          <TextField
            size="small"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
            <CircularProgress />
          </Box>
        ) : filteredComplaints.length === 0 ? (
          <Typography sx={{ textAlign: "center", mt: 3 }}>
            No complaints found.
          </Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Image</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredComplaints.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>{c.id}</TableCell>
                    <TableCell>{c.title}</TableCell>
                    <TableCell>{c.category}</TableCell>
                    <TableCell>
                      <Chip label={c.status} color={getStatusColor(c.status)} />
                    </TableCell>

                    {/* ===== IMAGE COLUMN ===== */}
                    <TableCell>
                      {c.imageUrl ? (
                        <img
                          src={`${BACKEND_URL}${c.imageUrl}`}
                          alt="complaint"
                          style={{
                            width: 60,
                            height: 60,
                            objectFit: "cover",
                            borderRadius: 4,
                            border: "1px solid #ddd",
                          }}
                        />
                      ) : (
                        "No Image"
                      )}
                    </TableCell>
                    
                    
                    <TableCell>
                      <Button onClick={() => handleView(c)}>View</Button>
                      <Button color="error" onClick={() => handleDelete(c.id)}>
                        Delete
                      </Button>
                       {/* ✅ FEEDBACK BUTTON ONLY FOR RESOLVED */}
                        {c.status === "RESOLVED" && (
                          <Button
                            size="small"
                            variant="outlined"
                            sx={{ ml: 1 }}
                            onClick={() => onFeedback(c)}
                          >
                            Feedback
                          </Button>
                        )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* ===== MODAL ===== */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 550,
            bgcolor: "background.paper",
            p: 4,
            borderRadius: 3,
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          {selectedComplaint && (
            <>
              <Typography variant="h6">{selectedComplaint.title}</Typography>
              <Typography>
                <b>Status:</b> {selectedComplaint.status}
              </Typography>
              <Typography>
                <b>Stage:</b> {selectedComplaint.complaintStage}
              </Typography>
              <Typography>
                <b>Category:</b> {selectedComplaint.category}
              </Typography>
              <Typography>
                <b>Priority:</b> {selectedComplaint.priority}
              </Typography>
              <Typography>
                <b>Description:</b> {selectedComplaint.description}
              </Typography>
              <Typography>
                <b>Location:</b> {selectedComplaint.location}
              </Typography>
              <Typography>
                <b>Citizen:</b> {selectedComplaint.citizenName}
              </Typography>
              <Typography>
                <b>Phone:</b> {selectedComplaint.citizenPhone}
              </Typography>
              <Typography>
                <b>Submission Date:</b>{" "}
                {new Date(selectedComplaint.submissionDate).toLocaleString()}
              </Typography>

              {selectedComplaint.expectedCompletionDate && (
                <Typography>
                  <b>Expected Completion:</b>{" "}
                  {new Date(selectedComplaint.expectedCompletionDate).toLocaleString()}
                </Typography>
              )}

              {selectedComplaint.officerRemark && (
                <Typography>
                  <b>Officer Remark:</b> {selectedComplaint.officerRemark}
                </Typography>
              )}

              {/* ===== MODAL IMAGE ===== */}
              {selectedComplaint.imageUrl && (
                <Box sx={{ my: 2 }}>
                  <img
                    src={`${BACKEND_URL}${selectedComplaint.imageUrl}`}
                    alt="complaint"
                    style={{
                      width: "100%",
                      maxHeight: 300,
                      objectFit: "contain",
                      borderRadius: 8,
                      border: "1px solid #ddd",
                    }}
                  />
                </Box>
              )}

              <Button sx={{ mt: 2 }} variant="contained" onClick={() => setModalOpen(false)}>
                Close
              </Button>
            </>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default ComplaintsTable;