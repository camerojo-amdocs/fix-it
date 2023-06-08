import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import {getDeploymentStats} from "../services/UserService";
import ProgressBarComp from "./ProgressBar";
import Collapsible from './Filter';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import OutlinedInput from "@mui/material/OutlinedInput";
import { Autocomplete, TextField } from "@mui/material";
import Box from "@mui/material/Box";

let statArray = [];
let loaded =false;
const DeploymentStat = (props) => {
    const [open, setOpen] = useState(false);
    const [deployStatList, setDeployStatList] = useState("");
    const [progressBarEnable, setProgressBarEnable] = useState(false);
    const [filename, setFilename]=useState();
    const [activeButton, setActiveButton]=useState();
    const [alert, setAlert]=useState(false);
    const [alertMessage, setAlertMessage]=useState("");
    const [filtered, setFiltered]=useState([]);
    const [userFil, setUserFil] = useState();
    const [userIdFil, setUserIdFil]= useState(null);
    const typeFil=(["Extract", "Release"]);
    const [selectedType, setSelectedType] = useState(null);
    const statusFil = (["Success", "Failed", "In Progress"]);
    const [selectedStat, setSelectedStat] = useState(null);
    const [numberFil, setNumberFil] = useState();
    const [selectedNumber, setSelectedNumber]= useState(null);
    const [selectedTable, setSelectedTable]=useState(null);
    const timeFil = (["Today", "Yesterday","This Week", "Last Week", "Last 30 Days", "Over 30 Days Ago"]);
    const [selectedTime, setSelectedTime] = useState(null);
    const [filterActive, setFilterActive]=useState(false);
    const handleCallbackProgressBar = (childData) => {
      setProgressBarEnable(childData);
    };

    const handleClickOpen = () => {
        setOpen(true);
        showStats();

    }

    const handleAlertClose = () =>{
        setAlert(false);
    }

    const handleAlertOpen = () =>{
        setAlert(true);
    }

    const alertCopy = () =>{
         let temp = document.getElementById('fileAlertMessages')
         temp.focus();
         temp.select()
         document.execCommand('copy')
    }

    const handleClose = () => {
       setUserIdFil(null)
       setSelectedTime(null)
       setSelectedTable(null)
       setSelectedNumber(null)
       setSelectedStat(null)
       setSelectedType(null)
       loaded=false;
       setOpen(false);
    }

    const handleRefresh = () =>{
        showStats();
    }

    //Display files when the file button is clicked
    const file = (index) => {
        if(activeButton[index])
        {
            let x = filename[index].split(", ");
            let out ="";
            for(let i =0; i<x.length; i++ )
            {
                out=out.concat(x[i]);
                if(i+1<x.length)
                {out=out.concat("\n")}
            }
            setAlertMessage(out);
        }
    }

    //This sets the choices for the different drop downs
    const setFilters = (list) =>{
        let id = ""
        let number=""
        for(let x = 0; x <list.length; x++)
        {
            if(id.indexOf(list[x].userId) < 0)
            {
               id = id.concat(list[x].userId + ", ");
            }

            let spl = list[x].etmNumber.split(", ");
            for(let y=0; y<spl.length; y++){
                if(number.indexOf(spl[y]) < 0)
                {
                   number = number.concat(spl[y] + ", ");
                }
            }
        }
        id= id.substr(0,id.length-2)
        number = number.substr(0,number.length-2)
        setUserFil(id.split(", "));
        setNumberFil(number.split(", "));
    }

    //Date Filter Event
    const handleDate =(e, value)=>{
          handleFilters(userIdFil, value, selectedTable, selectedNumber,selectedStat, selectedType);
          setSelectedTime(value);
    }

    //UserId Filter Event
    const handleId =(e,value) =>{
         handleFilters(value, selectedTime, selectedTable, selectedNumber,selectedStat, selectedType);
         setUserIdFil(value);
    }

    //Table Filter Event
    const handleTable =(e,value)=>{
         handleFilters(userIdFil, selectedTime, e.target.value, selectedNumber,selectedStat, selectedType);
         setSelectedTable(e.target.value);
    }

    //Number Filter Event
    const handleNumber = (e,value) => {
         handleFilters(userIdFil, selectedTime, selectedTable, value,selectedStat, selectedType);
         setSelectedNumber(value);
    }

    //Status Filter Event
    const handleStat =(e,value) => {
             handleFilters(userIdFil, selectedTime, selectedTable, selectedNumber,value, selectedType);
             setSelectedStat(value);
    }

    //Type Filter Event
    const handleType =(e,value) =>{
          handleFilters(userIdFil, selectedTime, selectedTable, selectedNumber,selectedStat, value);
          setSelectedType(value);
    }

    //apply selected filters to group
    const handleFilters =(user, time, table, number, stat, type) =>{
        let count =0;
        let tempList = new Array(statArray.length);
        if(user!==null || time!==null || table!==null || number!==null || stat!==null || type!==null)
        {
            let fil = statArray;
            for(let x =0; x<fil.length; x++)
            {
                if((user === fil[x].userId || user === null) && (stat === fil[x].status || stat === null)
                && (type === fil[x].type || type === null) && (timestampCheck(fil[x].timestamp, time) || time === null))
                {
                    let spl = fil[x].etmNumber.split(", ");
                    let notValid =true;
                    if(number!==null)
                    {
                        for(let y=0; y< spl.length && notValid; y++){
                            if(spl[y].trim()===number.trim())
                            {
                                notValid=false;
                            }
                        }
                    }
                    else
                    {
                        notValid = false;
                    }
                    if(notValid === false && table !== null)
                    {
                        notValid=true;
                        if(fil[x].tableList.indexOf(table.toUpperCase())>=0)
                        {
                         notValid=false
                         tempList[count]=fil[x];
                         count++;
                        }
                    }
                    else if(table === null && notValid === false)
                    {
                        tempList[count]=fil[x];
                        count++;
                    }
                }
            }
            let newFilter = new Array(count);
            for(let i =0; i<count; i++)
            {
                newFilter[i]=tempList[i];
            }
            setFiltered(newFilter);
            showFiles(newFilter);
        }
        else
        {
            setFiltered(statArray);
            showFiles(statArray);
        }
    }

    //Handle the selection of date for time management
    const timestampCheck =(time, frame) => {
        let notValid =false;
        let cur = new Date();
        let x = new Date(time.substr(0,10))
        if(frame==="Today" && x === cur)
        {
            notValid = true;
        }
        else if(frame === "Yesterday")
        {
            let temp =new Date();
            temp.setDate(cur.getDate()-1)
            if(x===temp)
                notValid = true;
        }
        else if(frame === "This Week")
        {
            let temp =new Date();
            temp.setDate(cur.getDate()-7)
            if(x>=temp &&x<=cur)
                notValid = true;
        }
        else if(frame === "Last Week" )
        {
            let temp =new Date();
            temp.setDate(cur.getDate()-14)
            let end =new Date();
            end.setDate(cur.getDate()-7)
            if(x>=temp && x<=end)
                notValid = true;

        }
        else if(frame==="Last 30 Days" )
        {
            let temp =new Date();
            temp.setDate(cur.getDate()-30)
            if(x>=temp &&x<=cur)
                notValid = true;
        }
        else if(frame ==="Over 30 Days Ago")
        {
            let temp =new Date();
            temp.setDate(cur.getDate()-30)
            if(x<temp)
                notValid = true;
        }

        return notValid;
    }

    //Enable button for file selection
    const showFiles = (list) =>{
        let temp = new Array(list.length).fill("");
        let active = new Array(list.length).fill(false);
        for(let i=0; i<temp.length; i++)
        {
            if(list[i].type==="Extract"){
                temp[i]=list[i].remote_filename;
                active[i]=true;
            }
        }
        setFilename(temp);
        setActiveButton(active);
    }

    //Load the rows from backend
    const showStats = () => {
        setFilterActive(false);
        setProgressBarEnable(true);
        getDeploymentStats().then((response) => {
            setDeployStatList(response.deployStat)
            showFiles(response.deployStat)
            setFiltered(response.deployStat);
            setFilters(response.deployStat);
            handleFilters(userIdFil, selectedTime, selectedTable, selectedNumber,selectedStat, selectedType);
            setProgressBarEnable(false);
            if(loaded === false)
            {
                loaded = true;

                showStats()
            }
            else{
                setFilterActive(true);
            }
        });
    }

    statArray = [...deployStatList];

  return (
    <div>
      <Button color="primary" variant="contained" onClick={handleClickOpen}>
        Status
      </Button>

      <Dialog open={open} onClose={handleClose} style={{width:'100%'}}  fullWidth
                                                                         maxWidth="xl">
         <Dialog open={alert} onClose={handleAlertClose} style={{width:'100%', marginLeft: '115px', marginTop: '0px'}} >
            <DialogTitle>File Path</DialogTitle>
             <textarea readOnly variant="body2" id="fileAlertMessages" cols="170" rows="10" value={alertMessage}
               style={{border: "none",paddingTop: "10px",fontSize: 15, paddingRight: "5px", paddingLeft: ".5px",outline: "none", resize: "none", fontFamily: "arial", margin: "10px"}} />
            <DialogActions>
                <Button color="primary" variant="contained" align="left" onClick={alertCopy}>Copy</Button>
                <Button color="primary" variant="contained" onClick={handleAlertClose}>Ok</Button>
            </DialogActions>
         </Dialog>
        <DialogTitle>Request status</DialogTitle>
        <div id="Progress" style={{marginLeft: '10px'}}>
            <ProgressBarComp
                progressBarStatus={progressBarEnable}
                parentCallback={handleCallbackProgressBar}
            />
            <Collapsible  label="Filter" disabled={!loaded}>
                <table style={{marginLeft: "11px"}}>
                    <tr>
                        {/*This is the filter for user ID*/}
                        <th>
                            <Autocomplete
                              id="User Filter"
                              disablePortal
                              sx={{ width: 300 , position:"static"}}
                              onChange={handleId}
                              input={<OutlinedInput label="UserID" />}
                              options={userFil}
                              getOptionLabel={(option) => option}
                              renderOption={(props, options, { selected }) =>
                               (<li {...props} value={options}>
                                  {options}
                                </li>
                              )}
                              renderInput={(params) => <TextField {...params} label="User ID"/>}
                            />
                        </th>
                        {/*This is the filter for Date*/}
                        <th>
                            <Autocomplete
                              id="Date Filter"
                              disablePortal
                              sx={{ width: 300, position:"static"}}
                              style={{position: "static"}}
                              onChange={handleDate}
                              input={<OutlinedInput label="Date" />}
                              options={timeFil}
                              getOptionLabel={(option) => option}
                              renderOption={(props, options, { selected }) =>
                               ( <li {...props} value={options}>
                                  {options}
                                </li>
                              )}
                              renderInput={(params) => <TextField {...params} label="Date"/>}
                            />
                        </th>
                        {/*This is the Filter for Table List*/}
                        <th>
                            <Box
                              component="form"
                              sx={{ "& > :not(style)": {marginLeft:"0", width: "32ch" },}}
                              noValidate
                              autoComplete="off"
                              onSubmit={e =>  e.preventDefault() }
                            >
                              <TextField
                                id="outlined-basic"
                                label="Tables"
                                variant="outlined"
                                onSubmit={e =>  e.preventDefault() }
                                onChange={handleTable}
                                value={selectedTable}
                              />
                            </Box>
                        </th>
                    </tr>
                    <tr>
                        {/*This is the Filter for ETM Numbers*/}
                        <th>
                            <Autocomplete
                              id="Number Filter"
                              disablePortal
                              sx={{ width: 300 }}
                              onChange={handleNumber}
                              input={<OutlinedInput label="Number" />}
                              options={numberFil}
                              getOptionLabel={(option) => option}
                              renderOption={(props, options, { selected }) =>
                               ( <li {...props} value={options}>
                                  {options}
                                </li>
                              )}
                              renderInput={(params) => <TextField {...params} label="Number"/>}
                            />
                        </th>
                        {/*This is the Filter for Status*/}
                        <th>
                            <Autocomplete
                              id="Status Filter"
                              disablePortal
                              sx={{ width: 300 }}
                              onChange={handleStat}
                              input={<OutlinedInput label="Status" />}
                              options={statusFil}
                              getOptionLabel={(option) => option}
                              renderOption={(props, options, { selected }) =>
                               ( <li {...props} value={options}>
                                  {options}
                                </li>
                              )}
                              renderInput={(params) => <TextField {...params} label="Status"/>}
                            />
                        </th>
                        {/*This is the Filter for Type*/}
                        <th>
                            <Autocomplete
                              id="Type Filter"
                              disablePortal
                              sx={{ width: 300 }}
                              onChange={handleType}
                              input={<OutlinedInput label="Type" />}
                              options={typeFil}
                              getOptionLabel={(option) => option}
                              renderOption={(props, options, { selected }) =>
                               ( <li {...props} value={options}>
                                  {options}
                                </li>
                              )}
                              renderInput={(params) => <TextField {...params} label="Type"/>}
                            />
                        </th>
                    </tr>
                </table>
            </Collapsible>
        </div>
        <DialogContent >
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 850 }} aria-label="simple table" size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>User ID</TableCell>
                            <TableCell align="left">Timestamp</TableCell>
                            <TableCell align="left">Table List</TableCell>
                            <TableCell align="left">ETM Number(s)</TableCell>
                            <TableCell align="left">Environment Name</TableCell>
                            <TableCell align="left">Status</TableCell>
                            <TableCell align="left">Type</TableCell>
                            <TableCell align="left"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filtered.map((row, index) => (
                            <TableRow sx={{ '&:last-child td, &:last-child th': {border: 0 }}}>
                                <TableCell>{row.userId}</TableCell>
                                <TableCell align="left">{row.timestamp}</TableCell>
                                <TableCell align="left">{row.tableList}</TableCell>
                                <TableCell align="left">{row.etmNumber}</TableCell>
                                <TableCell align="left">{row.environment_version_id}</TableCell>
                                <TableCell align="left">{row.status}</TableCell>
                                <TableCell align="left">{row.type}</TableCell>
                                <TableCell align="left" onClick={(e)=>{e.preventDefault();file(index); setAlert(true)}}>{activeButton[index] ?  <Button disabled={!activeButton[index]} >{activeButton[index]?"File":null}</Button>:null}</TableCell>
                            </TableRow>
                       ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </DialogContent>
        <DialogActions>
            <Button color="primary" variant="contained" align="left" onClick={handleRefresh}>
                REFRESH STATUS
             </Button>
            <Button color="primary" variant="contained" onClick={handleClose}>
                Ok
            </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DeploymentStat;