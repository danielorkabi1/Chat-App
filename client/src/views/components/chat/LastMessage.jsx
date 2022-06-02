import React from "react";
import { useSelector } from "react-redux";
export default function LastMessage({ message }) {
  const { user:{contacts,_id},users:{byId} } = useSelector((state) => state.client);
  return (
    <div className="last-message">
      {_id === message.sender._id
        ? "me"
        : contacts[message.sender._id]
        ? byId[message.sender._id].name
        : message.sender.email}
      :{message.message}
    </div>
  );
}
