import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import useGetParticipantChat from "../../../Utils/customHooks/useGetParticipantChat";
import InfoCardStyle from "../CardStyle/InfoCardStyle";
import DateTime from "../chat/DateTime";
import { withLazyComponent } from "../HOC/WithLazyComponent";
import ProfileImg from "../profileImg/ProfileImg";
const CardStyle =React.lazy(()=>import("../CardStyle/CardStyle"))
const LazyCardStyle =withLazyComponent(CardStyle)
export default function PrivateChatInfoBar({ chat }) {
  const {chats: { byId: chatsById },users: { byId: usersById },} = useSelector((state) => state.client);
  const { participantDetails } = useGetParticipantChat(chat);
  const { createdAt, createdBy, _id } = chat;
  const ReturnSharedGroups = useMemo(() => {
    return Object.values(chatsById).filter(
      (chatInfo) =>
        chatInfo.chat.participants[participantDetails._id] &&
        chatInfo.chat._id !== _id
    );
  }, [_id, chatsById,participantDetails._id]);
  return (
    <>
      <InfoCardStyle>
        <ProfileImg profileImage={participantDetails.profileImage} />
        {participantDetails.name&&<div className="chatName">{participantDetails.name}</div>}
        <div className="details">{participantDetails.email}</div>
      </InfoCardStyle>
      <InfoCardStyle>
        Created at <DateTime date={new Date(createdAt)} /> by {createdBy.email}
      </InfoCardStyle>
      <InfoCardStyle>
        Shared groups:
        {ReturnSharedGroups.map((chatInfo) => {
          return (
            <LazyCardStyle
              key={chatInfo.chat._id}
              img={chatInfo.chat.profileImage}
              onClick={() => {}}
              mainSub={chatInfo.chat.chatName}
              seconderySub={Object.values(chatInfo.chat.participants).map(
                (participant) => (
                  <span key={participant}>
                    {usersById[participant].email},{" "}
                  </span>
                )
              )}
            />
          );
        })}
      </InfoCardStyle>
    </>
  );
}
