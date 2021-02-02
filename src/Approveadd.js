import React, { useState, useEffect } from "react";

import { Modal, Button, List } from "semantic-ui-react";

var uniqid = require("uniqid");

const Approveadd = (props) => {
  const [contactSelect, setContactSelect] = useState({ id: null });
  const approveContact = (contact) => {
    if (contact.id !== null) {
      props.db
        .collection("users")
        .doc(props.user)
        .get()
        .then((doc) => {
          const contactGets = doc.data().contacts.map((i) => i.get());
          Promise.all(contactGets).then((result) => {
            props.db
              .collection("users")
              .doc(props.user)
              .set(
                {
                  contacts: result.concat(contact).map((i) => i.ref),
                },
                { merge: true }
              );
          });
          props.setAddRequests(
            props.addRequests.filter((i) => i.id !== contact.id)
          );
        });
      props.db
        .collection("users")
        .doc(contact.id)
        .get()
        .then((doc) => {
          const contactGets = doc.data().contacts.map((i) => i.get());
          Promise.all(contactGets).then((result) => {
            props.db
              .collection("users")
              .doc(contact.id)
              .set(
                {
                  contacts: result.concat(
                    props.db.collection("users").doc(props.user)
                  ),
                },
                { merge: true }
              );
          });
        });
    }
  };
  const rejectContact = (contact) => {
    if (contact !== undefined) {
      props.setAddRequests(
        props.addRequests.filter((i) => i.id !== contact.id)
      );
    }
  };
  useEffect(() => {
    if (props.user !== undefined) {
      props.db
        .collection("users")
        .doc(props.user)
        .set(
          {
            addrequests: props.addRequests.map((request) =>
              props.db.collection("users").doc(request.id)
            ),
          },
          { merge: true }
        );
    }
  }, [props.addRequests]);
  return (
    <Modal open={props.approveAddOpen}>
      <Modal.Content>
        <List selection>
          {props.addRequests.map((request) => {
            return (
              <List.Item
                key={uniqid()}
                id={request.id}
                active={contactSelect.id === request.id}
                onClick={(e) => {
                  setContactSelect(request);
                }}
              >
                {request.data().name}
              </List.Item>
            );
          })}
        </List>
      </Modal.Content>
      <Modal.Actions>
        <Button
          onClick={() => {
            approveContact(contactSelect);
          }}
        >
          Approve
        </Button>
        <Button
          onClick={() => {
            rejectContact(contactSelect);
          }}
        >
          Reject
        </Button>
        <Button
          onClick={() => {
            props.setApproveAddOpen(false);
          }}
        >
          Dismiss
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default Approveadd;
