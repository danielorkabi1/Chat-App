import React from "react";
import ProfileImg from "../profileImg/ProfileImg";
const CardStyle = function (props) {
    const { img, onClick, mainSub, seconderySub } = props;
    return (
      <div onClick={onClick} className="card">
        <ProfileImg profileImage={img} />
        <div>
          <div className="main-sub">{mainSub}</div>
          <div className="secondery-sub">{seconderySub}</div>
        </div>
      </div>
    );
};
export default CardStyle;
