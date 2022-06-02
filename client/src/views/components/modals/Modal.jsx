import React from 'react';
import '../../../App.css'
import BtnPrimary from '../Inputs/buttons/BtnPrimary';
import BtnSecondary from '../Inputs/buttons/BtnSecondary';
export default function Modal(props) {
  const { children,clickHandler,close } = props;
  return (
    <div className="modal-cover" onClick={close}>
      <div className="modal-Container" onClick={(e)=>{e.stopPropagation()}} > 
          {children}
          <BtnSecondary onClick={close} value="close"/>
          <BtnPrimary onClick={clickHandler} value="create"/>
      </div>
    </div>
  );
}
