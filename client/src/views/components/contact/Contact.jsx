import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CreateNewPrivateChatIfNotExistsAction, GetMessagesOfChatAction, SetSelectChatAction } from "../../../application/actions/clientActions";
import CardStyle from "../CardStyle/CardStyle";
export default function Contact({ contact }) {
  const {
    chats: { byId, allIds },
    user: { _id, email },
  } = useSelector((state) => state.client);
  const dispatch = useDispatch();
  const StartChating = useCallback(
    (contact) => {
      /* getting private chat between 2 participants that is not a groupchat,
      checking that it is not exist*/
      const startchat = allIds.find((chatId) => {
        const { participants, chatName = undefined } = byId[chatId].chat;
        return (
          Object.keys(participants).length <= 2 &&
          participants[contact._id] &&
          !chatName
        );
      });
      //if we found a chat
      if (startchat) {
        //getting messages
        if (!byId[startchat].chat.messages) {
          dispatch(GetMessagesOfChatAction({ chatId: startchat, userId: _id }));
        }
        //when we found an existing chat and load the messages once
        else {
          dispatch(SetSelectChatAction({ chatId: startchat }));
        }
      }
      //when we need to create new praivte chat
      else {
        dispatch(CreateNewPrivateChatIfNotExistsAction({ userId:_id, participants:[_id, contact._id] }));
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [byId, allIds]
  );
  return (
    contact?<CardStyle
      onClick={() => {
        if (contact.email === email) return;
        StartChating(contact);
      }}
      img={contact.profileImage}
      mainSub={contact.email === email ? "You" : contact.name}
      seconderySub={contact.email}
    />
  :null)
}
