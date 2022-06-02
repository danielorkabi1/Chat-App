import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DateTime from "../chat/DateTime";
import Contact from "../contact/Contact";
import BtnSecondary from "../Inputs/buttons/BtnSecondary";
import ImageInput from "../Inputs/FileUpload/ImageInput";
import AddParticipantsGroupModal from "../modals/AddParticipantsGroupModal";
import InfoCardStyle from '../CardStyle/InfoCardStyle'
import {
  LeavingGroupAction,
  UpdateChatProfileImageAction,
} from "../../../application/actions/clientActions";
export default function GroupChatInfoBar({chat}){
    const {client: {user,users: { byId: usersById },},} = useSelector((state) => state);
    const {createdAt,createdBy,chatName,_id,participants,profileImage}=chat
    const [addPrticipantsModal,setAddPrticipantsModal]=useState(false)
    const dispatch=useDispatch()
    const PrintParticipants=useCallback(()=>{
        return Object.keys(participants).map((participant) => {
        if (participant !== user._id)
           return <Contact key={participant} contact={usersById[participant]} />
        return null
      })
    },[participants,user._id,usersById])
    function ExitGroup(){
       dispatch(
         LeavingGroupAction({
           chatId: _id,
           userId: user._id,
           userEmail: user.email,
         })
       );
    }
      function UpdateprofileImage(newProfileImage) {
        const data = new FormData();
        if (newProfileImage){ data.append("profileImage", newProfileImage);
        data.append("prevProfileImage",profileImage);
         dispatch(UpdateChatProfileImageAction({ data, chatId:chat._id}));
      }
      }
    return (
      <>
        <InfoCardStyle>
          <ImageInput profileImage={profileImage} cb={UpdateprofileImage} />
          <div className="chatName">{chatName}</div>
          <div className="details">
            {`group · participants : ${Object.keys(chat.participants).length}`}
          </div>
        </InfoCardStyle>
        <InfoCardStyle>description</InfoCardStyle>
        <InfoCardStyle>
          createdAt <DateTime date={new Date(createdAt)} /> by {createdBy.email}
        </InfoCardStyle>
        <InfoCardStyle>
          <div>paerticipants</div>
          <Contact key={user._id} contact={user} />
          {PrintParticipants()}
        </InfoCardStyle>
        <InfoCardStyle>
          <BtnSecondary onClick={ExitGroup} value="exit group" />
        </InfoCardStyle>
        <InfoCardStyle>
          <BtnSecondary
            onClick={(e) => {
              setAddPrticipantsModal(true);
            }}
            value="Add to group"
          />
        </InfoCardStyle>
        {addPrticipantsModal && (
          <AddParticipantsGroupModal setClose={setAddPrticipantsModal} />
        )}
      </>
    );
        }
    