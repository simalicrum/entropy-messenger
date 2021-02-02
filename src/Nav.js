import React from "react";

import { Input, Menu, Form, Icon } from "semantic-ui-react";

import Navitem from "./Navitem";

import "./Sidebar.css";

var uniqid = require("uniqid");

const Nav = (props) => {
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
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          alignContent: "center",
          padding: "5px",
        }}
      >
        <Icon
          name="content"
          size="large"
          onClick={() => {
            props.setVisible(true);
          }}
          style={{
            marginLeft: "10px",
            marginRight: "16px",
          }}
        />
        <Form style={{ flexGrow: "1", height: "38px" }}>
          <Input transparent style={{ height: "38px" }} placeholder="Search" />
        </Form>
      </div>
      <Menu
        secondary
        vertical
        fluid
        style={{
          marginTop: "0px",
          flex: "1",
          overflowY: "auto",
        }}
      >
        {props.chats.map((chat) => {
          if (
            props.chatsTrans.chats.find((i) => chat.chatID === i.chatID) !==
            undefined
          ) {
            if (chat.type === "private") {
              let chatOther = chat.users.find((i) => i.id !== props.user);
              let user = props.users.find((i) => i.userID === chatOther.id);
              if (user !== undefined) {
                var title = user.name;
              }
            } else {
              var title = chat.title;
            }
            return (
              <Navitem
                chat={chat}
                chatTrans={props.chatsTrans.chats.find(
                  (i) => chat.chatID === i.chatID
                )}
                user={props.user}
                users={props.users}
                setActiveChat={props.setActiveChat}
                activeChat={props.activeChat}
                title={title}
                key={uniqid()}
                dbFunc={props.dbFunc}
              />
            );
          }
        })}
      </Menu>
    </div>
  );
};

export default Nav;
