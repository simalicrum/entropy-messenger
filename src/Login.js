import React, { useState } from "react";

import { Modal, Form, Button, Segment, Message } from "semantic-ui-react";

import Newuser from "./Newuser";

const Login = (props) => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [newUser, setNewUser] = useState(false);
  return (
    <Modal size="tiny" open={props.open}>
      <Modal.Header>Welcome to Entropy. Please log in:</Modal.Header>
      <Modal.Content>
        <Form
          onSubmit={() => props.loginSubmit(email, password)}
          error={props.loginError}
        >
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
              placeholder="Password"
              type="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <Message
              error
              header={props.loginErrorCode}
              content={props.loginErrorMessage}
            ></Message>
            <Button primary fluid size="large">
              Login
            </Button>
          </Segment>
        </Form>
        <Segment raised>
          <Button primary fluid size="large" onClick={props.googleLoginSubmit}>
            Login with Google
          </Button>
        </Segment>
        <Message>
          Don't have an account?{" "}
          <a
            onClick={() => {
              setNewUser(true);
            }}
          >
            Sign Up
          </a>
          <Newuser open={newUser} db={props.db} setNewUser={setNewUser} />
        </Message>
      </Modal.Content>
    </Modal>
  );
};

export default Login;
