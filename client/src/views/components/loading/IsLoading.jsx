import { useSelector } from "react-redux";
import Loader from "./Lodaer";
import React from "react";

export default function IsLoading({ children, }) {
  const { isLoading } = useSelector((state) => state);
  if (!isLoading.isLoading) {
    return children;
  }
  else{
      return <Loader/>
  }
}
