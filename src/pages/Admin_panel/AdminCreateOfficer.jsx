import React, { useState } from "react";
import { Snackbar, Alert } from "@mui/material";

const AdminCreateOfficer = () => {
  const [officerData, setOfficerData] = useState({
    name: "",
    email: "",
    password: "",
    phoneNo: "",
    department: "",
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleChange = (e) => {
    setOfficerData({ ...officerData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setSnackbarMsg("You are not logged in as Admin");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }

      const res = await fetch("http://localhost:8081/api/admin/create-officer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(officerData),
      });

      if (!res.ok) {
        let errorMsg;
        const contentType = res.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
          const data = await res.json();
          errorMsg = data.message || JSON.stringify(data);
        } else {
          errorMsg = await res.text();
        }

        throw new Error(errorMsg || "Failed to create officer");
      }

      // Backend returns JSON string message or plain text
      let data;
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = (await res.json()).message || "Officer created successfully! Check email.";
      } else {
        data = await res.text();
      }

      setSnackbarMsg(data);
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      // Clear form
      setOfficerData({
        name: "",
        email: "",
        password: "",
        phoneNo: "",
        department: "",
      });
    } catch (err) {
      console.error(err);
      setSnackbarMsg(err.message || "Admin authorization failed or server error");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">Create Officer</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={officerData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter officer name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={officerData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter email address"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={officerData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter password"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone No</label>
          <input
            type="tel"
            name="phoneNo"
            value={officerData.phoneNo}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter phone number"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
          <input
            type="text"
            name="department"
            value={officerData.department}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter department"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
        >
          Create Officer
        </button>
      </div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity={snackbarSeverity}
          onClose={() => setSnackbarOpen(false)}
          sx={{ width: "100%" }}
        >
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AdminCreateOfficer;
