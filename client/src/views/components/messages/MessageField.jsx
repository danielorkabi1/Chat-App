import React, { useEffect, useRef, useState } from "react";
import { BiUpArrowCircle } from "@react-icons/all-files/bi/BiUpArrowCircle";
import { useDispatch, useSelector } from "react-redux";
import { SendingNewMessageAction } from "../../../application/actions/clientActions";
import EmojiPicker from "../Inputs/emojipicker/EmojiPicker";
import IndexDB from "../../../Utils/IndexDB/IndexDBClass";
import { v4 as uuidv4 } from "uuid";
export default function MessageField() {
  const {
    user: { email, _id, name, profileImage },
    chats: { byId },
    selectedChat,
  } = useSelector((state) => state.client);
  const myFormRef = useRef(undefined);
  const key = useRef(undefined);
  const [sendMessageText, setSendMessageText] = useState("");
  const dispatch = useDispatch();
  useEffect(() => {
    if(key.current==='Enter'){
      key.current=null
      setSendMessageText('')
    }
  }, [sendMessageText]);
  async function SendMassage(e) {
    e.preventDefault();
    if (!sendMessageText) return;
    const message = {
      _id: uuidv4(),
      chatId: byId[selectedChat].chat._id,
      sender: { email, _id },
      message: sendMessageText,
      timesent: Date.now(),
    };
    if (navigator.onLine) {
      dispatch(
        SendingNewMessageAction(
          {
            messages: [message],
            chatId: byId[selectedChat].chat._id,
            userId: _id,
          },
          {
            emit: true,
            handleEvent: {
              eventName: "send-a-message",
              params: {
                chat: byId[selectedChat].chat,
                message,
              },
            },
          }
        )
      );
    } else {
      const indexDB = new IndexDB();
      await indexDB.OpenDB("ServiceWorkerDB", 1, [
        { name: "messages", option: { KeyPath: "_id" } },
      ]);
      await indexDB.Upsert("messages", message);
      dispatch(
        SendingNewMessageAction({
          messages: [message],
          chatId: byId[selectedChat].chat._id,
          userId: _id,
        })
      );
    }

  }
  function OnKeyDownText(e) {
    if (e.which === 13) {
      if (!e.shiftKey) {
        myFormRef.current.requestSubmit();
        key.current = 'Enter';
      }
    }
  }
  function OnChange(e) {
    setSendMessageText(e.target.value);
  }
  return (
    <div className="message-input">
      {byId[selectedChat].chat.participants[_id] ? (
        <form ref={myFormRef} onSubmit={SendMassage}>
          <div className="textarea-continer">
            <textarea
              value={sendMessageText}
              onChange={OnChange}
              onKeyDown={OnKeyDownText}
            />
            <EmojiPicker
              onEmojiClick={(emoji) =>
                setSendMessageText(sendMessageText + emoji)
              }
            />
          </div>
          <div onClick={() => myFormRef.current.requestSubmit()}>
            <BiUpArrowCircle />
          </div>
        </form>
      ) : (
        <div className="cannot-type">you no longer in this group</div>
      )}
    </div>
  );
}
