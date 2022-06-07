import React, { useEffect, useState } from "react";
import "../../App.css";
import { Link, useNavigate } from "react-router-dom";
import TextField from "../components/Inputs/texts/TextField";
import { useDispatch, useSelector } from "react-redux";
import { SetUserAction } from "../../application/actions/clientActions";
import Loader from "../components/loading/Lodaer";
import PrimiarAnimatedBtn from "../components/Inputs/buttons/PrimiarAnimatedBtn";
import Error from "../components/alerts/Errors";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    client,
    isLoading: { isLoading ,fetchFaild},
  } = useSelector((state) => state);
  const [errorFields,setErrorFields]=useState('')
  function Submit(e) {
    e.preventDefault();
    if(!email ||!password){
      setErrorFields('Please enter email and password')
      return
    }
    else
      if(errorFields)
        setErrorFields('')
    dispatch(SetUserAction({ email, password }));
  }
  useEffect(() => {
    const loadedUser = localStorage.getItem("user");
    if (loadedUser) {
      if (!client) {
        const user = JSON.parse(loadedUser);
        dispatch(
          SetUserAction({ email: user.user.email, password: user.user.pass })
        );
      }
      navigate("/chatpage");
    }
  }, [client]);
  if (!isLoading) {
    return (
      <div className="continer">
        <form className="login" onSubmit={Submit}>
          <h1>Login</h1>
          {fetchFaild ? (
            <Error data="Not Found User" />
          ) : errorFields ? (
            <Error data={errorFields} />
          ) : null}
          <TextField placeholder="email" onChange={setEmail} />
          <TextField
            placeholder="password"
            type="password"
            onChange={setPassword}
          />
          <PrimiarAnimatedBtn>login</PrimiarAnimatedBtn>
        </form>
        <Link to="/register">register</Link>
      </div>
    );
  }
  return <Loader />
}
  
