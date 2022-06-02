import { loadingTypes } from "../../Utils/loading/loadingTypes";

export const loadingRuducer = (state = false, action) => {
  let { type } = action;
  switch (type) {
    case "SIGN_IN":
    case "CREATE_USER":
    case "CREATE_NEW_PRIVATE_CHAT_IF_NOT_EXISTS":
    case "ADD_NEW_CONTACT":
    case "LEAVING_GROUP":
    case "ADDING_PARTICIPANTS_TO_GROUP":
    case "CREATING_A_NEW_GRUOP_CHAT":
    case "GET_PRTICIPANT_CONNECTION_STATUS":
    case "UPDATE_CHAT_PROFILEIMAGE":
    case "RECIVED_NEW_MESSAGE":
    case "PARTICIPANT_LEFT_CHAT":
    case "PARTICIPANTS_ADDED_TO_GROUP":
    case "RECIVED_A_NEW_CHAT":
    case "DELETE_CONTACT":
      return {isLoading:true};
    case "SELECT_CHAT":
    case "GET_MESSAGES_OF_CHAT":
      return loadingTypes.mainBar;
      case 'FETCH_FAILED':
        return loadingTypes.fetchFaild
    default:
      return {isLoading:false};
  }
};
