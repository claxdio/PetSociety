import React, { useState } from "react";
import "./style.css";
import UserImage from "../../assets/icons/user.png";

function Chats() {
  return (
    <div className="chats">
      <div className="chats-head">
        <h1>Chats</h1>
      </div>
      <div className="chats-container">
        <div className="chats-item">
          <img src={UserImage}></img>
          <h4>User1</h4>
        </div>
        <div className="chats-item">
          <img src={UserImage}></img>
          <h4>User2</h4>
        </div>
        <div className="chats-item">
          <img src={UserImage}></img>
          <h4>User3</h4>
        </div>
      </div>
    </div>
  );
}

export default Chats;
