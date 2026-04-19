import React from "react";
import { Form, InputGroup } from "react-bootstrap";

const Custominputs = ({ label, icon, ...rest }) => {
  return (
    <Form.Group className="mb-4">
      <Form.Label className="custom-form-label">{label}</Form.Label>
      <InputGroup className="custom-input-group">
        {icon && <InputGroup.Text>{icon}</InputGroup.Text>}
        <Form.Control {...rest} />
      </InputGroup>
    </Form.Group>
  );
};

export default Custominputs;
