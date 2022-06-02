import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {  SingOutAction } from "../../../application/actions/clientActions";
import PrimiarAnimatedBtn from "../Inputs/buttons/PrimiarAnimatedBtn";

export default function SingOut() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <div className="sing-out">
      <PrimiarAnimatedBtn
        onClick={() => {
          dispatch(SingOutAction());
          navigate("/");
        }}
      >
        singout
      </PrimiarAnimatedBtn>
    </div>
  );
}
