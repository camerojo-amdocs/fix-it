import React from "react";
import Button from "@mui/material/Button";

const ReleaseEtmButton = (props) => {
    
  return (
    <div>
      <Button color="primary" variant="contained" style={{width:'max-content'}} disabled={props.disableButton}>
        Release
      </Button>
     
    </div>
  );
};

export default ReleaseEtmButton;