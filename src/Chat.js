import React, { useEffect, useState } from "react";

import { Comment } from "semantic-ui-react";

import Message from "./Message";

var uniqid = require("uniqid");

const Chat = (props) => {
  const [feed, setFeed] = useState({ chatID: "", data: [] });
  useEffect(() => {
    if (props.chatsTrans.chats.find((i) => i.chatID === props.activeChat)) {
      setFeed(
        props.chatsTrans.chats.find((i) => i.chatID === props.activeChat)
      );
    }
  }, [props.activeChat, props.chatsTrans]);
  useEffect(() => {
    document.getElementById("chatbottom").scrollIntoView();
  });
  return (
    <div
      style={{
        padding: "5px",
        width: "100%",
      }}
    >
      <Comment.Group>
        {feed.data.map((i) => {
          return <Message key={uniqid()} data={i} db={props.db} />;
        })}
        <div id="chatbottom"></div>
      </Comment.Group>
    </div>
  );
};

export default Chat;
