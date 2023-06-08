import { useEffect, useRef, useState } from "react";
import { DateRangePicker } from "react-date-range";
import format from "date-fns/format";
import FormHelperText from "@mui/material/FormHelperText";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const CalendarComp = (props) => {

  //date state
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  //Has the date range selected twice
  const [flag, setFlag] = useState(false);

  const [rangeOut, setRangeOut] = useState("Please Select A Range");

  const handleChange = (e) => {

          if (flag === true)
          {
            setRange([e.selection]);
            setRangeOut(` ${format(e.selection.startDate, "yyyy-MM-dd")} to ${format(e.selection.endDate, "yyyy-MM-dd")} `);
            //setFlag(false);
          }
          else
          {
            setRange([e.selection]);
            setFlag(true);
          }

    };

  //open close
  const [open, setOpen] = useState(false);

  const refOne = useRef(null);

  useEffect(() => {
    document.addEventListener("keydown", hideOnEscape, true);
    document.addEventListener("click", hideOnClickOutside, true);
  }, []);

  //hide dropdown on esc press
  const hideOnEscape = (e) => {
    if (e.key === "Escape") {
      setOpen(false);

    }

  };

  //hide on outside click
  const hideOnClickOutside = (e) => {
    if (refOne.current && !refOne.current.contains(e.target)) {
      setOpen(false);

    }

  };

  props.parentCallback(range);


  return (
    <div className="calendarWrap" >
      <FormHelperText>Find ETMs by Deployment Dates</FormHelperText>

     <div >
      <input
        value={rangeOut}
        readOnly
        color="primary"
        className="inputBox"
        label="select a Date Range"
        id="rangeOut"
        //focus={{borderColor: "purple"}}
        style={{width: "250px", fontSize: "16px", fontWeight: "10px",control: (base, state) => ({
            ...base, '&:hover': { border: "5px solid black", }, border: '1px solid lightgray'}), '&:hover':{color: "purple"} }}
        onClick={() => setOpen((open) => !open)}
     />
      </div>

      <div ref={refOne}>
        {open && (
          <DateRangePicker
            onChange={handleChange}
            editableDateInputs={true}
            placeholder="Select Date Range"
            moveRangeOnFirstSelection={false}
            ranges={range}
            months={2}
            direction="horizontal"
            className="calendarElement"
          />
        )}

        <FormHelperText>Select a date range</FormHelperText>
      </div>
    </div>
  );

};

export default CalendarComp;
