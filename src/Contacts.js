import React, { useState, useEffect } from "react";

import { Modal, Button, List } from "semantic-ui-react";

import Addcontact from "./Addcontact";

var uniqid = require("uniqid");

const Contacts = (props) => {
  const [contacts, setContacts] = useState([]);
  const [addContactOpen, setAddContactOpen] = useState(false);
  const startPrivateChat = (user) => {
    let privateChatExists = [];
    const chatGets = props.chats.map((chat) =>
      props.db.collection("chats").doc(chat.chatID).get()
    );
    Promise.all(chatGets).then((result) => {
      privateChatExists = result.filter((i) => {
        return (
          i.data().type === "private" &&
          i.data().users.some((j) => user.id === j.id)
        );
      });
      if (privateChatExists.length === 0) {
        props.db
          .collection("chats")
          .add({
            type: "private",
            users: [
              props.db.doc("/users/" + props.user),
              props.db.doc("/users/" + user.id),
            ],
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
            props.db
              .collection("users")
              .doc(user.id)
              .set(
                {
                  chats: props.chats.map((i) => i.chatID).concat(result.id),
                },
                { merge: true }
              );
          });
      } else {
        props.setActiveChat(privateChatExists[0].id);
        props.setOpenContacts(false);
      }
    });
  };
  useEffect(() => {
    if (props.user !== undefined) {
      props.db
        .collection("users")
        .doc(props.user)
        .get()
        .then((doc) => {
          const contactGets = doc
            .data()
            .contacts.map((contact) => contact.get());
          Promise.all(contactGets).then((result) => {
            setContacts(
              result.map((contact) => {
                return { name: contact.data().name, id: contact.id };
              })
            );
          });
        });
    }
  }, [props.open]);
  return (
    <Modal open={props.open} size="mini">
      <Modal.Header>Contacts</Modal.Header>
      <Modal.Content>
        <List selection>
          {contacts.map((contact) => {
            return (
              <List.Item
                key={uniqid()}
                onClick={(e) => {
                  startPrivateChat(contact);
                  props.setOpenContacts(false);
                }}
              >
                {contact.name}
              </List.Item>
            );
          })}
        </List>
      </Modal.Content>
      <Modal.Actions>
        <Button
          onClick={() => {
            setAddContactOpen(true);
          }}
          primary
        >
          Add Contact
        </Button>
        <Button
          onClick={() => {
            props.setOpenContacts(false);
          }}
        >
          Close
        </Button>
      </Modal.Actions>
      <Addcontact
        db={props.db}
        user={props.user}
        contacts={contacts}
        addContactOpen={addContactOpen}
        setAddContactOpen={setAddContactOpen}
      />
    </Modal>
  );
};

export default Contacts;
