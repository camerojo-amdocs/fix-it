import React, { useEffect, useState } from 'react';
import './App.css';
import Etmenv from './components/Etmenv';
import EtmNum from './components/EtmNum';
import TableList from './components/TableList';
import ToggleSwitch from './components/ToggleSwitch';
import FormHelperText from '@mui/material/FormHelperText';
import ResetButton from './components/ResetButton';
import SubmitButton from './components/SubmitButton';
import GetETMButton from './components/GetETMButton';
import GetTablesButton from './components/GetTablesButton';
import ReleaseEtmButton from './components/ReleaseEtmButton';
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import { setEnv, initDeployment, initRelease } from './services/UserService';
import CardContent from '@mui/material/CardContent';
import Card from '@mui/material/Card';
import CalendarComp from './components/DateRangePickerComp.jsx';
import ProgressBarComp from './components/ProgressBar';
import ButtonAppBar from './components/ButtonAppBar';
import DeploymentStat from './components/DeploymentStat';
import { useNavigate } from 'react-router-dom';
import IdleTimeOutHandler from './components/Logout';

const Dashboard = (props) => {
  const [finalEnv, setfinalEnv] = useState('');
  const [finalNumber, setfinalNumber] = useState('');
  const [finalTables, setfinalTables] = useState('');
  const [etmCheckbox, setETMCheck] = useState(true);
  const [dateCheckbox, setDateCheck] = useState(false);
  const [tableCheckbox, setTableCheck] = useState(false);
  const [deployButtonDisable, isDeployButtonDisable] = useState(true);
  const [progressBarEnable, setProgressBarEnable] = useState(false);
  const welcomeMessage =
    'This app automates the deployment of ETM data into Testing environment.\n\nUser needs to select ETM environment, and provide either the ETM numbers or list of tables.';
  const welcomeTableViewMsg = 'This section will show impacted tables';
  const [alert, setAlert] = useState(welcomeMessage);
  const [tableView, setTableView] = useState(welcomeTableViewMsg);
  const [tableFromNumber, setTableFromNumber] = useState('');
  const [selectedFromNumber, setSelectedFromNumber] = useState();
  const [tableFromDate, setTableFromDate] = useState('');
  const [selectedFromDate, setSelectedFromDate] = useState();
  const [dateRange, setDateRange] = useState('');
  const [finalEtmNumber, setfinalEtmNumber] = useState('');
  const [okayPressed, setOkayPressed] = useState('');
  const [releaseEtmButtonDisable, setReleaseEtmButtonDisable] = useState(true);
  const token = localStorage.getItem('token');
  const isAdminUser = localStorage.getItem('adminUser');
  const navigate = useNavigate();
  const [selectedTables, setSelectedTables] = useState('');
  const [hasSelected, setHasSelected] = useState(false);
  let timer;
  const [releaseStarted, setReleaseStarted] = useState(false); //= false;
  const [extractStarted, setExtractStarted] = useState(false);
  const [textColor, setTextColor] = useState();
  const [selected, setSelected] = useState();
  const [disabledGroup, setDisabledGroup] = useState();
  const [extract, setExtract] = useState(true);
  const [statusList, setStatusList] = useState([]);
  const [dateStatusList, setDateStatusList] = useState([]);
  const [disableToggle, setDisablToggle] = useState(false);
  const [activeTableList, setActiveTableList] = useState();
  const [etmFullTableList, setEtmFullTableList] = useState();
  const [dateFullTableList, setDateFullTableList] = useState();
  const [alertColor, setAlertColor] = useState('Black');
  const [tableSelectAll, setTableSelectAll] = useState(false);

  const events = [
    'load',
    'mousemove',
    'mousedown',
    'click',
    'scroll',
    'keypress',
  ];

  const handleCallbackEnv = (childData) => {
    setfinalEnv(childData);
  };
  const handleCallbackNum = (childData) => {
    setfinalNumber(childData);
  };
  const handleCallbackTables = (childData) => {
    setfinalTables(childData);
    if (childData.indexOf('Select All') >= 0) {
      let x = childData.replace('Select All, ', '');
      setSelectedTables(x);
      setTableSelectAll(true);
      setfinalTables(x);
    } else {
      setSelectedTables(childData);
      setTableSelectAll(false);
    }
  };
  const handleCallbackTableList = (childData) => {
    setTableFromNumber(childData);
  };
  const handleCallbackProgressBar = (childData) => {
    setProgressBarEnable(childData);
  };
  const handleCallbackDateRange = (childData) => {
    setDateRange(childData);
  };
  const handleCallbackEtms = (childData, childData2) => {
    setfinalEtmNumber(childData);
    setOkayPressed(childData2);
  };

  useEffect(() => {
    if (okayPressed === true) {
      getETMTables();
    }
  }, [okayPressed]);
  /* const handleCallbackChange = (childData) =>{
     this.setState({name: childData})
   }*/

  //Handle change of the etm number checkbox
  const changeState1 = () => {
    if (etmCheckbox && !dateCheckbox && !tableCheckbox) {
      setETMCheck(false);
    } else if (!etmCheckbox && !dateCheckbox && !tableCheckbox) {
      setETMCheck(true);
      setSelected(selectedFromNumber);
      //checkDisabled(extract,tableFromNumber,statusList);
    } else if (!etmCheckbox && !dateCheckbox && tableCheckbox) {
      setTableCheck(false);
      setETMCheck(true);
      setDisablToggle(false);
      setSelected(selectedFromNumber);
      //checkDisabled(extract,tableFromNumber,statusList);
    } else if (!etmCheckbox && dateCheckbox && !tableCheckbox) {
      setDateCheck(false);
      setETMCheck(true);
      setSelected(selectedFromNumber);
      //checkDisabled(extract,tableFromNumber,statusList);
    }
    setSelectedTables(activeTableList);
    setDefaults();
  };

  //Handle change of the Date checkbox
  const changeState2 = () => {
    if (!etmCheckbox && dateCheckbox && !tableCheckbox) {
      setDateCheck(false);
    } else if (!etmCheckbox && !dateCheckbox && !tableCheckbox) {
      setDateCheck(true);
      setSelected(selectedFromDate);
      //checkDisabled(extract,tableFromDate,dateStatusList);
    } else if (!etmCheckbox && !dateCheckbox && tableCheckbox) {
      setTableCheck(false);
      setDateCheck(true);
      setDisablToggle(false);
      setSelected(selectedFromDate);
      //checkDisabled(extract,tableFromDate,dateStatusList);
    } else if (etmCheckbox && !dateCheckbox && !tableCheckbox) {
      setETMCheck(false);
      setDateCheck(true);
      setSelected(selectedFromDate);
      //checkDisabled(extract,tableFromDate,dateStatusList);
    }
    setSelectedTables(activeTableList);
    setDefaults();
  };

  //handle change of the table Check box
  const changeState3 = () => {
    console.log(finalEnv);
    if (!etmCheckbox && !dateCheckbox && tableCheckbox) {
      setTableCheck(false);
      setDisablToggle(false);
    } else if (!etmCheckbox && !dateCheckbox && !tableCheckbox) {
      setTableCheck(true);
      if (!extract) {
        document.getElementById('Toggle').click();
      }
      setDisablToggle(true);
    } else if (!etmCheckbox && dateCheckbox && !tableCheckbox) {
      setDateCheck(false);
      setTableCheck(true);
      if (!extract) {
        document.getElementById('Toggle').click();
      }
      setDisablToggle(true);
    } else if (etmCheckbox && !dateCheckbox && !tableCheckbox) {
      setETMCheck(false);
      setTableCheck(true);
      if (!extract) {
        document.getElementById('Toggle').click();
      }
      setDisablToggle(true);
    }
    setSelectedTables(activeTableList);
    setDefaults();
  };

  //Sets the values of etms to disabled if they fail validation
  const checkDisabled = (isExtract, stat, view) => {
    //sets for release etms
    if (view !== welcomeTableViewMsg) {
      if (isExtract === false && stat.length !== 0) {
        let tempTableView = '';
        let tempActive = '';
        let tempSelectedArray = new Array(stat.length).fill(true);
        for (let i = 0; i < stat.length; i++) {
          tempTableView = tempTableView.concat(
            stat[i].etmNumber + ' - ' + stat[i].etmDescription + ', '
          );
          if (stat[i].etmStatus !== 'Approved') {
            tempSelectedArray[i] = false;
          } else {
            tempActive = tempActive.concat(
              stat[i].etmNumber + ' - ' + stat[i].etmDescription + ', '
            );
          }
        }
        tempTableView = tempTableView.substr(0, tempTableView.length - 2);
        let m = tempActive.substr(0, tempActive.length - 2);
        setActiveTableList(m);
        setSelectedTables(m);
        if (m === '') {
          setReleaseEtmButtonDisable(true);
        } else if (localStorage.getItem('canRelease') === 'true') {
          setReleaseEtmButtonDisable(false);
          console.log('enable Release button');
        }
        if (etmCheckbox) {
          setTableFromNumber(tempTableView);
          setSelectedFromNumber(tempSelectedArray);
          setSelected(tempSelectedArray);
          setDisabledGroup(tempSelectedArray);
          setTableView(tempTableView);
        } else if (dateCheckbox) {
          setTableFromDate(tempTableView);
          setSelectedFromDate(tempSelectedArray);
          setSelected(tempSelectedArray);
          setDisabledGroup(tempSelectedArray);
          setTableView(tempTableView);
        }
      }
      //sets for extract etms
      else if (isExtract === true && view !== undefined) {
        let tempTableView = '';
        let invalidTable = '';
        let validTable = '';
        let tempSplit = view.split(', ');
        let tempSelectedArray = new Array(stat.length).fill(true);
        let flag = true;
        for (let i = 0; i < tempSplit.length; i++) {
          let tempName = tempSplit[i].split(' - ');
          let tempNums = tempName[1].split(' | ');
          validTable = tempName[0] + ' - ';
          for (let j = 0; j < stat.length; j++) {
            for (let k = 0; k < tempNums.length; k++) {
              if (
                stat[j].etmNumber === tempNums[k] &&
                stat[j].etmTables.indexOf(tempName[0]) >= 0
              ) {
                if (stat[j].etmStatus !== 'Released') {
                  invalidTable = invalidTable.concat(
                    tempName[0] + ' - ' + tempNums[k] + ', '
                  );
                  tempSelectedArray[i] = false;
                } else {
                  flag = false;
                  validTable = validTable.concat(tempNums[k] + ' | ');
                }
              }
            }
          }
          if (flag === false) {
            flag = true;
            validTable = validTable.substr(0, validTable.length - 2);
            tempTableView = tempTableView.concat(validTable + ', ');
          }
        }
        let tempDis = new Array(
          tempTableView.split(', ').length + invalidTable.split(', ').length
        ).fill(true);
        let m = tempTableView.substr(0, tempTableView.length - 2);
        setActiveTableList(m);
        setSelectedTables(m);
        if (m === '') {
          isDeployButtonDisable(true);
        } else {
          if (localStorage.getItem('canExtract') === 'true') {
            isDeployButtonDisable(false);
            console.log('enable extract button');
          }
        }
        for (
          let x = tempTableView.split(', ').length - 1;
          x < tempDis.length;
          x++
        ) {
          tempDis[x] = false;
        }

        tempTableView = tempTableView.concat(invalidTable);
        tempTableView = tempTableView.substr(0, tempTableView.length - 2);

        if (etmCheckbox) {
          setTableFromNumber(tempTableView);
          setSelectedFromNumber(tempDis);
          setSelected(tempDis);
          setDisabledGroup(tempDis);
          setTableView(tempTableView);
        } else if (dateCheckbox) {
          setTableFromDate(tempTableView);
          setSelectedFromDate(tempDis);
          setSelected(tempDis);
          setDisabledGroup(tempDis);
          setTableView(tempTableView);
        }
      } else {
        setDefaults();
      }
    }
  };

  //Handle click of toggle switch to change
  const handleToggle = () => {
    if (deployButtonDisable === false || releaseEtmButtonDisable === false) {
      if (
        (deployButtonDisable === false &&
          localStorage.getItem('canRelease') === 'true') ||
        (releaseEtmButtonDisable === false &&
          localStorage.getItem('canExtract') === 'true')
      ) {
        setReleaseEtmButtonDisable(!releaseEtmButtonDisable);
        isDeployButtonDisable(!deployButtonDisable);
      } else {
        setReleaseEtmButtonDisable(true);
        isDeployButtonDisable(true);
      }
    }

    if (etmCheckbox) {
      checkDisabled(!extract, statusList, etmFullTableList);
    } else if (dateCheckbox) {
      checkDisabled(!extract, dateStatusList, dateFullTableList);
    }
    setExtract(!extract);
  };

  // this function sets the timer that logs out the user after 10 secs
  const handleLogoutTimer = () => {
    timer = setTimeout(() => {
      // clears any pending timer.
      resetTimer();
      // Listener clean up. Removes the existing event listener from the window
      Object.values(events).forEach((item) => {
        window.removeEventListener(item, resetTimer);
      });
      // logs out user
      logoutAction();
    }, 900000); // 10000ms = 10secs. You can change the time.
  };

  // this resets the timer if it exists.
  const resetTimer = () => {
    if (timer) clearTimeout(timer);
  };

  //set default values for changes that are made
  const setDefaults = () => {
    isDeployButtonDisable(true);
    setReleaseEtmButtonDisable(true);
    setAlert(welcomeMessage);
    setTableView(welcomeTableViewMsg);
    setHasSelected(false);
  };

  //Reloads page when refresh is clicked
  const resetFields = () => {
    window.location.reload(false);
  };

  useEffect(() => {
    if (token === '') {
      navigate('/');
    }
  }, [token]);

  //Load Page and check to see if there is a token
  useEffect(() => {
    if (token === '' || token == null) {
      navigate('/');
    } else if (token === 'Expired') {
      window.alert('Your session has expired!');
      localStorage.setItem('token', '');
      navigate('/');
    }

    showTables();

    Object.values(events).forEach((item) => {
      window.addEventListener(item, () => {
        resetTimer();
        handleLogoutTimer();
      });
    });

    if (isAdminUser === 'Y') {
      if (extract) {
        if (localStorage.getItem('canExtract') === 'true') {
          isDeployButtonDisable(false);
          console.log('enable extract button');
        }
      } else if (localStorage.getItem('canRelease') === 'true') {
        setReleaseEtmButtonDisable(false);
        console.log('enable Release button');
      }
    }
  });

  // logs out user by clearing out auth token in localStorage and redirecting url to /signin page.
  const logoutAction = () => {
    navigate('/');
  };

  //Format tables for impacted tables
  const showTables = () => {
    if (
      (tableFromNumber === '' || tableFromNumber === null) &&
      (tableFromDate === '' || tableFromDate === null) &&
      (finalTables === '' || finalTables === null)
    ) {
      setTableView(welcomeTableViewMsg);
    } else {
      if (etmCheckbox) {
        setTableView(tableFromNumber);
        //setSelected(selectedFromNumber);
        setDisabledGroup(selectedFromNumber);
        if (!hasSelected) {
          setSelectedTables(activeTableList);
        }
        if (tableFromNumber === '' || tableFromNumber === null) {
          if (selectedTables === '') {
            setReleaseEtmButtonDisable(true);
            isDeployButtonDisable(true);
          }
          setTableView(welcomeTableViewMsg);
        } else {
          if (selectedTables !== '') {
            if (extract) {
              if (
                localStorage.getItem('canExtract') === 'true' &&
                !extractStarted
              ) {
                isDeployButtonDisable(false);
                console.log('enable extract button');
              }
            } else if (
              localStorage.getItem('canRelease') === 'true' &&
              !releaseStarted
            ) {
              setReleaseEtmButtonDisable(false);
              console.log('enable Release button');
            }
          }
        }
      } else if (dateCheckbox) {
        setTableView(tableFromDate);
        //setSelected(selectedFromDate);
        setDisabledGroup(selectedFromDate);
        if (!hasSelected) {
          setSelectedTables(activeTableList);
        }
        if (tableFromDate === '' || tableFromDate === null) {
          if (selectedTables === '') {
            setReleaseEtmButtonDisable(true);
            isDeployButtonDisable(true);
          }
          setTableView(welcomeTableViewMsg);
        } else {
          if (selectedTables !== '') {
            if (extract) {
              if (localStorage.getItem('canExtract') === 'true') {
                isDeployButtonDisable(false);
                console.log('enable extract button');
              }
            } else if (localStorage.getItem('canRelease') === 'true') {
              setReleaseEtmButtonDisable(false);
              console.log('enable Release button');
            }
          }
        }
      } else if (tableCheckbox) {
        let old = tableView.split(', ');
        let x = tableView;
        setTableView(finalTables);

        if (!hasSelected) {
          setSelectedTables(tableView);
        }
        if (finalTables === '' || finalTables === null) {
          setTableView(welcomeTableViewMsg);
          isDeployButtonDisable(true);
          setReleaseEtmButtonDisable(true);
        } else {
          if (finalTables !== x) {
            let temp = new Array(finalTables.split(', ').length).fill(true);
            let list = finalTables.split(', ');
            if (selected !== undefined) {
              for (let i = 0; i < list.length; i++) {
                for (let j = 0; j < old.length; j++) {
                  if (list[i] === old[j] && selected[j] === false) {
                    temp[i] = false;
                  }
                }
              }
            }
            setSelected(temp);
          }
          if (extract) {
            if (
              localStorage.getItem('canExtract') === 'true' &&
              !extractStarted
            ) {
              isDeployButtonDisable(false);
              console.log('enable extract button' + extractStarted);
            }
          } else if (
            localStorage.getItem('canRelease') === 'true' &&
            !releaseStarted
          ) {
            setReleaseEtmButtonDisable(false);
            console.log('enable Release button' + releaseStarted);
          }
        }
      }
    }
  };

  // Load tables from backend after Validate etm clicked
  const getETMTables = () => {
    var responseMessage = '';
    var responseTableList = '';
    setExtractStarted(false);
    setReleaseStarted(false);
    setProgressBarEnable(true);
    setAlert('Fetching impacted tables.. ');
    setAlertColor('Black');
    setTableView(welcomeTableViewMsg);

    var etms = '';
    if (etmCheckbox) {
      etms = finalNumber;
    } else if (dateCheckbox) {
      etms = finalEtmNumber;
    }
    setEnv(finalEnv, etms).then((response) => {
      responseMessage = response.message;
      responseTableList = response.tableList;
      if (response.tableList !== null) {
        if (etmCheckbox) {
          setEtmFullTableList(responseTableList);
          setStatusList(response.etmStatusList);
        } else if (dateCheckbox) {
          setDateFullTableList(responseTableList);
          setDateStatusList(response.etmStatusList);
        }

        if (response.tableList != null) {
          //Setting default values
          setTextColor(
            new Array(responseTableList.split(',').length).fill('Black')
          );
          setSelected(
            new Array(responseTableList.split(',').length).fill(true)
          );
          setDisabledGroup(
            new Array(responseTableList.split(',').length).fill(true)
          );
        } else {
          if (extract) {
            if (localStorage.getItem('canExtract') === 'true') {
              isDeployButtonDisable(false);
              console.log('enable extract button');
            }
          } else if (localStorage.getItem('canRelease') === 'true') {
            setReleaseEtmButtonDisable(false);
            console.log('enable Release button');
          }
        }
        setAlert(responseMessage);
        setAlertColor('Black');
        checkDisabled(extract, response.etmStatusList, responseTableList);
      } else {
        if (etmCheckbox) {
          setEtmFullTableList(welcomeTableViewMsg);
          setTableFromNumber('');
          setStatusList([]);
        } else if (dateCheckbox) {
          setDateFullTableList(welcomeTableViewMsg);
          setTableFromDate('');
          setDateStatusList([]);
        }
        setTableView(welcomeTableViewMsg);
        setAlert(responseMessage);
        setAlertColor('Red');
      }
      setProgressBarEnable(false);
    });
  };

  //handle deploy event click
  const initDeploy = () => {
    if (!deployButtonDisable && !extractStarted) {
      console.log(isDeployButtonDisable);
      if (selectedTables === '') {
        window.alert('You must have a selected table');
        setAlertColor('Red');
        isDeployButtonDisable(false);
        console.log('enable extract button');
      } else {
        setProgressBarEnable(true);
        console.log(isDeployButtonDisable);
        let table = selectedTables.split(', ');
        let tableOut = '';
        for (let i = 0; i < table.length; i++) {
          let x = table[i].split(' - ');
          tableOut = tableOut.concat(x[0] + ', ');
        }
        tableOut = tableOut.substr(0, tableOut.length - 2);

        if (
          window.confirm(
            'Are you sure you want to generate extract for the selected table(s)?'
          )
        ) {
          setAlert('Generating ETM extract ... ');
          setExtractStarted(true);
          isDeployButtonDisable(true);
          setAlertColor('Black');

          if (etmCheckbox) {
            let tempStatusList = statusList;
            for (let i = 0; i < statusList.length; i++) {
              for (let j = 0; j < table.length; j++) {
                let x = table[j].split(' - ');
                if (statusList[i].etmNumber === x[0]) {
                  tempStatusList[i].etmStatus = 'Running';
                }
              }
            }
            setStatusList(tempStatusList);
          }
          if (dateCheckbox) {
            let tempStatusList = dateStatusList;
            for (let i = 0; i < dateStatusList.length; i++) {
              for (let j = 0; j < table.length; j++) {
                let x = table[j].split(' - ');
                if (dateStatusList[i].etmNumber === x[0]) {
                  tempStatusList[i].etmStatus = 'Running';
                }
              }
            }
            setDateStatusList(tempStatusList);
          }
          initDeployment(selectedTables, finalEnv).then((response) => {
            setAlert(response.responseMSG);
            setAlertColor('Black');
            setProgressBarEnable(false);
          });
        } else {
          setAlert('Extract was canceled');
          setAlertColor('Red');
          setProgressBarEnable(false);
          isDeployButtonDisable(false);
          setExtractStarted(false);
          console.log('enable extract button');
        }
      }
    } else {
      console.log('enable extract button');
    }
  };

  //handle release button click
  const initReleaseETM = () => {
    if (!releaseEtmButtonDisable && !releaseStarted) {
      console.log(releaseEtmButtonDisable);
      if (selectedTables === '') {
        window.alert('You must have a selected table');
        setAlertColor('Red');
        setReleaseEtmButtonDisable(false);
        console.log('enable Release button');
      } else {
        setProgressBarEnable(true);
        setReleaseStarted(true);
        console.log(releaseEtmButtonDisable);
        let table = selectedTables.split(', ');
        let tableOut = '';

        for (let i = 0; i < table.length; i++) {
          let x = table[i].split(' - ');
          tableOut = tableOut.concat(x[0] + ', ');
        }
        tableOut = tableOut.substr(0, tableOut.length - 2);

        if (
          window.confirm(
            'Are you sure you want to release the selected ETM(s)?'
          )
        ) {
          setReleaseStarted(true);
          setReleaseEtmButtonDisable(true);
          setAlert('Releasing ETMs ... ');
          setAlertColor('Black');
          let disableRelease = '';

          if (etmCheckbox) {
            let tempStatusList = statusList;
            for (let i = 0; i < statusList.length; i++) {
              for (let j = 0; j < table.length; j++) {
                let x = table[j].split(' - ');
                if (statusList[i].etmNumber === x[0]) {
                  tempStatusList[i].etmStatus = 'Running';
                }
              }
            }
            setStatusList(tempStatusList);
          }
          if (dateCheckbox) {
            let tempStatusList = dateStatusList;
            console.log(table);
            for (let i = 0; i < dateStatusList.length; i++) {
              for (let j = 0; j < table.length; j++) {
                let x = table[j].split(' - ');
                if (dateStatusList[i].etmNumber === x[0]) {
                  tempStatusList[i].etmStatus = 'Running';
                }
              }
            }
            setDateStatusList(tempStatusList);
          }

          initRelease(selectedTables, finalEnv).then((response) => {
            setAlert(response.responseMSG);
            setAlertColor('Black');
            setProgressBarEnable(false);
          });
        } else {
          setAlert('Release was canceled');
          setAlertColor('Red');
          setProgressBarEnable(false);
          setReleaseStarted(false);
          setReleaseEtmButtonDisable(false);
          console.log('enable Release button');
        }
      }
    } else {
      console.log('enable Release button');
    }
  };

  //Set tables and handle the onclick event for impacted tables list
  function formatTables(tableList) {
    if (tableList === '' || tableList === null) {
      return '';
    } else {
      if (tableList === 'This section will show impacted tables') {
        return <p>{tableList}</p>;
      } else {
        var tableListS = tableList.split(', ');
        if (!tableCheckbox) {
          return (
            <FormControl
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              {tableListS.map((str, index) => (
                <MenuItem
                  key={str}
                  value={str}
                  style={{ color: textColor[index] }}
                  disabled={!disabledGroup[index]}
                  onClick={(e) => {
                    document.getElementById(str).click();
                  }}
                >
                  <Checkbox
                    value={str}
                    id={str}
                    checked={selected[index]}
                    onClick={(e) => {
                      const updatedCheckedState = selected.map((item, i) =>
                        i === index ? !item : item
                      );
                      setSelected(updatedCheckedState);
                      //Handling the selected group
                      if (e.target.checked) {
                        setHasSelected(true);
                        let name = e.target.value;
                        //Checking to see if it is not already in selected tables
                        if (!selectedTables.includes(name)) {
                          //If the selected tables is not black add a comma to the beginning
                          if (selectedTables !== '') {
                            setSelectedTables(
                              selectedTables.concat(', ' + name)
                            );
                          } else {
                            setSelectedTables(selectedTables.concat(name));
                            if (extract) {
                              if (
                                localStorage.getItem('canExtract') === 'true'
                              ) {
                                isDeployButtonDisable(false);
                                console.log('enable extract button');
                              }
                            } else if (
                              localStorage.getItem('canRelease') === 'true'
                            ) {
                              setReleaseEtmButtonDisable(false);
                              console.log('enable Release button');
                            }
                          }
                        }
                        var etmnumbers;
                        var number;
                        //making sure to grab correct section for extract vs release
                        if (extract) {
                          etmnumbers = name.substr(name.indexOf('-') + 2);
                          number = etmnumbers.split('|');
                        } else {
                          etmnumbers = name.substr(0, name.indexOf('-'));
                          number = etmnumbers.split('|');
                        }
                        let i = 0;
                        var tempColor = textColor;
                        var hasOne = false;
                        //loop through  to check for etm numbers that are in multiple places
                        /* while(i<number.length)
                               {
                                   let j =0;
                                   let y=0,z=0;
                                   let x="";
                                   while(j<tableListS.length)
                                   {
                                       if(tableListS[j].indexOf(number[i])!==-1)
                                       {
                                           if(selected[j]===true ||index===j)
                                            {
                                               x=x.concat(j+",");
                                               y++;
                                            }
                                           z++;
                                           tempColor[j]="orange";
                                       }
                                       j++;
                                   }
                                   //if all instances of etm numbers are selected change back to black
                                   if(y===z)
                                   {
                                       let nums= x.split(',');
                                       let c =0;
                                       while(c<nums.length)
                                       {
                                           tempColor[nums[c]]="Black";
                                           c++;
                                       }
                                   }
                                   else
                                   {
                                       hasOne=true;
                                       setTextColor(tempColor);
                                   }
                                   if(hasOne)
                                   {
                                       tempColor[index]="orange";
                                       setTextColor(tempColor);
                                   }
                                   i++;
                               }*/
                      }
                      //Handle the deselect
                      else {
                        setHasSelected(true);
                        let name = e.target.value;
                        if (selectedTables.includes(name)) {
                          if (selectedTables.includes(', ' + name)) {
                            setSelectedTables(
                              selectedTables.replace(', ' + name, '')
                            );
                          } else if (selectedTables.includes(name + ', ')) {
                            setSelectedTables(
                              selectedTables.replace(name + ', ', '')
                            );
                          } else if (selectedTables.includes(name + ',')) {
                            setSelectedTables(
                              selectedTables.replace(name + ',', '')
                            );
                          } else if (selectedTables.includes(',' + name)) {
                            setSelectedTables(
                              selectedTables.replace(',' + name, '')
                            );
                          } else {
                            setSelectedTables(selectedTables.replace(name, ''));
                            if (extract) {
                              isDeployButtonDisable(true);
                            } else {
                              setReleaseEtmButtonDisable(true);
                            }
                          }
                        }
                        //Makes sure to grab the correct part of the str to out put
                        if (extract) {
                          etmnumbers = name.substr(name.indexOf('-') + 2);
                          number = etmnumbers.split('|');
                        } else {
                          etmnumbers = name.substr(0, name.indexOf('-'));
                          number = etmnumbers.split('|');
                        }
                        let i = 0;
                        tempColor = textColor;
                        hasOne = false;
                        //check to see if there is any other instances that are still clicked
                        /* while(i<number.length)
                               {
                                   let j =0;
                                   let y=0,z=0;
                                   let x="";
                                   while(j<tableListS.length)
                                   {
                                       if(tableListS[j].indexOf(number[i])!==-1)
                                       {
                                           if(selected[j]===false ||index===j)
                                            {
                                               x=x.concat(j+",");
                                               y++;
                                            }
                                           z++;
                                           tempColor[j]="orange";
                                       }
                                       j++;
                                   }
                                   //if all instances of etm number are selected then turn color back to black
                                   if(y===z)
                                   {
                                       let nums= x.split(',');
                                       let c =0;
                                       while(c<nums.length)
                                       {
                                           tempColor[nums[c]]="Black";
                                           c++;
                                       }
                                   }
                                   else
                                   {
                                       hasOne=true;
                                       setTextColor(tempColor);
                                   }
                                   if(hasOne)
                                   {
                                       tempColor[index]="orange";
                                       setTextColor(tempColor);
                                   }
                                   i++;
                               }*/
                      }
                    }}
                  />
                  <ListItemText primary={str} />
                </MenuItem>
              ))}
            </FormControl>
          );
        } else {
          let tables = tableList.split(', ');
          let disable = [];
          if (tableSelectAll) {
            disable = new Array(tables.length).fill(false);
          } else {
            disable = new Array(tables.length).fill(true);
          }
          return (
            <FormControl
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              {tables.map((str, index) => (
                <MenuItem
                  key={str}
                  value={str}
                  disabled={!disable[index]}
                  onClick={(e) => {
                    document.getElementById(str).click();
                  }}
                >
                  <Checkbox
                    checked={selected[index]}
                    value={str}
                    id={str}
                    onClick={(e) => {
                      const updatedCheckedState = selected.map((item, i) =>
                        i === index ? !item : item
                      );
                      setSelected(updatedCheckedState);
                      if (e.target.checked) {
                        setHasSelected(true);
                        let name = e.target.value;
                        if (!selectedTables.includes(name)) {
                          if (selectedTables !== '') {
                            setSelectedTables(
                              selectedTables.concat(', ' + name)
                            );
                          } else {
                            setSelectedTables(selectedTables.concat(name));
                          }
                        }
                      } else {
                        setHasSelected(true);
                        let name = e.target.value;
                        if (selectedTables.includes(name)) {
                          if (selectedTables.includes(', ' + name)) {
                            setSelectedTables(
                              selectedTables.replace(', ' + name, '')
                            );
                          } else if (selectedTables.includes(name + ', ')) {
                            setSelectedTables(
                              selectedTables.replace(name + ', ', '')
                            );
                          } else if (selectedTables.includes(name + ',')) {
                            setSelectedTables(
                              selectedTables.replace(name + ',', '')
                            );
                          } else if (selectedTables.includes(',' + name)) {
                            setSelectedTables(
                              selectedTables.replace(',' + name, '')
                            );
                          } else {
                            setSelectedTables(selectedTables.replace(name, ''));
                          }
                        }
                      }
                    }}
                  />
                  <ListItemText primary={str} />
                </MenuItem>
              ))}
            </FormControl>
          );
        }
      }
    }
  }

  //Dashboard layout
  return (
    <div>
      {/*Bring the logout timer*/}
      <IdleTimeOutHandler />
      <br />
      <br />
      {/*Has the bar at the top of the page*/}
      <ButtonAppBar />
      {/* This container organizes one large column for each cell to show its data*/}
      <div className="left-menu">
        <Grid container direction="column" columnSpacing={6} rowSpacing={4}>
          {/* This is container 1 - holds ETM Environment dropdown */}
          <Grid container direction="row">
            <Grid item xs={12} md={12}>
              <Etmenv parentCallback={handleCallbackEnv} />
            </Grid>
          </Grid>

          <Grid container direction="row">
            <Grid item xs={12}>
              <h4 style={{ color: '#EC008F' }}>
                ------------------------------------------------------------------------------------
              </h4>
            </Grid>
          </Grid>

          {/* This is container 2 - holds first checkbox and ETM Numbers text entry */}
          <Grid container direction="row">
            <Grid item xs={12} md={1}>
              <FormControlLabel
                control={
                  <Checkbox checked={etmCheckbox} onChange={changeState1} />
                }
              />
            </Grid>

            <Grid
              item
              xs={12}
              md={11}
              style={{
                opacity: etmCheckbox ? 1 : 0.5,
                pointerEvents: etmCheckbox ? 'initial' : 'none',
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  getETMTables();
                }
              }}
            >
              <EtmNum parentCallback={handleCallbackNum} />
            </Grid>
          </Grid>

          {/* GetTablesButton, ReleaseEtmButton */}
          <Grid container direction="row" paddingLeft={10} position={'static'}>
            <Grid
              style={{
                opacity: etmCheckbox ? 1 : 0.5,
                pointerEvents: etmCheckbox ? 'initial' : 'none',
              }}
            ></Grid>

            <Grid item xs={2} onClick={getETMTables}>
              <GetTablesButton disableButton={!etmCheckbox} />
            </Grid>
          </Grid>

          <Grid container direction="row">
            <Grid item xs={12}>
              <h4 style={{ color: '#EC008F' }}>
                ------------------------------------------------------------------------------------
              </h4>
            </Grid>
          </Grid>

          {/* This is container 3 - holds second checkbox and date range picker */}
          <Grid container direction="row" spacing={1}>
            <Grid item xs={2} md={1}>
              <FormControlLabel
                control={
                  <Checkbox checked={dateCheckbox} onChange={changeState2} />
                }
              />
            </Grid>

            <Grid
              item
              xs={2}
              sx={{ ml: 1 }}
              style={{
                opacity: dateCheckbox ? 1 : 0.5,
                pointerEvents: dateCheckbox ? 'initial' : 'none',
              }}
            >
              <CalendarComp parentCallback={handleCallbackDateRange} />
            </Grid>

            <Grid
              item
              xs={2}
              md={4}
              sx={{ mt: 3, ml: 30 }}
              style={{
                opacity: dateCheckbox ? 1 : 0.5,
                pointerEvents: dateCheckbox ? 'initial' : 'none',
              }}
            >
              <GetETMButton
                dates={dateRange}
                environment={finalEnv}
                parentCallback={handleCallbackEtms}
              />
            </Grid>
          </Grid>

          {/* GetETMs, GetTablesButton*/}
          <Grid container direction="row">
            <Grid item xs={2} sx={{ ml: 10, mt: 2 }}>
              <FormHelperText>ETM List</FormHelperText>
              <Card sx={{ minWidth: 350 }}>
                <CardContent style={{ border: 'outset', borderWidth: 0.2 }}>
                  <Grid
                    sx={{ fontSize: 15 }}
                    color="text.primary"
                    gutterBottom
                    label="ETMs List"
                  ></Grid>

                  <Grid
                    variant="body2"
                    sx={{
                      overflow: 'auto',
                      scrollBehavior: 'auto',
                      maxHeight: 280,
                    }}
                  >
                    {finalEtmNumber}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid
              item
              xs={2}
              onClick={getETMTables}
              sx={{ ml: 30, mt: 3 }}
              style={{
                opacity: okayPressed ? 1 : 0.5,
                pointerEvents: okayPressed ? 'initial' : 'none',
              }}
            >
              <GetTablesButton />
            </Grid>
          </Grid>

          <Grid container direction="row">
            <Grid item xs={12}>
              <h4 style={{ color: '#EC008F' }}>
                ------------------------------------------------------------------------------------
              </h4>
            </Grid>
          </Grid>

          {/* This is container 4 - holds third checkbox and ETM Table dropdown */}
          <Grid container direction="row">
            <Grid item xs={12} md={1}>
              <FormControlLabel
                control={
                  <Checkbox checked={tableCheckbox} onChange={changeState3} />
                }
              />
            </Grid>
            <Grid
              item
              xs={6}
              md={11}
              style={{
                opacity: tableCheckbox ? 1 : 0.5,
                pointerEvents: tableCheckbox ? 'initial' : 'none',
              }}
            >
              <TableList
                parentCallback={handleCallbackTables}
                envNum={finalEnv}
              />
            </Grid>
          </Grid>
        </Grid>
      </div>

      <div class="vl">
        <div className="right-menu">
          <Card sx={{ border: 2, height: '60%', borderStyle: 'groove' }}>
            <CardContent
              sx={{
                borderBottom: 1,
                borderTopStyle: 'none',
                borderBottomStyle: 'dotted',
                fontWeight: 'bold',
              }}
            >
              <div>
                Choose Release/Extract View
                <div onChange={handleToggle}>
                  <ToggleSwitch props={disableToggle} label="Toggle" />
                </div>
              </div>
              <div></div>
            </CardContent>
            <CardContent sx={{ scrollBehavior: 'auto', overflow: 'auto' }}>
              <Grid container direction="row" id="tableView">
                {formatTables(tableView)}
              </Grid>
            </CardContent>
          </Card>

          <Card
            sx={{
              border: 2,
              minWidth: 275,
              marginTop: 2,
              height: '30%',
              overflow: 'auto',
              borderStyle: 'groove',
            }}
          >
            <CardContent
              sx={{
                borderBottom: 1,
                borderTopStyle: 'none',
                borderBottomStyle: 'dotted',
                fontWeight: 'bold',
              }}
            >
              <div>System Alert</div>
            </CardContent>
            <CardContent>
              <button
                style={{ float: 'right', border: 'inset', background: 'White' }}
                onClick={(e) => {
                  let temp = document.getElementById('AlertMessages');
                  temp.focus();
                  temp.select();
                  document.execCommand('copy');
                }}
              >
                <img src="copy.png" width="20" height="20" alt="Copy" />
              </button>
              <div>
                <ProgressBarComp
                  progressBarStatus={progressBarEnable}
                  parentCallback={handleCallbackProgressBar}
                />
              </div>
              <textarea
                readOnly
                variant="body2"
                id="AlertMessages"
                cols="47"
                rows="10"
                value={alert}
                style={{
                  border: 'none',
                  paddingTop: '10px',
                  fontSize: 15,
                  paddingRight: '5px',
                  paddingLeft: '.5px',
                  outline: 'none',
                  resize: 'none',
                  fontFamily: 'arial',
                  color: alertColor,
                }}
              />
            </CardContent>
          </Card>

          {/*  Reset/submit buttons */}
          <Grid
            container
            direction="row"
            paddingLeft={1}
            paddingTop={3}
            height="10%"
            marginLeft={1}
          >
            <div item xs={3} onClick={getETMTables}>
              <ResetButton />
            </div>
            <div
              item
              xs={3}
              onClick={() => {
                initReleaseETM();
              }}
              style={{ paddingLeft: 'inherit' }}
            >
              <ReleaseEtmButton
                disableButton={releaseEtmButtonDisable || releaseStarted}
                tableListString={tableFromNumber}
                parentCallback={handleCallbackTableList}
              />
            </div>
            <div
              item
              xs={3}
              onClick={() => {
                initDeploy();
              }}
              style={{ paddingLeft: 'inherit' }}
            >
              <SubmitButton
                disableButton={deployButtonDisable || extractStarted}
                tableListString={tableFromNumber}
                parentCallback={handleCallbackTableList}
              />
            </div>
            <div item xs={3} style={{ paddingLeft: 'inherit' }}>
              <DeploymentStat />
            </div>
          </Grid>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
