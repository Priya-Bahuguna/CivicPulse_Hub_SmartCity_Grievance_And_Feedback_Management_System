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

import AdminSidebar from "../Admin_panel/AdminSidebar";
import AdminSummaryCards from "../Admin_panel/AdminSummary";
import RecentComplaintsTable from "./RecentComplaintsTable";
import AllComplaintsCards from "./AllComplaintsCards";
import CreateOfficerForm from "./AdminCreateOfficer";
import AllComplaints from "../Admin_panel/AllComplaints";
import AdminAnalytics from "../Admin_panel/AdminAnalytics"; // ← new import
import AdminFeedback from "../Admin_panel/Feedback/AdminFeedback";
import { AdminProfile } from "../Admin_panel/AdminProfile";

import {
  connectWebSocket,
  disconnectWebSocket,
} from "../../hooks/useWebSocket";
import { fetchAdminComplaints, getAdminProfile } from "../../api/admin";

export default function AdminDashboard() {
  const [selected, setSelected] = useState("Dashboard");
  const [complaints, setComplaints] = useState([]);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    status: "All",
    priority: "All",
    category: "All",
  });
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");

  /* ===================== FETCH + WEBSOCKET ===================== */
  useEffect(() => {
    let isMounted = true;

    const loadComplaints = async () => {
      try {
        const res = await fetchAdminComplaints();
        if (isMounted) setComplaints(res.data || []);
      } catch (err) {
        console.error("Failed to load complaints:", err);
      }
    };

    const loadAdminProfile = async () => {
      try {
        const res = await getAdminProfile();
        if (isMounted) {
          setAdminName(res.data.name || '');
          setAdminEmail(res.data.email || '');
        }
      } catch (err) {
        console.error("Failed to load admin profile:", err);
      }
    };

    loadComplaints();
    loadAdminProfile();

    const ws = connectWebSocket({
      onAdminNotify: (newComplaint) => {
        if (isMounted) setComplaints((prev) => [newComplaint, ...prev]);
      },
    });

    return () => {
      isMounted = false;
      disconnectWebSocket(ws);
    };
  }, []);

  /* ===================== HELPERS ===================== */
  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };

  const countByStatus = (status) =>
    complaints.filter((c) => c.status === status).length;

  const categories = [
    ...new Set(complaints.map((c) => c.category).filter(Boolean)),
  ];

  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch =
      c.title?.toLowerCase().includes(search.toLowerCase()) ||
      c.category?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      filters.status === "All" || c.status === filters.status;
    const matchesPriority =
      filters.priority === "All" || c.priority === filters.priority;
    const matchesCategory =
      filters.category === "All" || c.category === filters.category;

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  const summaryCounts = [
    { label: "Pending", value: countByStatus("PENDING"), color: "#ff9800" },
    { label: "In Progress", value: countByStatus("IN_PROGRESS"), color: "#2196f3" },
    { label: "Resolved", value: countByStatus("RESOLVED"), color: "#4caf50" },
    { label: "Escalated", value: countByStatus("ESCALATED"), color: "#f44336" },
  ];

  /* ===================== UI ===================== */
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--page-bg)', color: 'var(--text-primary)' }}>
      <AdminSidebar selected={selected} setSelected={setSelected} adminName={adminName} adminEmail={adminEmail} />

      <div style={{ flex: 1, marginLeft: '256px' }}>
        {/* Header */}
        <header style={{ backgroundColor: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '32px', paddingTop: '16px', paddingBottom: '16px' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>{selected}</h1>
        </header>

        <main className="p-8">
          {/* DASHBOARD */}
          {selected === "Dashboard" && (
            <>
              <Box display="flex" gap={2} flexWrap="wrap" mb={4}>
                {summaryCounts.map((card) => (
                  <AdminSummaryCards
                    key={card.label}
                    counts={[card]}
                    sx={{ flex: 1, minWidth: 200 }}
                  />
                ))}
              </Box>

              <Box display="flex" gap={2} flexWrap="wrap" mb={3}>
                <TextField
                  placeholder="Search by title or category..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1 }} /> }}
                  size="small"
                />
                <FormControl size="small">
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
              </Box>

              <RecentComplaintsTable complaints={filteredComplaints.slice(0, 5)} />
            </>
          )}

          {/* ALL COMPLAINTS */}
          {selected === "All Complaints" && (
            <AllComplaints
              complaints={filteredComplaints}
              refresh={async () => {
                const res = await fetchAdminComplaints();
                setComplaints(res.data || []);
              }}
            />
          )}

          {/* CREATE OFFICER */}
          {selected === "Create Officer" && <CreateOfficerForm />}

          {/* ANALYTICS */}
          {selected === "Analytics" && <AdminAnalytics />}
          {/* FEEDBACK */}
          {selected === "Feedback" && <AdminFeedback />}
          {/* PROFILE */}
          {selected === "Profile" && <AdminProfile />}

        </main>
      </div>
    </div>
  );
}
