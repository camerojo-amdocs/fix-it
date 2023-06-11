import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

export default function ButtonAppBar() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("name");
  const logout = () => {

        localStorage.setItem("token", "");
        navigate("/");
  };

//<img src={logo} width="150" height="30"/>
  return (

    <Box sx={{ flexGrow: 1 }} >
      <AppBar position="fixed" style={{ backgroundColor:"#FCAB1C", background: "linear-gradient(90deg, #FCAB1C, #EC008C)"}}>

        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Welcome {userName} to the ETM Deployer
          </Typography>
          {/* <Link to="/" onClick={logout}>
            Log-Out
          </Link> */}
          <Button color="primary" variant="contained" onClick={(e)=>{window.alert("Email us at:\nattconsumerbvdevsite@int.amdocs.com"); }}>
              Contact Us
          </Button>
          <Button color="primary" variant="contained" onClick={logout}>
              Log-Out
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
