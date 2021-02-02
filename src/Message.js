import React from "react";
import { parseTime } from "./Time";

import { Comment } from "semantic-ui-react";

const Message = (props) => {
  return (
    <Comment>
      <Comment.Avatar src="https://react.semantic-ui.com/images/avatar/small/matt.jpg" />
      <Comment.Content>
        <Comment.Author as="a">{props.data.name}</Comment.Author>
        <Comment.Metadata>
          <div>{parseTime(props.data.date)}</div>
        </Comment.Metadata>
        <Comment.Text>
          {props.data.content === "" ? <br /> : props.data.content}
        </Comment.Text>
      </Comment.Content>
    </Comment>
  );
};

export default Message;
