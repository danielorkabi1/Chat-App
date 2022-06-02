    import { combineEpics } from "redux-observable";
import {
  SignInEpic,
  CreateNewPrivateChatIfNotExistsEpic,
  GetMessagesOfChatEpic,
  LeaveGroupEpic,
  UpdateChatProfileImageEpic,
  JoinNewParticipantsEpic,
  UpdateNotificationEpic,
  ResetNotificationEpic,
  CreateUserEpic,
  AddNewContactEpic,
  CreateGroupChatEpic,
  DeleteContactEpic,
  GetUserConnectionStatusEpic,
} from "./FetchEpics";

export const rootEpic = combineEpics(
  SignInEpic,
  CreateNewPrivateChatIfNotExistsEpic,
  GetMessagesOfChatEpic,
  LeaveGroupEpic,
  UpdateChatProfileImageEpic,
  JoinNewParticipantsEpic,
  UpdateNotificationEpic,
  ResetNotificationEpic,
  CreateUserEpic,
  AddNewContactEpic,
  CreateGroupChatEpic,
  DeleteContactEpic,
  GetUserConnectionStatusEpic
);