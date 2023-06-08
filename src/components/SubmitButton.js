import React from "react";
import Button from "@mui/material/Button";

const SubmitButton = (props) => {

  props.parentCallback(props.tableListString);

  return (
    <div>
      <Button color="primary" variant="contained" disabled={props.disableButton}>
        EXTRACT
      </Button>
    </div>
  );
};

export default SubmitButton;
