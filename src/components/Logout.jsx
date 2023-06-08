import React, { useEffect, useState, useRef} from 'react';
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import {getRefreshToken} from "../services/UserService";

const IdleTimeOutHandler = (props)=>{
    const[isLogout,setLogout]=useState(false)
    const navigate = useNavigate();
    const [countDown, setCountDown] = useState('10');
    const [open, setOpen] = useState(false);
    let timer=undefined;
    const Ref = useRef(null);
    const events= ['click','load','keydown']


    //Resets the timer on event
    const eventHandler =(eventType)=>{

        console.log("event triggered: " + eventType)
        if(!isLogout){
            localStorage.setItem('lastInteractionTime', Date.now())

            if(timer){
                startTimer();
            }
        }

    };

    //gets the time for count down in logout dialog
    const getTimeRemaining = (e) => {
            const total = Date.parse(e) - Date.parse(new Date());
            const seconds = Math.floor((total / 1000) % 60);
            return {
               total, seconds
            };
        }

    //Starts the count down in the logout dialog
     const startCountDown= (e) => {
            let { total, seconds }
                        = getTimeRemaining(e);
            if (total >= 0) {
                console.log("seconds left: " + seconds)
                setCountDown(
                    (seconds > 9 ? seconds : '0' + seconds)
                )
                if(seconds===0)
                {
                    handleLogout();
                }
            }
        }

        //resets the count down clock
        const clearCountDown = (e) => {
            setCountDown('10');
            if (Ref.current) clearInterval(Ref.current);
            const id = setInterval(() => {
                startCountDown(e);
            }, 1000)
            Ref.current = id;
        }

        //get rid of reaming time
        const getDeadTime = () => {
                let deadline = new Date();
                deadline.setSeconds(deadline.getSeconds() + 10);
                return deadline;
            }

     //turn off count down and close logout
     const handleClose = () => {
            setCountDown('10');
             clearInterval(Ref.current)
            setOpen(false);
     }

    //set default events and start background time
    useEffect(()=>{
        addEvents();

        return (()=>{
            removeEvents();
            localStorage.setItem('refreshToken', Date.now())
            clearTimeout(timer);
        })
    },[])

    //Start or restart background timer
    const startTimer=()=>{
        if(timer){
             clearTimeout(timer)
             console.log("timer" + timer)
        }
        timer=setTimeout(()=>{

            let lastInteractionTime=localStorage.getItem('lastInteractionTime')
            let refresh=localStorage.getItem("refreshToken")
            console.log("Last Interaction: " + lastInteractionTime)
            console.log("Current time: " + Date.now())
            const diff =  Date.now()-lastInteractionTime ;
            let timeOutInterval=1000000;

            if(isLogout){
                clearTimeout(timer)
            }else{
                console.log("Difference for Logout: " + diff)
                if(diff<timeOutInterval){
                    startTimer();
                    let temp = Date.now() - refresh
                    console.log("Difference for refresh: "+temp)
                    if(temp > 10000000 )
                    {
                        getRefreshToken();
                        localStorage.setItem('refreshToken', Date.now())
                    }
                }else{
                    logoutWarning();
                }
            }

        },300000)

    }

    //open logout dialog
    const logoutWarning = () =>{
        setOpen(true);
        clearCountDown(getDeadTime());
    }

    //starts event listening
    const addEvents=()=>{

        events.forEach(eventName=>{
            window.addEventListener(eventName,eventHandler)
        })
        startTimer();
    }

    //Gets rid of events
    const removeEvents=()=>{
        events.forEach(eventName=>{
            window.removeEventListener(eventName,eventHandler)
        })
    };

    //log user out
    const handleLogout = ()=>{
        removeEvents();
        clearTimeout(timer);
        setLogout(true)
        localStorage.setItem("token", "");
        navigate("/");
    }

    return(
        <div>
            <Dialog open={open} onClose={handleClose} style={{width:'25%', marginLeft:"40%"}}  fullWidth maxWidth="xl">
                <DialogTitle>You will be logged out in...</DialogTitle>
                <DialogContent>
                     <h2 style={{marginLeft:"40%", fontSize:"40px", padding: "1px", color: "purple"}}>{countDown}</h2>
                     <DialogActions>
                        <Button color="primary" variant="contained" align="right" onClick={()=>{setOpen(false);  clearInterval(Ref.current); setCountDown('10');}}>Wait!</Button>
                     </DialogActions>
                </DialogContent>
            </Dialog>
        </div>
        )

    }

    export default IdleTimeOutHandler;