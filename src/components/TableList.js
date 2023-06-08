import React, { useState, useEffect } from "react";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import Checkbox from "@mui/material/Checkbox";
import FormHelperText from "@mui/material/FormHelperText";
import Stack from "@mui/material/Stack";
import { getTables } from "../services/UserService";
import { Autocomplete, TextField } from "@mui/material";
import Button from "@mui/material/Button";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};


let tableArray = [];
let selectAll= false;

const TableList = (props) => {
  const [tableListApi, setTableListApi] = useState([]);
  const [indTableName, setIndTableName] = useState([]);
  const [selectedList, setSelectedList] = useState([]);
  const [newItem, setNewItem] = useState(false);
  const [open, setOpen]=useState(false);
  const [env, setEnv]=useState("");

//  useEffect(() => {
//    let mounted = true;
//
//      if (mounted) {
//          getTables(props.envNum).then((items) => {
//            setTableListApi(items);
//          });
//      }
//
//    setSelectedList(new Array(tableListApi.length).fill(false));
//    return () => (mounted = false);
//  }, []);
useEffect(() =>{
    let mounted = true;

    if (mounted) {
        if(props.envNum !== "")
        setEnv(props.envNum);
    }

  return () => (mounted = false);
},[props.envNum])

   useEffect(() => {
      let mounted = true;

        if (mounted) {
            if(props.envNum !== "")
            getTables(env).then((items) => {
              setTableListApi(items);
            });
        }

      setSelectedList(new Array(tableListApi.length).fill(false));
      return () => (mounted = false);
    }, [env]);


  if (tableArray <= 0 || tableArray === undefined) {
    tableArray = tableListApi.tableList;
  }

  const handleChange = (event, value) => {
    console.log(value);
    selectAll = false;
    if(value!== "" || value !== null || value!== undefined) {
      formatTables(value);
      setNewItem(true);
    }
    
  }

  const handleSelectAll= (e) =>{
        selectAll = true;
        formatTables(tableArray);

        setNewItem(true);
  }

  function formatTables (list) {
    let tableNames = "";
    if(list !== "" || list !== null){

        for(var i=0; i<list.length; i++)
        {
            if(selectAll===true && i === 0)
            {
                console.log("select all")
                tableNames = "Select All, " + list[i].tableName;
            }
            else if(i === 0)
            {

                tableNames= list[i].tableName;
            }
            else
            {
                tableNames = tableNames + ", "  + list[i].tableName ;
            }

        }
    }
    setIndTableName(tableNames);
  }
  
  props.parentCallback(String(indTableName));
  if (tableListApi.length <= 0) {
    return (
      <div>
        <FormControl sx={{ m: 1, width: 300 }}>
          
          <Autocomplete
            options={tableArray}
            getOptionLabel={(option) => option.tableName}
            //id="checkboxes-tags-demo"
            disabled
            sx={{ width: 400 }}
            renderInput={(params) => <TextField {...params} label="Loading Tables..." />}
          />
       
          <FormHelperText>Choose tables from dropdown</FormHelperText>
        </FormControl>
      </div>
    );
  
  } else {
    return (
      <div>
        <Stack spacing={6} direction="row">
          <FormControl sx={{ m: 1, width: 400 }}>
            
            <Autocomplete
               id="autocomplete"
              disablePortal
              open={open}
              onOpen={()=> setOpen(true)}
              onClose={()=> setOpen(false)}
              multiple
              disableCloseOnSelect
              onChange={handleChange}
              //onClick = {this.props.handler}
              input={<OutlinedInput label="Tables List" />}
              options={tableArray}
              getOptionLabel={(option) => option.tableName}
              sx={{ width: 400 }}
              MenuProps={MenuProps}
              Props
              renderOption={(props, options, { selected }) =>
               ( <li {...props}>
                  <checkbox id={options.tableName}
                    style={{ marginRight: 8 }}
                    selected={selected}
                  />
                  {options.tableName}
                </li>
              )}
              renderInput={(params) => <TextField {...params} label="Table List"/>}
            />
            <FormHelperText>Choose tables from dropdown</FormHelperText>
          </FormControl>
            <Button color="primary" variant="contained"
            style={{width: "125px", height: "50px",marginTop: "10px", marginLeft: "10px"}}
            onClick={handleSelectAll}>Full Extract</Button>
        </Stack>

       </div>
    );
  }   

};

export default TableList;
