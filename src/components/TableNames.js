import React from "react";
import Box from "@mui/material/Box";

const TableNames = () => {
  return (
    <Box
      component="form"
      sx={{
        "& > :not(style)": { m: 1, width: "25ch" },
      }}
      noValidate
      autoComplete="off"
      id="outlined-basic"
    >
      {/* <TextField
        id="outlined-basic"
        label="Table Names"
        variant="outlined"
        helperText="Or type the list of tables separated by comma (,) "
      /> */}
      <p> testing</p>
    </Box>
  );
};

export default TableNames;
