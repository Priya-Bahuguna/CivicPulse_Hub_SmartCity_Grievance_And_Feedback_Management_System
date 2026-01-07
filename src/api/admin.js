import api from "./axios";

export const fetchAdminComplaints = () =>
  api.get("/api/admin/complaints");

export const getAdminProfile = () =>
  api.get("/api/admin/profile");

export const updateAdminProfile = (profileData) =>
  api.put("/api/admin/profile", profileData);
