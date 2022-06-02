import React from "react";
export default function Image({ profileImage }) {
  return <img src={`http://localhost:3010/${profileImage}`} alt="Logo" />;
}
