import { MdKeyboardArrowDown } from "@react-icons/all-files/md/MdKeyboardArrowDown";
import { useDispatch } from "react-redux";
import { DisplayOptionsBoard } from "../../../application/actions/optionsBoardActions";
export default function MoreOptionsToCard({ optionsBoard }) {
  const dispatch=useDispatch()
  return (
    <div
      className="arrow-display-options"
      onClick={(e) => {
        dispatch(
          DisplayOptionsBoard({
            data: optionsBoard,
            cord: { left: e.pageX, top: e.pageY },
          })
        );
      }}
    >
      <MdKeyboardArrowDown />
    </div>
  );
}
