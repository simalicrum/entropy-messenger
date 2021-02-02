import React, { useState, useEffect } from "react";

import { Form } from "semantic-ui-react";

import Chat from "./Chat";
import Groupcontacts from "./Groupcontacts";

const Main = (props) => {
  const [chatTitle, setChatTitle] = useState(" ");
  const [chatDescription, setChatDescription] = useState();
  const handleSend = (e) => {
    e.preventDefault();
    props.db
      .collection(props.activeChat)
      .add({
        name: props.name,
        author: props.db.doc("/users/" + props.user),
        date: props.dbFunc.Timestamp.now(),
        content: e.target.reply.value,
      })
      .catch(function (error) {
        console.error("Error adding document: ", error);
      })
      .then(() => {
        e.target.reply.value = "";
      });
  };
  const popUpContactAdd = () => {};
  useEffect(() => {
    const activeChatObject = props.chats.find(
      (i) => i.chatID === props.activeChat
    );
    if (activeChatObject !== undefined) {
      switch (activeChatObject.type) {
        case "private":
          let chatOther = activeChatObject.users.find(
            (i) => i.id !== props.user
          );
          if (
            props.users.find((i) => i.userID === chatOther.id) !== undefined
          ) {
            setChatTitle(
              props.users.find((i) => i.userID === chatOther.id).name
            );
          }
          setChatDescription("last seen some time ago");
          break;
        case "group":
          setChatTitle(activeChatObject.title);
          setChatDescription(activeChatObject.users.length + " members");
          break;
        default:
          break;
      }
    }
  });
  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        flex: 1,
        height: "100%",
      }}
    >
      <div style={{ padding: "5px", height: "48px" }}>
        <b>{chatTitle}</b>
        <div>{chatDescription}</div>
      </div>
      <div
        style={{
          flex: 1,
          overflowY: "scroll",
        }}
      >
        <Chat chatsTrans={props.chatsTrans} activeChat={props.activeChat} />
      </div>
      <div
        style={{
          flex: "0 0 auto",
          height: "40px",
        }}
      >
        {" "}
        <Form
          onSubmit={handleSend}
          style={{ marginLeft: "10px", height: "40px" }}
        >
          <Form.Input
            transparent
            style={{ height: "40px" }}
            id="reply"
            name="reply"
            placeholder="Write a message..."
          />
        </Form>
      </div>

      <Groupcontacts />
    </div>
  );
};

export default Main;
