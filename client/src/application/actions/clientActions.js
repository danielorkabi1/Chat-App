//from dispatch to epic without socket
export function SetUserAction(payload = null) {
  return { type: "SIGN_IN", payload };
}
export function CreateUserAction(payload = null) {
  return { type: "CREATE_USER", payload };
}
export function CreateNewPrivateChatIfNotExistsAction(payload) {
  return { type: "CREATE_NEW_PRIVATE_CHAT_IF_NOT_EXISTS", payload };
}
export function SendingNewMessageAction(payload = undefined, soecketEvent) {
  return { type: "SENDING_NEW_MESSAGE", payload, soecketEvent };
}
export function GetMessagesOfChatAction(payload){
  return { type: "GET_MESSAGES_OF_CHAT", payload };
}
export function SetSelectChatAction(payload = null) {
  return { type: "SELECT_CHAT", payload };
}
export function AddNewContactAction(payload = null) {
  return { type: "ADD_NEW_CONTACT", payload };
}
export function DeleteContactAction(payload = null) {
  return { type: "DELETE_CONTACT", payload };
}
export function GetUserConnectionStatusAction(payload = null) {
  return { type: "GET_PRTICIPANT_CONNECTION_STATUS", payload };
}

//from dispatch to epic && sending action to socket
export function LeavingGroupAction(payload) {
  return { type: "LEAVING_GROUP", payload };
}
export function AddingParticipantsToGroupAction(payload) {
  return { type: "ADDING_PARTICIPANTS_TO_GROUP", payload };
}
export function CreatingANewGroupChatAction(payload=null){
  return {type: 'CREATING_A_NEW_GRUOP_CHAT',payload}
}
export function UpdateChatProfileImageAction(payload = undefined) {
  return { type: "UPDATE_CHAT_PROFILEIMAGE", payload };
}


//from socket to epic (for notification)=> than from epic to reducer
export function ParticipantLeftChatAction(payload) {
  return { type: "PARTICIPANT_LEFT_CHAT", payload };
}
export function ParticipantsAddedToGroupAction(payload) {
  return { type: "PARTICIPANTS_ADDED_TO_GROUP", payload };
}
export function RecivedNewMessageAction(payload = undefined) {
  return { type: "RECIVED_NEW_MESSAGE", payload };
}
export function RecivedANewChatAction(payload = null) {
  return { type: "RECIVED_A_NEW_CHAT", payload };
}
export function UpdatedChatProfileImageAction(payload = null) {
  return { type: "UPDATED_CHAT_PROFILEIMAGE", payload };
}
export function ChangeParticipantConnctionStatusAction(payload = null) {
  return { type: "UPDATED_PRTICIPANT_CONNECTION_STATUS", payload };
}


//from dispatch to reducer
export function SingOutAction(){
  return { type: "SIGN_OUT", soecketEvent: { dissconnect: true } };
}

//from dispatch to socket
export function SendOfflineDataAction(handleEvent) {
  return {
    type: '',
    soecketEvent: {
      offlineData: true,
      handleEvent,
    },
  };
}
export function OfflineAction(){
  return { type: "", soecketEvent: { dissconnect: true }}
}