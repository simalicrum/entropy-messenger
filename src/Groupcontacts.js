import React, { useState, useEffect } from "react";

import { Modal, Button, List, Form } from "semantic-ui-react";

var uniqid = require("uniqid");

const Groupcontacts = (props) => {
  const [contacts, setContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
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
  const handleClick = (contact) => {
    if (selectedContacts.find((i) => i.id === contact.id)) {
      setSelectedContacts(selectedContacts.filter((i) => i.id !== contact.id));
    } else {
      setSelectedContacts(selectedContacts.concat(contact));
    }
  };
  const createGroupChat = () => {
    props.db
      .collection("chats")
      .add({
        title: props.groupAddName,
        type: "group",
        users: [],
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
          .update({
            chats: props.dbFunc.FieldValue.arrayUnion(result.id),
          });
        props.db
          .collection("chats")
          .doc(result.id)
          .update({
            users: props.dbFunc.FieldValue.arrayUnion(
              props.db.doc("/users/" + props.user)
            ),
          });
        selectedContacts.forEach((i) => {
          props.db
            .collection("chats")
            .doc(result.id)
            .update({
              users: props.dbFunc.FieldValue.arrayUnion(
                props.db.doc("/users/" + i.id)
              ),
            });
          props.db
            .collection("users")
            .doc(i.id)
            .update({
              chats: props.dbFunc.FieldValue.arrayUnion(result.id),
            });
        });
      });
  };
  return (
    <Modal open={props.open} size="mini">
      <Modal.Header>Add Members:</Modal.Header>
      <Modal.Content>
        <Form>
          {" "}
          <Form.Input
            fluid
            icon="search"
            iconPosition="left"
            placeholder="Search"
            onChange={(e) => {}}
          />
        </Form>
        <List selection>
          {contacts.map((contact) => {
            return (
              <List.Item
                key={uniqid()}
                active={selectedContacts.find((i) => i.id === contact.id)}
                onClick={(e) => {
                  handleClick(contact);
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
            props.setGroupContacts(false);
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            createGroupChat(selectedContacts);
            props.setGroupContacts(false);
          }}
          primary
        >
          Create
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default Groupcontacts;
