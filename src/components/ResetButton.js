import React from "react";
// import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

const ResetButton = () => {
  return (
    <div>
      {/* <Stack spacing={6} direction="row"> */}
      <Button color="primary" variant="contained">
        Refresh
      </Button>
      {/* <Button color="primary" variant="contained">
        Submit
      </Button> */}
      {/* </Stack> */}
    </div>
  );
};

export default ResetButton;
