import React, { useState } from "react";

import { Menu, Comment, Icon } from "semantic-ui-react";

import { parseTime, parseDate, dayEquality } from "./Time";

const Navitem = (props) => {
  const [activeChat, setActiveChat] = useState(props.activeChat);
  return (
    <Menu.Item
      name={props.title}
      onClick={() => {
        props.setActiveChat(props.chat.chatID);
        setActiveChat(props.chat.chatID);
      }}
      active={props.chat.chatID === props.activeChat}
    >
      <Comment.Group>
        <Comment>
          <Comment.Avatar src="https://react.semantic-ui.com/images/avatar/small/matt.jpg" />
          <Comment.Content>
            <Comment.Author as="a">
              {props.chat.type === "group" ? <Icon name="users" /> : ""}
              {props.title}
            </Comment.Author>
            <Comment.Metadata>
              {dayEquality(
                props.chatTrans.data[props.chatTrans.data.length - 1].date,
                props.dbFunc.Timestamp.now()
              )
                ? parseTime(
                    props.chatTrans.data[props.chatTrans.data.length - 1].date
                  )
                : parseDate(
                    props.chatTrans.data[props.chatTrans.data.length - 1].date
                  )}
            </Comment.Metadata>
            <Comment.Text
              style={{
                height: "16px",
              }}
            >
              {" "}
              <div
                style={{
                  display: "flex",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                <div style={{ marginRight: "5px" }}>
                  {props.chatTrans.data[props.chatTrans.data.length - 1].author
                    .id === props.user
                    ? "You:"
                    : props.chatTrans.data[props.chatTrans.data.length - 1]
                        .name + ":"}
                </div>
                <div
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {
                    props.chatTrans.data[props.chatTrans.data.length - 1]
                      .content
                  }
                </div>
              </div>
            </Comment.Text>
          </Comment.Content>
        </Comment>
      </Comment.Group>
    </Menu.Item>
  );
};

export default Navitem;
