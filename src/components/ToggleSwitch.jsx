import React from "react";
import "./ToggleSwitch.css";
const ToggleSwitch = ({props, label }) => {
  return (
    <div className="container">

      <div className="toggle-switch" >
        <input type="checkbox" className="checkbox"
               name={label} id={label} disabled={props}/>
        <label className="label" htmlFor={label}>
          <span className="inner" />
          <span className="switch" />
        </label>
      </div>
    </div>
  );
};

export default ToggleSwitch;