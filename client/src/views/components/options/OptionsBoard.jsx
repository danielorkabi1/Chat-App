import { useEffect } from "react";
import React, { useDispatch, useSelector } from "react-redux";
import { HideBoard } from "../../../application/actions/optionsBoardActions";

export default function OptionsBoard() {
  const { optionsBoard } = useSelector((state) => state);
  const dispatch = useDispatch();
  useEffect(() => {
    if (optionsBoard) {
      document.addEventListener("wheel", preventScroll, { passive: false });
      document.addEventListener("click", setDisaplay);
    }
    function setDisaplay() {
      dispatch(HideBoard());
    }
    function preventScroll(e) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
    return () => {
      document.removeEventListener("wheel", preventScroll, { passive: false });
      document.removeEventListener("click", setDisaplay);
    };
  }, [optionsBoard, dispatch]);
  const style = optionsBoard
    ? {
        position: "absolute",
        left: `${optionsBoard.cord.left}px`,
        top: `${optionsBoard.cord.top + 10}px`,
        background: "white",
        display: "block",
      }
    : { display: "none" };

  return optionsBoard ? (
    <div style={style}>
      {Object.keys(optionsBoard.data).map((option) => (
        <div
          key={option}
          onClick={(e) => {
            e.stopPropagation();
            dispatch(optionsBoard.data[option]);
          }}
          className="option"
        >
          {option}
        </div>
      ))}
    </div>
  ) : null;
}
