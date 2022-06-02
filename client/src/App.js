import "./App.css";
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import IndexDB from "./Utils/IndexDB/IndexDBClass";
import { OfflineAction, SendOfflineDataAction } from "./application/actions/clientActions";
const Login = React.lazy(() => import("./views/pages/Login"));
const Register = React.lazy(() => import("./views/pages/Register"));
const ChatPage = React.lazy(() => import("./views/pages/ChatPage"));
function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    window.addEventListener("offline", Offline);
    window.addEventListener("online", Online);
    function Offline() {
      dispatch(OfflineAction);
    }
    async function Online() {
      try {
        const indexDB = new IndexDB();
        await indexDB.OpenDB("ServiceWorkerDB", 1, [
          { name: "messages", option: { KeyPath: "_id" } },
        ]);
        if (localStorage.getItem("user")) {
            const data= await indexDB.GetAll('messages')
          dispatch(
            SendOfflineDataAction({
              eventName: "send-a-message",
              params:data,
            })
          );
        }
      } catch (e) {
        console.warn(e);
      }
    }
    return () => {
      window.removeEventListener("offline", Offline);
      window.removeEventListener("online", Online);
    };
  }, []);
  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/chatpage" element={<ChatPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
