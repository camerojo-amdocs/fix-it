import React, { useState } from "react";
import Button from "@mui/material/Button";
import { getETMsByDate } from "../services/UserService";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import ProgressBarComp from "./ProgressBar";

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

// let etmsArray = [
//   { etmNumber: "123", etmDescription: "exampleDesc1" },
//   { etmNumber: "456", etmDescription: "exampleDesc2" },
//   { etmNumber: "789", etmDescription: "exampleDesc3" },
// ];

let etmsArray = [];

const GetETMButton = (props) => {
  const [etmsByDate, setEtmsByDate] = useState("");
  const [selectedEtmByDate, setSelectedEtmByDate] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [selectedEtmLists, setSelectedEtmLists] = useState("");
  const [okay, setOkay] = useState(false);
  const [hasEtms, setHasEtm]= useState(true);
  const [progressBarEnable, setProgressBarEnable] = useState(false);
  const [isCheckAll, setIsCheckAll] = useState(false);
  const handleCallbackProgressBar = (childData) => {
      setProgressBarEnable(childData);
    };
  const [checkedState, setCheckedState]= useState([]);
  const [eventFlag, setEventFlag]= useState(false);
  let dates = props.dates;
  let startDate,
    endDate = "";


  if (dates !== "" && dates != null) {
    startDate = dates[0].startDate.toISOString().substring(0, 10);
    endDate = dates[0].endDate.toISOString().substring(0, 10);
  }
  let environment = props.environment;


   const handleChange2 = (event) => {

      if(event.target.value.indexOf("Select All")===-1)
      {


        const {
              target: { value },
            } = event;

          setSelectedEtmByDate(
             //On autofill we get a stringified value.
            typeof value === "string" ? value.split(",") : value
          );

              setSelectedEtmLists(value.reduce((prev, current) => prev + "," + current));
      }
      else if(!isCheckAll)
      {

          const temp = new Array(etmsArray.length);
          etmsArray.map((etm,index) =>
                            temp[index]=etm.etmNumber
                          );
          setSelectedEtmByDate(temp);
      }
      //this.forceUpdate();
    };

  const handleClickOpen = () => {
    setSelectedEtmByDate([]);
    setOpen(true);
    setProgressBarEnable(true);
    getETMsByDate(environment, startDate, endDate).then((response) => {
      setProgressBarEnable(false);
      setEtmsByDate(response.etmsArray);

      if(response.etmsArray[0].etmNumber !== "No ETMs found.")
      {

            setHasEtm(true);

            setCheckedState(new Array(response.etmsArray.length).fill(false));
            setIsCheckAll(false);
         //   this.forceUpdate();
      }
      else
      {
            setHasEtm(false);
      }

    });
    //this.forceUpdate();

  };

  etmsArray = [...etmsByDate];

  const handleCloseCancel = (event, reason) => {
    if (reason !== "backdropClick") {
      setOpen(false);
    }
  };

  const handleCloseOk = (event, reason) => {
    if (reason !== "backdropClick") {
      setOpen(false);
    }
    setOkay(true);
  };

  const handleSelectAll = (event) =>{


       if(!eventFlag)
       {

            setIsCheckAll(!isCheckAll);

            if(!isCheckAll )
            {
                setCheckedState(new Array(etmsByDate.length).fill(true));
                var count=0;
                var temp="";
                while(count<etmsArray.length)
                {

                    if(count+1<etmsArray.length)
                    {
                        temp =temp.concat(etmsArray[count].etmNumber+", ");
                    }
                    else
                    {
                       temp= temp.concat(etmsArray[count].etmNumber);
                    }

                    count++;
                }
                setSelectedEtmLists(temp);


            }
            else if(isCheckAll)
            {
               setCheckedState(new Array(etmsByDate.length).fill(false));
                setSelectedEtmLists("");
                setSelectedEtmByDate(new Array());

            }
       }

       else
       {

            setEventFlag(false);
       }

  }
  const handleOnSelect = (position) => {

      const updatedCheckedState = checkedState.map((item, index) =>
        index === position ? !item : item
      );
       if(isCheckAll)
       {

            setEventFlag(true);
            setIsCheckAll(false);

       }
       else{

           let count =0;
           let flag=true;

           while(count<checkedState.length)
           {


                if(checkedState[count]===false)
                {
                    if(count !== position)
                    flag=false;

                }
                count++;
           }
           if(flag)
           {
               setEventFlag(true);
               setIsCheckAll(true);
           }
       }
       setCheckedState(updatedCheckedState);
       setEventFlag(false);

  }

  props.parentCallback(selectedEtmLists, okay);

  // setSelectedEtmByDate([]);

  return (
    <div>
      <Button color="primary" variant="contained" onClick={handleClickOpen}>
        Get ETMs
      </Button>

      <Dialog disableEscapeKeyDown open={open} onClose={handleCloseCancel} position={"X:160, Y:240"}>
       <div>
            <DialogTitle>ETMs list &emsp;
                <div id="Progress" >
                    <ProgressBarComp
                        progressBarStatus={progressBarEnable}
                        parentCallback={handleCallbackProgressBar}
                    />
                </div>
             </DialogTitle>
           </div>
        <DialogContent >
          <p>{etmsArray.etmNumber}</p>
          <Box component="form" sx={{ display: "flex", flexWrap: "wrap" }}>
            <FormControl sx={{ m: 1, minWidth: 500 }}>
              <InputLabel id="demo-multiple-checkbox-label">ETMs</InputLabel>
              <Select
                menuPlacement="auto"
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                value={selectedEtmByDate}
                onChange={handleChange2}
                input={<OutlinedInput label="Tables List" />}
                multiple
                renderValue={(selected) => selected.join(",")}
                 MenuProps={{
                            position: "absolute",
                            anchorOrigin: {
                              vertical: "bottom",
                              horizontal: "center",
                            },
                            targetOrigin: {"horizontal":"left","vertical":"top"},
                            style: {
                                  maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                                  width: 200
                                },
                            getContentAnchorEl: null
                          }}
              >

                 {hasEtms  &&<MenuItem key="Select All" value="Select All"
                                         disabled={!hasEtms} id="Select All"
                                         hide={!hasEtms} onClick={()=>  {document.getElementById("SelectAll").click();} }>
                      <Checkbox disabled={!hasEtms} id="SelectAll"
                            checked={isCheckAll} onChange={(e)=> handleSelectAll(e)}

                          />
                          <ListItemText
                            primary="Select All"
                          />
                        </MenuItem>}
                {etmsArray.map((etm,index) => (

                   <MenuItem key={etm.etmDescription} value={etm.etmNumber}
                         disabled={!hasEtms} id={etm.etmDescription} onClick={()=>  {document.getElementById("check_"+etm.etmNumber).click();} }   >
                     <Checkbox disabled={!hasEtms} id={"check_"+etm.etmNumber}
                       checked={checkedState[index]} onChange={() => handleOnSelect(index)}
                     />

                     <ListItemText
                       primary={etm.etmNumber + " - " + etm.etmDescription}
                     />
                   </MenuItem>

             )) }

              </Select>
            </FormControl>

          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCancel}>Cancel</Button>
          <Button onClick={handleCloseOk}>Ok</Button>
        </DialogActions>
      </Dialog>
    </div>

  );
};

export default GetETMButton;
