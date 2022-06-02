import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AddNewContactAction } from "../../../application/actions/clientActions";
import TextField from "../Inputs/texts/TextField";
import Modal from "./Modal";
export default function ContactModal({setClose}) {
  const [email, setEmail] = useState(null);
  const {
    user:{_id,
    email: userEmail,
    contacts},
    chats:{byId}
  } = useSelector((state) => state.client);
  const dispatch=useDispatch()
  function clickHandler(){
    if(email ===userEmail || (contacts && Object.keys(contacts).some(contact=>byId[contact].email=== email))){
      return
    }
   dispatch(AddNewContactAction({ participantEmail:email ,userId:_id}));
  }
  return (
    <Modal clickHandler={clickHandler} close={() => setClose(false)}>
      <h1>add contact</h1>
      <TextField placeholder="email" onChange={setEmail} />
      <div>
      </div>
    </Modal>
  );
}
