import React, { useState, useEffect } from "react";

import "semantic-ui-css/semantic.min.css";
import {
  Menu,
  Icon,
  Button,
  Sidebar,
  Segment,
  Header,
  Image,
} from "semantic-ui-react";

const Sidemenu = (props) => {
  const createGroupChat = (e) => {
    props.db
      .collection("chats")
      .add({
        title: e.target.title.value,
        type: "group",
        users: [props.db.doc("/users/" + props.user)],
      })
      .then((result) => {
        props.db.collection(result.id).add({
          name: props.name,
          author: props.db.doc("/users/" + props.user),
          date: props.dbFunc.Timestamp.now(),
          content: "This is the first message.",
        });
        props.db
          .collection("users")
          .doc(props.user)
          .set(
            {
              chats: props.chats.map((i) => i.chatID).concat(result.id),
            },
            { merge: true }
          );
      });
  };
};

export default Sidemenu;
