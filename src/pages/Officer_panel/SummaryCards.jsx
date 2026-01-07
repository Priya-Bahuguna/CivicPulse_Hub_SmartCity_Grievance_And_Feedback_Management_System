import React from "react";
import { Grid, Paper, Typography, Box } from "@mui/material";

const SummaryCards = ({ counts }) => {
  return (
    <Grid container spacing={4}>
      {counts.map((card) => (
        <Grid
          item
          xs={12}
          sm={6}
          md={1}      // ⬅ increased width (2 cards per row instead of 4)
          key={card.label}
        >
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 3,
              borderLeft: `6px solid ${card.color}`,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography color="text.secondary" fontWeight={600}>
                {card.label}
              </Typography>

              <Typography variant="h4" fontWeight="bold">
                {card.value}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default SummaryCards;
