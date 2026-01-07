import React, { useEffect, useState, useMemo } from "react";
import { Paper, Grid, Typography, CircularProgress, Box } from "@mui/material";
import axios from "axios";
import {
  PieChart, Pie, Cell, Legend, Tooltip as RechartsTooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from "recharts";
import { MapContainer, TileLayer, CircleMarker, Tooltip as LeafletTooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA336A", "#8884d8"];

const AdminAnalytics = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const axiosConfig = useMemo(() => ({ headers: { Authorization: `Bearer ${token}` } }), [token]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:8081/api/admin/complaints", axiosConfig);
        setComplaints(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch complaints");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [axiosConfig]);

  // PieChart: Category
  const categoryData = useMemo(() => {
    const counts = complaints.reduce((acc, c) => {
      const cat = c.category || "Unknown";
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([key, val]) => ({ name: key, value: val }));
  }, [complaints]);

  // PieChart: Status
  const statusData = useMemo(() => {
    const counts = complaints.reduce((acc, c) => {
      const status = c.status || "Unknown";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([key, val]) => ({ name: key, value: val }));
  }, [complaints]);

  // BarChart: Avg Resolution Time
  const slaData = useMemo(() => {
    const deptMap = {};
    complaints.forEach(c => {
      const dept = c.assignedOfficer?.department || "Unknown";
      if (!deptMap[dept]) deptMap[dept] = { totalTime: 0, count: 0 };
      if (c.assignedDate && c.resolutionDate) {
        const diffHours = (new Date(c.resolutionDate) - new Date(c.assignedDate)) / (1000 * 60 * 60);
        deptMap[dept].totalTime += diffHours;
        deptMap[dept].count += 1;
      }
    });
    return Object.keys(deptMap).map(dept => ({
      department: dept,
      avgResolutionTime: deptMap[dept].count ? (deptMap[dept].totalTime / deptMap[dept].count).toFixed(2) : 0,
    }));
  }, [complaints]);

  // Heatmap
  const heatmapData = useMemo(() => {
    return complaints
      .filter(c => c.latitude && c.longitude)
      .map(c => ({ lat: c.latitude, lng: c.longitude, title: c.title }));
  }, [complaints]);

  if (loading) return <CircularProgress sx={{ display: "block", margin: "50px auto" }} />;

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, backgroundColor: "#f5f6fa", minHeight: "100vh" }}>
      <Typography variant="h4" mb={4} textAlign="center">Admin Analytics Dashboard</Typography>
      <Grid container spacing={4}>
        {/* PieChart: Category */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 4, backgroundColor: "#fff", height: "100%" }}>
            <Typography variant="h6" mb={2}>Complaints by Category</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius="80%"
                  label
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" />
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* PieChart: Status */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 4, backgroundColor: "#fff", height: "100%" }}>
            <Typography variant="h6" mb={2}>Complaints by Status</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius="80%"
                  label
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-status-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" />
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* BarChart: Avg Resolution Time */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 4, backgroundColor: "#fff" }}>
            <Typography variant="h6" mb={2}>Avg Resolution Time by Department (Hours)</Typography>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={slaData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" />
                <YAxis />
                <RechartsTooltip />
                <Bar dataKey="avgResolutionTime">
                  {slaData.map((entry, index) => (
                    <Cell
                      key={`cell-sla-${index}`}
                      fill={entry.avgResolutionTime < 12 ? "#4caf50" :
                            entry.avgResolutionTime < 24 ? "#ff9800" : "#f44336"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Heatmap */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 4, backgroundColor: "#fff" }}>
            <Typography variant="h6" mb={2}>Complaints Heatmap</Typography>
            <Box sx={{ height: 700, borderRadius: 2, overflow: "hidden" }}>
              <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: "100%", width: "100%" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {heatmapData.map((point, idx) => (
                  <CircleMarker
                    key={idx}
                    center={[point.lat, point.lng]}
                    radius={10}
                    color="red"
                    fillOpacity={0.6}
                  >
                    <LeafletTooltip>{point.title}</LeafletTooltip>
                  </CircleMarker>
                ))}
              </MapContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminAnalytics;
