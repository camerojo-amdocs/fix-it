import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
const Collapsible =(props)=>{
 const [open, setOpen] = useState(false);

 const toggle = () => {
   setOpen(!open);
 };

    return(
     <div>
         <Button  color="primary" variant="contained" onClick={toggle} style={{padding: "10px", marginBottom: "10px", marginLeft: "13px"}}
         disabled={props.disabled} >Filter</Button>
         {open && (
           <div className="toggle">
             {props.children}
           </div>
         )}
       </div>
    );

}
export default Collapsible;