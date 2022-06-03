import React from "react";
import { FormGroup, FormControlLabel, Checkbox } from "@mui/material";

export default function ContactsList({ checkedContacts, setCheckedContacts,contacts }) {
  function handleChange(event) {
    const newcheckedContacts = { ...checkedContacts };
    if (newcheckedContacts[event.target.name])
      delete newcheckedContacts[event.target.name];
    else newcheckedContacts[event.target.name] = contacts[event.target.name];
    setCheckedContacts(newcheckedContacts);
  }
  return (
    <FormGroup>
      {Object.values(contacts).map((contact, i) => {
        return (
          <FormControlLabel
            key={i}
            control={
              <Checkbox
                checked={checkedContacts[contact._id] ? true : false}
                onChange={handleChange}
                name={contact._id}
              />
            }
            label={
              <div>
                <div className="main-sub" style={{'font-size':'20px'}}>{contact.name}</div>
              </div>
            }
          />
        );
      })}
    </FormGroup>
  );
}
