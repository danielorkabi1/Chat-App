import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CreatingANewGroupChatAction } from "../../../application/actions/clientActions";
import Error from "../alerts/Errors";
import TextField from "../Inputs/texts/TextField";
import ContactsList from "./ContactsList";
import Modal from "./Modal";
export default function GroupChatModal({ setClose }) {
  const {
    client: {
      user: { _id, contacts, email, name, profileImage: profileImageUser },
      users: { byId: usersById },
    },
  } = useSelector((state) => state);
  const dispatch=useDispatch()
  const [checkedContacts, setCheckedContacts] = useState({
    [_id]: { email, _id, profileImageUser, name },
  });
  const [profileImage, setProfileImage] = useState(null);
  const [chatName, setChatName] = useState(null);
  const [errors,setErrors]=useState(null)
  function CreateNewGroup() {
    if (Object.keys(checkedContacts).length === 1) {
      setErrors('Please Chose Participants')
      return;
    }
    if (!chatName) {
      setErrors('Please Enter a name')
      return;
    }
    const data = new FormData();
    setErrors(null)
    if (profileImage) data.append("profileImage", profileImage);
    data.append("chatName", chatName);
    data.append("createdBy", _id);
    data.append("participants", JSON.stringify(checkedContacts));
    dispatch(CreatingANewGroupChatAction({ data }));
  }

  return (
    <Modal clickHandler={CreateNewGroup} close={() => setClose(false)}>
      <h1>Create group chat</h1>
      <TextField placeholder="chat name" onChange={setChatName} />
      {errors?<Error data={errors}/>:null}
      <ContactsList
        checkedContacts={checkedContacts}
        setCheckedContacts={setCheckedContacts}
        contacts={Object.keys(contacts).reduce((prevContacts, contact) => {
          return { ...prevContacts, [contact]: usersById[contact] };
        }, {})}
      />
      <div>
        <input
          type="file"
          onChange={(e) => setProfileImage(e.target.files[0])}
        />
      </div>
    </Modal>
  );
}
