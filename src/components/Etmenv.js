import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import FormHelperText from "@mui/material/FormHelperText";
import { getEtmEnvs } from "../services/UserService";

let envArrayApi = [];
let hasLoaded =true;
const Etmenv = (props) => {
  const [envsApi, setEnvsApi] = useState([]);
  const [envInput, setEnvInput] = useState();


  useEffect(() => {
    let mounted = true;

      if (mounted) {
        getEtmEnvs().then((items) => {
            setEnvsApi(items);
        });
      }

    return () => (mounted = false);
  }, []);

  if (envArrayApi <= 0 || envArrayApi === undefined) {
    envArrayApi = envsApi.envList;
  }

  const handleChange = (e) => {
   //this.setState({value:e.target.value}, () => {});
    hasLoaded=false;
    setEnvsApi(e.target.value);
    setEnvInput(e.target.value);

  };

  props.parentCallback(envInput);

  if (envsApi.length <= 0) {
    return (
      <div>
        {/* <h1>Loading...</h1> */}
        <Box sx={{ minWidth: 200 }}>
          <FormControl>
            <InputLabel id="demo-simple-select-autowidth-label">
              Loading...
            </InputLabel>
            <Select
              labelId="demo-simple-select-autowidth-label"
              id="demo-simple-select-autowidth"
              value={envsApi}
              label="Loading Environments..."
              onChange={handleChange}
              defaultValue={envsApi}
            ></Select>

            <FormHelperText>Select ETM Environment / Source</FormHelperText>
          </FormControl>
        </Box>
      </div>
    );
  } else {
    let Startingvalue;
        if(hasLoaded)
        {

            Startingvalue= envArrayApi[0].environmentName;
            props.parentCallback(envArrayApi[0].environmentName);
        }
        else
        {
            Startingvalue = envsApi;
            props.parentCallback(envsApi);
        }

    return (
      <div>
        <Box sx={{ minWidth: 200 }}>
          <FormControl>
            <InputLabel id="demo-simple-select-autowidth-label">
              Environment Name
            </InputLabel>

            <Select

              id="demo-simple-select-autowidth"
              defaultValue={Startingvalue}
             // value={}
              key={envsApi}
              label="Environment Name"
              onChange={handleChange}
              disabled={props.tableOptionChosen}
              placeholder={envArrayApi[0].environmentName}
              MenuProps={{ style: { maxWidth: 0, maxHeight: 300, position: 'absolute', }, disableScrollLock: true, }}
              //options={envArrayApi}
              //style={{position: "static"}}
            >
             {envArrayApi.map((env) => (
              <MenuItem key={env.environmentName} value={env.environmentName}disableScrollLock={true} selected  >
                 {env.environmentName}
                </MenuItem>
              ))}
            </Select>

            <FormHelperText>Select ETM Environment / Source</FormHelperText>
            {/* <Button onClick={handleSubmit}>Click me</Button> */}
          </FormControl>
        </Box>
      </div>
    );
    // document.getElementById('demo-simple-select-autowidth').value = envArrayApi[0].environmentName;
  }

};

export default Etmenv;
