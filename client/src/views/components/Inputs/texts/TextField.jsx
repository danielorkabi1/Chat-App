import React from "react";
export default function TextField({onChange,placeholder,name}){
   return (
      <div className="continer-text-field">
         <label> 
         <input type={'text'} placeholder=" " name={name} className='text-field' onChange={(e)=>onChange(e.target.value,e)}/>
            <div className="label-text-field">
               {placeholder}
            </div>
         </label> 
      </div>
   )
}