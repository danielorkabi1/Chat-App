import React, { useState } from "react";
import { useSelector } from "react-redux";
import ContactModal from "../modals/ContactModal";
import GroupChatModal from "../modals/GroupChatModal";
import WithOptionsBoard from "../HOC/WithOptions";
import { DeleteContactAction } from "../../../application/actions/clientActions";
import { withLazyComponent } from "../HOC/WithLazyComponent";
const LazyComponent = withLazyComponent(React.lazy(() => import("./Contact")));
const ContactWithOptionBoard = WithOptionsBoard(LazyComponent);
export default function Contacts() {
  const {
    user: { contacts,_id },
    users: { byId },
  } = useSelector((state) => state.client);
  const [chatGrouptmodal, setChatGrouptmodal] = useState(false);
  const [contactModal, setContactModal] = useState(false);
  return (
    <>
      <span className="options-contacts">
        <button onClick={() => setChatGrouptmodal(true)}>
          create new group
        </button>
        <button onClick={() => setContactModal(true)}>add contact</button>
      </span>
      {chatGrouptmodal && <GroupChatModal setClose={setChatGrouptmodal} />}
      {contactModal && <ContactModal setClose={setContactModal} />}
      <div className="contact-continer">
        {Object.values(contacts).map((contactId) => {
          return (
            <div>
              <ContactWithOptionBoard
                key={contactId}
                optionsBoard={{
                  Remove: DeleteContactAction({ userId: _id, contactId }),
                }}
                contact={byId[contactId]}
              />
            </div>
          );
        })}
      </div>
    </>
  );
}
