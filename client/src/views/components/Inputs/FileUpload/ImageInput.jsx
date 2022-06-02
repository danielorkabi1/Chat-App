import React from "react";
import ProfileImg from "../../profileImg/ProfileImg";
export default function ImageInput({profileImage,cb}){ 
      function UpdateprofileImage(e) {
        const image=e.target.files[0]
        if(validFileType(image))
        {
            cb(image)
        }
      }  
    function validFileType(file) {
        const fileTypes = [
            "image/apng",
            "image/bmp",
            "image/gif",
            "image/jpeg",
            "image/pjpeg",
            "image/png",
            "image/svg+xml",
            "image/tiff",
            "image/webp",
            "image/x-icon",
        ];
        return fileTypes.includes(file.type);
    } 
    return (
      <label onClick={(e) => e.stopPropagation()} htmlFor="profileImage">
        <input
          type="file"
          onInput={UpdateprofileImage}
          accept="image/*"
          name="profileImage"
          id="profileImage"
          style={{ display: "none" }}
        />
        <ProfileImg
          profileImage={profileImage ? profileImage : "anonymousProfile.jpg"}
        />
      </label>
    );

}