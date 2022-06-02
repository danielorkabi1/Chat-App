import React, { useEffect, useState } from "react";
import SingOut from "../components/singout/SingOut";
import SideBar from "../components/bars/SideBar";
import MainBar from "../components/bars/MainBar";
import { useDispatch, useSelector } from "react-redux";
import { SetUserAction } from "../../application/actions/clientActions";
import { useNavigate } from "react-router-dom";
import { withLazyComponent } from "../components/HOC/WithLazyComponent";
const OptionsBoard =React.lazy(()=>import("../components/options/OptionsBoard")) ;
const LazyOptionsBoard = withLazyComponent(OptionsBoard);
export default function ChatPage() {
  const dispatch = useDispatch();
  const { client } = useSelector((state) => state);
  const navigate = useNavigate();
  useEffect(() => {
    const loadedUser = localStorage.getItem("user");
    if (loadedUser) {
      if (!client) {
        const user = JSON.parse(loadedUser);
        dispatch(
          SetUserAction({ email: user.user.email, password: user.user.pass })
        );
      }
    } else navigate("/Login");
  }, [client]);
  return !client ? null : (
    <div className="chats-page">
      <SingOut />
      <SideBar />
      <MainBar />
      <LazyOptionsBoard />
    </div>
  );
}
