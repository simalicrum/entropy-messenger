import React, { useState } from "react";

import { Modal, Form, Button } from "semantic-ui-react";

const Addcontact = (props) => {
  const [email, setEmail] = useState();
  const sendRequest = (email) => {
    props.db
      .collection("users")
      .where("email", "==", email)
      .get()
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          if (props.contacts.some((i) => i.id === querySnapshot.docs[0].id)) {
            console.log("You already have that contact.");
          } else {
            props.db
              .collection("users")
              .doc(querySnapshot.docs[0].id)
              .set(
                {
                  addrequests: querySnapshot.docs[0]
                    .data()
                    .addrequests.concat(
                      props.db.collection("users").doc(props.user)
                    ),
                },
                { merge: true }
              );
          }
        } else {
          console.log("That email doesn't exist.");
        }
      });
    props.setAddContactOpen(false);
  };
  return (
    <Modal open={props.addContactOpen} size="mini">
      <Modal.Header>Add Contact:</Modal.Header>

      <Modal.Content>
        <Form>
          <Form.Input
            fluid
            icon="user"
            iconPosition="left"
            placeholder="E-mail address"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button
          onClick={() => {
            props.setAddContactOpen(false);
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            sendRequest(email);
            props.setAddContactOpen(false);
          }}
          primary
        >
          Send Request
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default Addcontact;
