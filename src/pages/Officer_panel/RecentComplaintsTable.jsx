import React, { useState } from "react";
import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Chip,
  Box,
  Modal,
} from "@mui/material";
import { statusColor, priorityColor } from "./helpers";

const RecentComplaintsTable = ({ complaints }) => {
  const [previewImage, setPreviewImage] = useState(null);

  const handleImageClick = (url) => setPreviewImage(url);
  const handleClose = () => setPreviewImage(null);

  return (
    <>
      {/* TABLE */}
      <Paper sx={{ mt: 1, p: 2 }}>
        <Typography variant="h6" mb={2}>
          Recent Complaints
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Resolution Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {complaints.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No complaints yet
                </TableCell>
              </TableRow>
            ) : (
              complaints.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>{c.id}</TableCell>
                  <TableCell>{c.title}</TableCell>
                  <TableCell>{c.category}</TableCell>
                  <TableCell>
                    <Chip label={c.status} color={statusColor(c.status)} />
                  </TableCell>
                  <TableCell>
                    <Chip label={c.priority} color={priorityColor(c.priority)} />
                  </TableCell>
                  <TableCell>
                    <img
                      src={
                        c.imageUrl
                          ? `http://localhost:8081${c.imageUrl}`
                          : "https://via.placeholder.com/50"
                      }
                      alt={c.title}
                      style={{
                        width: 50,
                        height: 50,
                        objectFit: "cover",
                        borderRadius: 4,
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        c.imageUrl &&
                        handleImageClick(`http://localhost:8081${c.imageUrl}`)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    {c.resolutionDate
                    ? new Date(c.resolutionDate).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })
                    : "-"}
                    </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>

      {/* IMAGE PREVIEW MODAL */}
      <Modal
        open={!!previewImage}
        onClose={handleClose}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center", p: 2 }}
      >
        <Box
          component="img"
          src={previewImage}
          alt="Preview"
          sx={{ maxHeight: "70%", maxWidth: "70%", borderRadius: 2, boxShadow: 12 }}
        />
      </Modal>
    </>
  );
};

export default RecentComplaintsTable;
