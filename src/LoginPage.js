import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import ProgressBarComp from "./components/ProgressBar";
import { authenticateUser } from "./services/UserService";

function LoginPage(props) {
    let canRelease, canExtract;
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  const navigate = useNavigate();
  const [errorMessage, hideErrorMessage] = useState(true);
  const [errorMessage2, hideErrorMessage2] = useState(true);
  const token = localStorage.getItem("token");
  const [adminUser, setIsAdminUser] = useState(false);
  const [progressBarEnable, setProgressBarEnable] = useState(false);
  const [userName, setUserName]= useState();
  const handleCallbackProgressBar = (childData) => {
    setProgressBarEnable(childData);
  };

  useEffect(() => {
    if (token !== "" &&token !== null) {
      console.log("Login page: " + token)
      navigate("Dashboard");
    }
  });

  const handleSubmit = (event) => {
    //Prevent page reload
    event.preventDefault();

    var { uname, pass } = document.forms[0];
    setProgressBarEnable(true);
    hideErrorMessage(true);
    hideErrorMessage2(true);
    authenticateUser(uname.value, btoa(pass.value)).then((response) => {
    //authenticateUser(uname.value, pass.value).then((response) => {
     if(response !== null){


          if (response.status === "success") {
            console.log(response.status);
            const token = response.accessToken;
            const name= token.substring(token.indexOf("(")+1,token.length-1);

            console.log(token);
            const temp = token.substring(0,token.indexOf("("));
            const isAdmin = response.isAdmin;

            if(isAdmin === "Both"){
              canRelease=true;
              canExtract=true;
            }
            else if(isAdmin === "Release"){
                canExtract=false;
                canRelease=true;
            }
            else if(isAdmin === "Extract"){
                canExtract=true;
                canRelease=false;
            }
            else if(isAdmin === "None"){
                canExtract=false;
                canRelease=false;
            }
            else{
                canExtract=false;
                canRelease=false;
            }

            localStorage.setItem("adminUser", isAdmin);
            localStorage.setItem("canRelease", canRelease);
            localStorage.setItem("canExtract", canExtract)
            localStorage.setItem("token", temp);
            localStorage.setItem("userId", uname.value);
            localStorage.setItem("name", name);
            console.log("userId: "+ uname.value);
            console.log("canRelease: " + canRelease)
            console.log("canExtract: " + canExtract)

            setUserName(uname.value);
            navigate("/Dashboard");

            setIsValidated(true);
          }
          else if (response.status === "fail") {
            setIsValidated(false);
            hideErrorMessage(false);
            uname.value = "";
            pass.value = "";
            console.log(response.status);
          }
          else {
            setIsValidated(false);
            hideErrorMessage(false);
            uname.value = "";
            pass.value = "";
            console.log(response.status);
          }
          setProgressBarEnable(false);
      }
      else{
        setProgressBarEnable(false);
        setIsValidated(false);
        hideErrorMessage2(false);

      }

    });
  };

  // JSX code for login form
  const renderForm = (
    <div className="form">
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <label>Username </label>
          <input type="text" name="uname" required />
        </div>
        <div className="input-container">
          <label>Password </label>
          <input type="password" name="pass" required />
        </div>
        <div id="errorMessage" style={{ color: "red" }} hidden={errorMessage}>
          Invalid username or password.
        </div>
        <div id="errorMessage2" style={{ color: "red" }} hidden={errorMessage2}>
          Something went wrong
        </div>
        <div>
          <ProgressBarComp
            progressBarStatus={progressBarEnable}
            parentCallback={handleCallbackProgressBar}
          />
        </div>
        <div className="button-container">
          <input style={{background: "#F45654", borderColor: "#F45654"}} type="submit" value="Sign In"/>
        </div>
      </form>
    </div>
  );

  return (
    <div className="app">
      <div style={{ color: "#F13669", textAlign: "center", marginTop: "7%" }}>
        <h2>Welcome to ETM Deployer</h2>
        <div>
          This app automates the deployment of ETM data into Testing
          environment.
          <br />
          User needs to select ETM environment, and provide either the ETM
          numbers or list of tables.
        </div>

        <div className="login-form">
          <div className="title">Sign In</div>
          {isSubmitted ? <div>User is successfully logged in</div> : renderForm}
        </div>


      </div>
    </div>
  );
}

export default LoginPage;
