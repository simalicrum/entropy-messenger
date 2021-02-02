import React, { useState } from "react";

import { Modal, Form, Button, List } from "semantic-ui-react";

const Addgroup = (props) => {
  const [group, setGroup] = useState("");
  return (
    <Modal open={props.open} size="mini">
      <Modal.Header>Add Group</Modal.Header>
      <Modal.Content>
        <Form onSubmit={() => {}}>
          <Form.Input
            fluid
            icon="group"
            iconPosition="left"
            placeholder="Group name"
            onChange={(e) => {
              setGroup(e.target.value);
            }}
          />
        </Form>
        <List></List>
      </Modal.Content>
      <Modal.Actions>
        <Button
          onClick={() => {
            props.setAddGroup(false);
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            if (group.length > 0) {
              props.setGroupAddName(group);
              props.setGroupContacts(true);
              props.setAddGroup(false);
            }
          }}
          primary
        >
          Next
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default Addgroup;
