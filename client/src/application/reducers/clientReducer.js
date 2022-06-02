import {
  SelectedChatLogic,
  SignInLogic,
  AddNewContactLogic,
  AddNewChatLogic,
  AddNewMessageLogic,
  LeaveGroupLogic,
  JoinNewParticipantsToGroupLogic,
  UpdateChatProfileImageLogic,
  SignOutLogic,
  UpdateNotificationLogic,
  DeleteContactLogic,
  UserConnectionStatusLogic,
} from "../logic/clientLogic";

export const clientRuducer = (state = null, action) => {
  const { type, payload } = action;
  switch (type) {
    case "SIGN_IN_SUCCESS":
    case "CREATE_USER_SUCCESS":
      return SignInLogic(payload);
    case "SIGN_OUT":
      return SignOutLogic();
    case "SELECT_CHAT_SUCCESS":
    case "GET_MESSAGES_OF_CHAT_SUCCESS":
      return SelectedChatLogic(state, payload);
    case "CREATING_A_NEW_GRUOP_CHAT_SUCCESS":
    case "CREATE_NEW_PRIVATE_CHAT_IF_NOT_EXISTS_SUCCESS":
    case "RECIVED_A_NEW_CHAT": {
      const newState = AddNewChatLogic(state, payload);
      return newState;
    }
    case "ADD_NEW_CONTACT_SUCCESS": {
      const newState = AddNewContactLogic(state, payload);
      return newState;
    }
    case "SENDING_NEW_MESSAGE":
    case "RECIVED_NEW_MESSAGE": {
      const newState = AddNewMessageLogic(state, payload);
      return newState;
    }
    case "LEAVING_GROUP_SUCCESS":
    case "PARTICIPANT_LEFT_CHAT": {
      const newState = LeaveGroupLogic(state, payload);
      return newState;
    }
    case "ADDING_PARTICIPANTS_TO_GROUP_SUCCESS":
    case "PARTICIPANTS_ADDED_TO_GROUP": {
      const newState = JoinNewParticipantsToGroupLogic(state, payload);
      return newState;
    }
    case "UPDATE_CHAT_PROFILEIMAGE_SUCCESS":
    case "UPDATED_CHAT_PROFILEIMAGE": {
      const newState = UpdateChatProfileImageLogic(state, payload);
      return newState;
    }
    case "UPDATE_NOTIFICATION_SUCCESS":
      return UpdateNotificationLogic(state, payload);
    case "DELETE_CONTACT_SUCCESS":
      return DeleteContactLogic(state, payload);
    case "GET_PRTICIPANT_CONNECTION_STATUS_SUCCESS":
    case "UPDATED_PRTICIPANT_CONNECTION_STATUS":
      return UserConnectionStatusLogic(state, payload);
    default:
      return state;
  }
};
