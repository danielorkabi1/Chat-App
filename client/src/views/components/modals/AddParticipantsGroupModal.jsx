import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AddingParticipantsToGroupAction } from "../../../application/actions/clientActions";
import ContactsList from "./ContactsList";
import Modal from "./Modal";
export default function AddParticipantsGroupModal({ setClose }) {
  const {
    client: {
      user: { contacts },
      chats: { byId: chatsById },
      users: { byId: usersById },
      selectedChat,
    },
  } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [checkedContacts, setCheckedContacts] = useState({});
  function AddPraticipants(e) {
    if (Object.keys(checkedContacts).length === 0) {
      return;
    }
    dispatch(
      AddingParticipantsToGroupAction({
        chatId: selectedChat,
        participants: checkedContacts,
      })
    );
  }
  return (
    <Modal clickHandler={AddPraticipants} close={() => setClose(false)}>
      <h1>Add participants to group - {chatsById[selectedChat].chatName}</h1>
      <div className="continer-modal">
        <ContactsList
          checkedContacts={checkedContacts}
          setCheckedContacts={setCheckedContacts}
          contacts={Object.values(contacts).reduce((prevContact, contact) => {
            if (!chatsById[selectedChat].chat.participants[contact])
              return { ...prevContact, [contact]: usersById[contact] };
            return prevContact;
          }, {})}
        />
      </div>
    </Modal>
  );
}
