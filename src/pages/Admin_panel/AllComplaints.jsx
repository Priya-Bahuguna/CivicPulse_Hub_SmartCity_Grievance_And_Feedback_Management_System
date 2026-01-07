import React, { useState, useEffect, useCallback, useMemo } from "react";
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
  MenuItem,
  CircularProgress,
  Dialog,
  DialogContent,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { priorityColor } from "./helpers";

const AllComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("");
  const [openPreview, setOpenPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  const token = localStorage.getItem("token");

  const axiosConfig = useMemo(
    () => ({ headers: { Authorization: `Bearer ${token}` } }),
    [token]
  );

  // -------------------- FETCH DATA --------------------
  const fetchData = useCallback(async () => {
    if (!token) return alert("Session expired. Login again.");
    setLoading(true);
    try {
      const [complaintsRes, officersRes] = await Promise.all([
        axios.get("http://localhost:8081/api/admin/complaints", axiosConfig),
        axios.get(
          "http://localhost:8081/api/admin/complaints/officers/workload",
          axiosConfig
        ),
      ]);
      setComplaints(complaintsRes.data);
      setOfficers(officersRes.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [axiosConfig, token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // -------------------- DERIVED DATA --------------------
  const departments = [...new Set(officers.map((o) => o.department))];
  const availableOfficers = officers
    .filter((o) => o.department === selectedDept && o.status === "AVAILABLE")
    .sort((a, b) => a.activeComplaints - b.activeComplaints);
  const filteredComplaints = complaints.filter(
    (c) =>
      c.title?.toLowerCase().includes(search.toLowerCase()) ||
      c.category?.toLowerCase().includes(search.toLowerCase())
  );

  // -------------------- ASSIGN OFFICER --------------------
  const handleAssign = async (complaintId, officerId) => {
    try {
      await axios.post(
        `http://localhost:8081/api/admin/complaints/${complaintId}/assign-officer`,
        { officerId },
        axiosConfig
      );
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to assign officer");
    }
  };

  // -------------------- UPDATE STATUS --------------------
  const handleStatusChange = async (complaintId, newStatus) => {
    try {
      await axios.post(
        `http://localhost:8081/api/admin/complaints/${complaintId}/update-status`,
        { status: newStatus },
        axiosConfig
      );
      setComplaints((prev) =>
        prev.map((c) =>
          c.id === complaintId ? { ...c, status: newStatus } : c
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  // -------------------- UPDATE PRIORITY --------------------
  const handlePriorityChange = async (complaintId, newPriority) => {
    try {
      await axios.post(
        `http://localhost:8081/api/admin/complaints/${complaintId}/update-priority`,
        { priority: newPriority },
        axiosConfig
      );
      setComplaints((prev) =>
        prev.map((c) =>
          c.id === complaintId ? { ...c, priority: newPriority } : c
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update priority");
    }
  };

  // -------------------- STATUS COLOR --------------------
  const statusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "warning";
      case "IN_PROGRESS":
        return "info";
      case "RESOLVED":
        return "success";
      case "REOPENED":
        return "error";
      default:
        return "default";
    }
  };

  // -------------------- OPEN IMAGE PREVIEW --------------------
  const handleOpenPreview = (url) => {
    setPreviewUrl(url);
    setOpenPreview(true);
  };

  const handleClosePreview = () => {
    setOpenPreview(false);
    setPreviewUrl("");
  };

  // -------------------- UI --------------------
  return (
    <>
      {/* SUMMARY */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography>Total Complaints</Typography>
            <Typography variant="h4">{complaints.length}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography>Total Officers</Typography>
            <Typography variant="h4">{officers.length}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography>Free Officers</Typography>
            <Typography variant="h4">
              {officers.filter((o) => o.status === "AVAILABLE").length}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* FILTERS */}
      <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
        <TextField
          select
          label="Department"
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          sx={{ width: 250 }}
        >
          {departments.map((dept) => (
            <MenuItem key={dept} value={dept}>
              {dept}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          size="small"
          placeholder="Search complaint"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {selectedDept && (
          <Chip
            label={`Available: ${availableOfficers.length}`}
            color={availableOfficers.length ? "success" : "error"}
          />
        )}
      </Box>

      {/* TABLE */}
      <Paper sx={{ p: 3 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Officer</TableCell>
                  <TableCell>Officer Status</TableCell>
                  <TableCell>Officer Evidence</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredComplaints.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>{c.id}</TableCell>
                    <TableCell>{c.title}</TableCell>

                    {/* STATUS */}
                    <TableCell>
                      <TextField
                        select
                        size="small"
                        value={c.status}
                        onChange={(e) =>
                          handleStatusChange(c.id, e.target.value)
                        }
                      >
                        {["PENDING", "IN_PROGRESS", "RESOLVED", "REOPENED"].map(
                          (s) => (
                            <MenuItem key={s} value={s}>
                              <Chip label={s} color={statusColor(s)} />
                            </MenuItem>
                          )
                        )}
                      </TextField>
                    </TableCell>

                    {/* PRIORITY */}
                    <TableCell>
                      <TextField
                        select
                        size="small"
                        value={c.priority || "MEDIUM"}
                        onChange={(e) =>
                          handlePriorityChange(c.id, e.target.value)
                        }
                      >
                        {["LOW", "MEDIUM", "HIGH"].map((p) => (
                          <MenuItem key={p} value={p}>
                            <Chip label={p} color={priorityColor(p)} />
                          </MenuItem>
                        ))}
                      </TextField>
                    </TableCell>

                    {/* OFFICER */}
                    <TableCell>{c.assignedOfficer?.name || "Unassigned"}</TableCell>

                    {/* OFFICER STATUS */}
                    <TableCell>
                      {c.assignedOfficer ? (
                        <Chip
                          label={c.assignedOfficer.status}
                          color={
                            c.assignedOfficer.status === "AVAILABLE"
                              ? "success"
                              : "error"
                          }
                        />
                      ) : (
                        "-"
                      )}
                    </TableCell>

                    {/* OFFICER EVIDENCE (dialog preview) */}
                    <TableCell>
                      {c.officerEvidenceUrl ? (
                        <img
                          src={`http://localhost:8081${c.officerEvidenceUrl}`}
                          alt="Evidence"
                          style={{
                            width: 80,
                            borderRadius: 4,
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            handleOpenPreview(`http://localhost:8081${c.officerEvidenceUrl}`)
                          }
                        />
                      ) : (
                        "-"
                      )}
                    </TableCell>

                    {/* ASSIGN */}
                    <TableCell>
                      {!c.assignedOfficer && selectedDept && (
                        <Button
                          variant="contained"
                          disabled={!availableOfficers.length}
                          onClick={() =>
                            handleAssign(c.id, availableOfficers[0].id)
                          }
                        >
                          Assign
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

      {/* DIALOG FOR IMAGE PREVIEW */}
      <Dialog open={openPreview} onClose={handleClosePreview} maxWidth="md">
        <DialogContent sx={{ position: "relative", p: 0 }}>
          <IconButton
            sx={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}
            onClick={handleClosePreview}
          >
            <CloseIcon />
          </IconButton>
          <img
            src={previewUrl}
            alt="Evidence Preview"
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AllComplaints;
