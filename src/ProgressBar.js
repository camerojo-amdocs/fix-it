import React from "react";
import { ProgressBar } from "react-loader-spinner";

const ProgressBarComp = (props) => {
  props.parentCallback(props.progressBarStatus);

  return (
    <ProgressBar
      borderColor="#F13669"
      barColor="#F45654"
      visible={props.progressBarStatus}
    />
  );
};

export default ProgressBarComp;
