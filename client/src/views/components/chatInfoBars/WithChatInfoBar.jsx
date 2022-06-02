import React from "react";
import { useSelector } from "react-redux";
import { withLazyComponent } from "../HOC/WithLazyComponent";
const LazyGroupChatInfoBar =withLazyComponent(React.lazy(()=>import("./GroupChatInfoBar")))
const LazyPrivateChatInfoBar = withLazyComponent(
  React.lazy(() => import("./PrivateChatInfoBar"))
);
export default function WithChatInfoBar({ className }) {
  const {selectedChat,chats:{byId:chatsById}}=useSelector(state=>state.client)
  const chat = chatsById[selectedChat].chat;
  return (
    <aside className={`chat-info ${className}`}>
      {chat.chatName?
        <LazyGroupChatInfoBar chat={chat}/>:
      <LazyPrivateChatInfoBar chat={chat}/>}
    </aside>
  );
}
