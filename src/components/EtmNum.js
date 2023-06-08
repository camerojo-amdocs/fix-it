import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

const EtmNum = (props) => {
  const [number, setNumber] = useState("");


  const handleChange = (e) => {

    let temp = e.target.value;
    console.log(e.target.value);
    console.log(temp);
    if(temp==='')
    {
        setNumber('');
    }
    else
    {
        let str = "";
        for(let i=0; i<temp.length; i++)
        {
           console.log(str)
          // console.log(temp[i])

            switch(temp[i]){
                 case '0':
                 case '1':
                 case '2':
                 case '3':
                 case '4':
                 case '5':
                 case '6':
                 case '7':
                 case '8':
                 case '9':str=str.concat(temp[i]); break;
                 case ' ':if(str.substring(str.length-1,str.length ) === ","){str=str.concat(temp[i]);break;  }
                            else if(str.substring(str.length-1,str.length )===" "||str.length===0){break;}
                            else{str=str.concat(", "); break; }
                 case ',':if(str.substring(str.length-1,str.length ) !== " " && str.substring(i-1, i) !== "," && str.length!==0){str=str.concat(temp[i]);break; }
                            else if(str.substring(str.length-1,str.length ) !== ","&& str.length!==0){
                                    if(str.substring(str.length-2,str.length-1 )===","){break}
                                    else{str=str.substring(0, i-1); str=str.concat(temp[i]); break;} }
                            else{break;}
                 default : break;
                }
        }
        setNumber(str);
    }


  };

  props.parentCallback(number);

  return (
    <Box
      component="form"
      sx={{
        "& > :not(style)": { m: 1, width: "25ch" },
      }}
      noValidate
      autoComplete="off"
      onSubmit={e =>  e.preventDefault() }
    >
      <TextField
        id="outlined-basic"
        label="ETM Numbers"
        variant="outlined"
        onSubmit={e =>  e.preventDefault() }
        helperText="Type in list of ETMs separated by comma (,) "
        disabled={props.tableOptionChosen}
        onChange={handleChange}
        value={number}
      />
      {/* <FormHelperText id="component-helper-text">
        Some important helper text
      </FormHelperText> */}
    </Box>
  );
};

export default EtmNum;
