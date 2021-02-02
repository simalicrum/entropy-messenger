import React, { useState } from "react";

import { Modal, Form, Button, Segment, Message } from "semantic-ui-react";

import * as firebase from "firebase/app";
import "firebase/auth";

const Newuser = (props) => {
  const [email, setEmail] = useState();
  const [name, setName] = useState();
  const [password, setPassword] = useState();
  const [formError, setFormError] = useState(false);
  const [errorCode, setErrorCode] = useState();
  const [errorMessage, setErrorMessage] = useState();
  const newUserSubmit = (email, password) => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        props.db.collection("users").doc(result.user.uid).set(
          {
            name: name,
            email: result.user.email,
            chats: [],
            contacts: [],
            activeChat: null,
            addrequests: [],
          },
          { merge: false }
        );

        props.setNewUser(false);
        setFormError(false);
      })
      .catch(function (error) {
        setFormError(true);
        setErrorCode(error.code);
        setErrorMessage(error.message);
      });
  };
  return (
    <Modal size="tiny" open={props.open}>
      <Modal.Content>
        <Form onSubmit={() => newUserSubmit(email, password)} error={formError}>
          <Segment raised>
            <Form.Input
              fluid
              icon="user"
              iconPosition="left"
              placeholder="E-mail address"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <Form.Input
              fluid
              icon="lock"
              iconPosition="left"
              placeholder="User Name"
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            <Form.Input
              fluid
              icon="lock"
              iconPosition="left"
              placeholder="Password"
              type="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <Message error header={errorCode} content={errorMessage}></Message>
            <Button primary fluid size="large">
              Sign Up
            </Button>
          </Segment>
        </Form>
        <Message
          onClick={() => {
            props.setNewUser(false);
          }}
        >
          Go back
        </Message>
      </Modal.Content>
    </Modal>
  );
};

export default Newuser;
