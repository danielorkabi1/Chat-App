import { useMemo } from "react";
import { useSelector } from "react-redux";
export default function useGetParticipantChat(chat) {
  const {
    user: { _id },
    users: { byId: usersById },
  } = useSelector((state) => state.client);
  const participantDetails = useMemo(() => {
    return usersById[
      Object.keys(chat.participants).find((participant) => participant !== _id)
    ];
  }, [_id, usersById, chat]);
  return { participantDetails };
}
