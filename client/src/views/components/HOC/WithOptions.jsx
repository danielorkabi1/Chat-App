import React from "react";
import MoreOptionsToCard from "../options/MoreOptionsToCard";
const WithOptionsBoard = (Component) => {
  function HOC(props) {
    const { optionsBoard, ...componentProps } = props;
    return (
      <div className="with-options-continer">
        <Component {...componentProps} />
        <MoreOptionsToCard optionsBoard={props.optionsBoard} />
      </div>
    );
  }
  return HOC;
};
export default WithOptionsBoard;
