import React, { useState } from "react";
import { useSelector } from "react-redux";
import { loadingTypes } from "../../../Utils/loading/loadingTypes";
import WithChatInfoBar from "../chatInfoBars/WithChatInfoBar";
import Loader from "../loading/Lodaer";
import MessageField from "../messages/MessageField";
import Messages from "../messages/Messages";
import TopChatBar from "./TopChatBar";

export default function MainBar() {
  const {
    client: {
      selectedChat,
      chats: { byId: chatsById },
    },
    isLoading: { mainBar },
  } = useSelector((state) => state);
  const [className, setClassName] = useState("");
  if (mainBar && mainBar.isLoading) {
    return <Loader />;
  }
  return selectedChat ? (
    <div className="warp-messages" onClick={() => setClassName("")}>
      <TopChatBar
        onClick={(e) => {
          setClassName(className ? "" : "chat-info-active");
          e.stopPropagation();
        }}
        chatInfo={chatsById[selectedChat]}
      />
      <Messages />
      <MessageField />
      <WithChatInfoBar className={className} />
    </div>
  ) : null;
}
