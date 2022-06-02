import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import TextField from "../components/Inputs/texts/TextField";
import { CreateUserAction } from "../../application/actions/clientActions";
import PrimiarAnimatedBtn from "../components/Inputs/buttons/PrimiarAnimatedBtn";
export default function Register() {
  const dispatch=useDispatch()
  const [fields, setFields] = useState({
    email: null,
    name: null,
    password: null,
  });
  const [validErors, setValidErors] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [canSubmit, setCanSubmit] = useState(false);
  function SubmitToApp(e) {
    e.preventDefault();
    const data = new FormData(e.target);
    if (profileImage) data.append("profileImage", profileImage);
    if (!canSubmit) return;
    dispatch(CreateUserAction({data}));
  }
  function HandleChange(value, e) {
    const currentFields = { ...fields, [e.target.name]: value };
    const currentErrors = {};
    const validEmail = new RegExp(
      "^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$"
    );
    const validPassword = new RegExp("^(?=.*?[A-Za-z])(?=.*?[0-9]).{6,}$");
    Object.keys(currentFields).forEach((field) => {
      if (!currentFields[field]) {
        currentErrors[field] = `${field} is required`;
      }
    });
    if (!currentErrors.email && !validEmail.test(currentFields.email))
      currentErrors.email = "email is not valid";
    if (!currentErrors.password && !validPassword.test(currentFields.password))
      currentErrors.password = "password is not valid";
    if (Object.keys(currentErrors).length === 0) setCanSubmit(true);
    setValidErors(currentErrors);
    setFields(currentFields);
  }
  const navigate = useNavigate();

  return (
    <div className="continer">
      <form onSubmit={SubmitToApp}>
        <h1>Register</h1>
        <TextField placeholder="email" name="email" onChange={HandleChange} />
        <div>{validErors.email ? validErors.email : null}</div>
        <TextField placeholder="name" name="name" onChange={HandleChange} />
        <div>{validErors.name ? validErors.name : null}</div>
        <TextField
          placeholder="password"
          name="password"
          onChange={HandleChange}
        />
        <div>{validErors.password ? validErors.password : null}</div>
        <input
          type="file"
          onChange={(e) => setProfileImage(e.target.files[0])}
        />
        <PrimiarAnimatedBtn>submit</PrimiarAnimatedBtn>
      </form>
      <div>
        <Link to="/login">log in</Link>
      </div>
    </div>
  );
}
