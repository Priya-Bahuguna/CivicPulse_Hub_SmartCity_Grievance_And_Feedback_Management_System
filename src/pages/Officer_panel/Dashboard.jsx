import React, { useEffect, useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";

import Sidebar from "./Sidebar";
import SummaryCards from "./SummaryCards";
import RecentComplaintsTable from "./RecentComplaintsTable";
import AllComplaintsCards from "./AllComplaintsCards";
import UpdateGrievanceModal from "./UpdateGrievanceModal";
import EditProfile from "./ProfileDetaills"; // adjust path as needed
import OfficerFeedback from "./Feedback/OfficerFeedback";

const OfficerDashboard = () => {
  const [selected, setSelected] = useState("Dashboard");
  const [complaints, setComplaints] = useState([]);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [filters, setFilters] = useState({
    status: "All",
    priority: "All",
    category: "All",
  });

  useEffect(() => {
    const fetchComplaints = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:8081/api/officer/complaints",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComplaints(res.data);
    };
    fetchComplaints();
  }, []);

  const handleViewDetails = (complaint) => {
    setSelectedComplaint(complaint);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedComplaint(null);
  };

  const countByStatus = (status) =>
    complaints.filter((c) => c.status === status).length;

  const categories = [...new Set(complaints.map((c) => c.category))];

  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };

  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch =
      c.title?.toLowerCase().includes(search.toLowerCase()) ||
      c.category?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = filters.status === "All" || c.status === filters.status;
    const matchesPriority =
      filters.priority === "All" || c.priority === filters.priority;
    const matchesCategory =
      filters.category === "All" || c.category === filters.category;

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  const summaryCounts = [
    { label: "Pending", value: countByStatus("PENDING"), color: "#ff9800" },
    { label: "Escalated", value: countByStatus("ESCALATED"), color: "#f44336" },
    { label: "In Progress", value: countByStatus("IN_PROGRESS"), color: "#2196f3" },
    { label: "Resolved", value: countByStatus("RESOLVED"), color: "#4caf50" },
  ];

  return (
    <Box sx={{ display: "flex", bgcolor: "var(--page-bg)", minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sidebar selected={selected} setSelected={setSelected} />

      {/* Main Content */}
      <Box sx={{ flexGrow: 1 }}>
        {/* AppBar */}
        <AppBar position="static" sx={{ bgcolor: "var(--surface)", color: "var(--text-primary)" }}>
          <Toolbar>
            <Typography variant="h5" fontWeight="bold">
              {selected}
            </Typography>
          </Toolbar>
        </AppBar>

        <Box p={3}>
          {/* Dashboard View */}
          {selected === "Dashboard" && (
            <>
              <Box display="flex" gap={2} flexWrap="wrap" mb={4}>
                {summaryCounts.map((card) => (
                  <SummaryCards
                    key={card.label}
                    counts={[card]}
                    sx={{ flex: 1, minWidth: 200 }}
                  />
                ))}
              </Box>

              {/* Search + Filters */}
              <Box
                display="flex"
                gap={2}
                flexWrap="wrap"
                alignItems="center"
                mb={3}
              >
                <TextField
                  placeholder="Search by title or category..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1 }} /> }}
                  sx={{ flex: 2, minWidth: 250 }}
                />

                <FormControl size="small" sx={{ flex: 1, minWidth: 150 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filters.status}
                    label="Status"
                    onChange={(e) => handleFilterChange("status", e.target.value)}
                  >
                    <MenuItem value="All">All</MenuItem>
                    <MenuItem value="PENDING">Pending</MenuItem>
                    <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                    <MenuItem value="RESOLVED">Resolved</MenuItem>
                    <MenuItem value="ESCALATED">Escalated</MenuItem>
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ flex: 1, minWidth: 150 }}>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={filters.priority}
                    label="Priority"
                    onChange={(e) =>
                      handleFilterChange("priority", e.target.value)
                    }
                  >
                    <MenuItem value="All">All</MenuItem>
                    <MenuItem value="LOW">Low</MenuItem>
                    <MenuItem value="MEDIUM">Medium</MenuItem>
                    <MenuItem value="HIGH">High</MenuItem>
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ flex: 1, minWidth: 150 }}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={filters.category}
                    label="Category"
                    onChange={(e) =>
                      handleFilterChange("category", e.target.value)
                    }
                  >
                    <MenuItem value="All">All</MenuItem>
                    {categories.map((cat) => (
                      <MenuItem key={cat} value={cat}>
                        {cat}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <RecentComplaintsTable complaints={filteredComplaints.slice(0, 5)} />
            </>
          )}

          {/* All Complaints View */}
          {selected === "All Complaints" && (
            <AllComplaintsCards
              complaints={complaints}
              handleViewDetails={handleViewDetails}
            />
          )}
          {/* Feedback View */}
          {selected === "Feedback" && <OfficerFeedback />}

          {/* Profile View */}
          {selected === "Profile" && <EditProfile />}

          {/* Complaint Modal */}
          {selectedComplaint && (
            <UpdateGrievanceModal
              open={modalOpen}
              onClose={handleModalClose}
              grievance={selectedComplaint}
              onSubmit={async () => {
                const token = localStorage.getItem("token");
                const res = await axios.get(
                  "http://localhost:8081/api/officer/complaints",
                  { headers: { Authorization: `Bearer ${token}` } }
                );
                setComplaints(res.data);
              }}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default OfficerDashboard;
