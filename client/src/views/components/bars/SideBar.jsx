import React, { useState } from "react";
import Chats from "../chat/Chats";
import Contacts from "../contact/Contacts";
export default function SideBar(){
    const [bar,setBar]=useState(false)
    return (
      <div className="chats">
        <div className="bar">
          <button
            className={bar ? "button-bar" : "button-bar selected-button-bar"}
            onClick={() => setBar(false)}
          >
            chats
          </button>
          <button
            className={!bar ? "button-bar" : "button-bar selected-button-bar"}
            onClick={() => setBar(true)}
          >
            contacts
          </button>
        </div>
        {bar ? <Contacts /> : <Chats />}
      </div>
    );
}