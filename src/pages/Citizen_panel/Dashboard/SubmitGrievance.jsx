import React, { useState } from "react";
import {
  Paper,
  Typography,
  TextField,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Button,
  Divider,
  CircularProgress,
  Box,
} from "@mui/material";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MapSelector from "./MapSelector";

const primaryBlue = "#1976d2";

/**
 * 🔑 IMPORTANT:
 * Receive setComplaints from UserDashboard
 */
const SubmitGrievance = ({ setComplaints, setNotifications }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    citizenName: "",
    citizenPhone: "",
    showCitizenInfoToAdmin: true,
  });

  const [coordinates, setCoordinates] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    let newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!coordinates) newErrors.location = "Please select location on map";
    if (!formData.category) newErrors.category = "Category required";
    if (!formData.description.trim()) newErrors.description = "Description required";
    if (!formData.citizenName.trim()) newErrors.citizenName = "Name required";
    if (!/^[0-9]{10}$/.test(formData.citizenPhone))
      newErrors.citizenPhone = "Invalid 10-digit phone";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    // 🔥 OPTIMISTIC TEMP COMPLAINT
    const tempComplaint = {
      id: "temp-" + Date.now(),
      title: formData.title,
      description: formData.description,
      category: formData.category,
      status: "PENDING",
      submissionDate: new Date().toISOString(),
      location: formData.location,
    };

    // ✅ 1. SHOW IMMEDIATELY IN UI
    setComplaints((prev) => [tempComplaint, ...prev]);

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const fd = new FormData();

      Object.keys(formData).forEach((k) => fd.append(k, formData[k]));
      fd.append("latitude", coordinates.lat);
      fd.append("longitude", coordinates.lng);
      if (imageFile) fd.append("image", imageFile);

      const { data } = await axios.post(
        "http://localhost:8081/api/citizen/complaints/submit",
        fd,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // ✅ 2. REPLACE TEMP WITH REAL COMPLAINT
      setComplaints((prev) =>
        prev.map((c) => (c.id === tempComplaint.id ? data : c))
      );

      // ✅ 3. ADD NOTIFICATION FOR SUBMISSION
      const submissionMessage = `Your grievance "${formData.title}" has been submitted successfully with ID: ${data.id}. Status: PENDING`;
      setNotifications((prev) => [submissionMessage, ...prev]);

      toast.success(`Grievance submitted! ID: ${data.id}`, {
        autoClose: 1500,
      });

      handleCancel();
    } catch (err) {
      console.error(err);

      // ❌ 3. ROLLBACK TEMP DATA
      setComplaints((prev) =>
        prev.filter((c) => c.id !== tempComplaint.id)
      );

      toast.error("Failed to submit grievance");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      title: "",
      description: "",
      category: "",
      location: "",
      citizenName: "",
      citizenPhone: "",
      showCitizenInfoToAdmin: true,
    });
    setCoordinates(null);
    setImageFile(null);
    setErrors({});
  };

  return (
    <Paper sx={{ p: 4, borderRadius: 4, maxWidth: 750, mx: "auto" }}>
      <ToastContainer />

      <Typography variant="h5" sx={{ fontWeight: "bold", color: primaryBlue, mb: 3 }}>
        Submit New Grievance
      </Typography>

      <Divider sx={{ mb: 3 }} />

      <TextField
        fullWidth
        label="Title"
        name="title"
        value={formData.title}
        onChange={handleInputChange}
        error={!!errors.title}
        helperText={errors.title}
        sx={{ mb: 2 }}
      />

      <Typography sx={{ mb: 1 }}>Select Location on Map</Typography>
      <MapSelector onLocationSelect={(latlng) => setCoordinates(latlng)} />
      {coordinates && (
        <Typography>
          Selected: {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
        </Typography>
      )}
      {errors.location && <Typography color="error">{errors.location}</Typography>}

      <TextField
        fullWidth
        label="Location (Optional)"
        name="location"
        value={formData.location}
        onChange={handleInputChange}
        sx={{ mb: 2 }}
      />

      <TextField
        select
        fullWidth
        label="Category"
        name="category"
        value={formData.category}
        onChange={handleInputChange}
        error={!!errors.category}
        helperText={errors.category}
        sx={{ mb: 2 }}
      >
        <MenuItem value="ELECTRICITY">Electricity</MenuItem>
        <MenuItem value="WATER">Water</MenuItem>
        <MenuItem value="ROADS">Roads</MenuItem>
        <MenuItem value="SANITATION">Sanitation</MenuItem>
        <MenuItem value="TRAFFIC">Traffic</MenuItem>
        <MenuItem value="OTHER">Other</MenuItem>
      </TextField>

      <TextField
        fullWidth
        multiline
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleInputChange}
        error={!!errors.description}
        helperText={errors.description}
        sx={{ mb: 2 }}
      />

      <Typography>Upload Image (optional)</Typography>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files[0])}
        style={{ marginBottom: 20 }}
      />

      <Divider sx={{ my: 3 }} />

      <TextField
        fullWidth
        label="Citizen Name"
        name="citizenName"
        value={formData.citizenName}
        onChange={handleInputChange}
        error={!!errors.citizenName}
        helperText={errors.citizenName}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Phone Number"
        name="citizenPhone"
        value={formData.citizenPhone}
        onChange={handleInputChange}
        error={!!errors.citizenPhone}
        helperText={errors.citizenPhone}
        sx={{ mb: 2 }}
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={formData.showCitizenInfoToAdmin}
            name="showCitizenInfoToAdmin"
            onChange={handleInputChange}
          />
        }
        label="Show Citizen Info to Admin"
        sx={{ mb: 3 }}
      />

      <Box sx={{ display: "flex", gap: 2 }}>
        <Button
          variant="contained"
          fullWidth
          disabled={loading}
          sx={{ bgcolor: primaryBlue }}
          onClick={handleSubmit}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : "Submit Grievance"}
        </Button>

        <Button
          variant="outlined"
          fullWidth
          color="error"
          onClick={handleCancel}
          disabled={loading}
        >
          Cancel
        </Button>
      </Box>
    </Paper>
  );
};

export default SubmitGrievance;
