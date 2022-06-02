import React, { useState } from "react";
import Picker from "emoji-picker-react";
import { HiOutlineEmojiHappy } from "@react-icons/all-files/hi/HiOutlineEmojiHappy";
export default function EmojiPicker({ onEmojiClick }) {
  const [displayEmoji, setDisplayEmoji] = useState(false);
  return (
    <div className="emoji-picker-continer">
      {displayEmoji && (
        <div className="emoji-picker">
          <Picker
            disableAutoFocus={true}
            onEmojiClick={(event, emojiObject) => {
              onEmojiClick(emojiObject.emoji);
            }}
            groupNames={{ smileys_people: "PEOPLE" }}
            native
          />
        </div>
      )}
      <div onClick={() => setDisplayEmoji(!displayEmoji)}>
        <HiOutlineEmojiHappy />
      </div>
    </div>
  );
}
