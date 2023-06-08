import React from "react";
import Button from "@mui/material/Button";

const GetTablesButton = (props) => {
  return (
    <div>
      <Button color="primary" variant="contained" style={{width:'max-content'}} disabled={props.disableButton}>
        Validate ETMs
      </Button>
     
    </div>
  );
};

export default GetTablesButton;