import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

const Description = () => {
  return (
    <div>
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <Typography variant="body2">
            This app automates the deployment of ETM data into Testing
            environment.
            <br />
            <br />
            User needs to select ETM environment, and provide either the EtM
            numbers or list of tables.
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};

export default Description;
