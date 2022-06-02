import React from "react";
import { useSelector } from "react-redux";
export default function Message(props) {
  const {
    messageInfo: {
      sender: { _id, email },
      message,
      timesent,
    },
    id,
  } = props;
  const {
    users: { byId },
    user: { contacts },
  } = useSelector((state) => state.client);

  return (
    <div className={id === _id ? "my-message" : "other-message"}>
      <div>{id === _id ? "me" : contacts[_id] ? byId[_id].name : email}</div>
      <pre>{message}</pre>
        <div className="message-time">{new Date(timesent).toLocaleTimeString([], { hour: '2-digit', minute: "2-digit", hour12: false })}</div>
    </div>
  );
}
