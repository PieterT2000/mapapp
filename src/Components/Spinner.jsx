import "./../styles/spinner.scss";
import React from "react";

const Spinner = ({ complete }) => {
  return (
    <div className="wrapper">
      <div hidden={complete} className="spinner">
        Spinning...
      </div>
    </div>
  );
};

export default Spinner;
