import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetUserConnectionStatusAction } from "../../../application/actions/clientActions";
import useGetParticipantChat from "../../../Utils/customHooks/useGetParticipantChat";
import userStatus from "../../../Utils/userStatus/index.js";
import ProfileImg from "../profileImg/ProfileImg";
export default function TopChatBar({ chatInfo, onClick }) {
  const { chat } = chatInfo;
  const { participantDetails } = useGetParticipantChat(chat);
  const {
    user: { contacts },
    users: { byId: usersById },
  } = useSelector((state) => state.client);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!chat.chatName) {
      dispatch(
        GetUserConnectionStatusAction({ userId: participantDetails._id })
      );
    }
  }, []);
  let connectionStyle;
  if (participantDetails) {
    connectionStyle = {
      display: !chat.chatName ? "inline-block" : "none",
      backgroundColor: userStatus[participantDetails.connectionStatus]
        ? userStatus[participantDetails.connectionStatus]
        : null,
    };
  }
  return (
    <div className="chat-summarize-info" onClick={onClick}>
      <ProfileImg
        profileImage={
          chat.chatName ? chat.profileImage : participantDetails.profileImage
        }
      />

      <span>
        {chat.chatName
          ? chat.chatName
          : contacts[participantDetails._id]
          ? usersById[participantDetails._id].name
          : usersById[participantDetails._id].email}
      </span>
      {!chat.chatName ? (
        <div className="connetcion-status-continer">
          <span className="connetcion-status" style={connectionStyle}></span>
        </div>
      ) : null}
    </div>
  );
}
