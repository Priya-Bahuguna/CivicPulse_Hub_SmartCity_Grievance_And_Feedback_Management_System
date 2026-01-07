import api from "./axios";

export const getOfficerProfile = () =>
  api.get("/api/officer/profile");

export const updateOfficerProfile = (profileData) =>
  api.put("/api/officer/profile", profileData);

export const getOfficerFeedback = () =>
  api.get("/api/officer/feedback/my");
