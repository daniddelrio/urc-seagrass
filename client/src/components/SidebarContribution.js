import React, { Component } from "react";
import styled from "styled-components";
import {
  SidebarSubheader,
  EmptyButton,
  ParentButton,
  GrayButton,
  AdminTextField,
  FilledButton,
} from "./GlobalSidebarComponents";
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';

const SelectArea = styled(Form.Control)`
  background: #4F4F4F;
  border: 0.7px solid #9A9A9A;
  box-sizing: border-box;
  border-radius: 4px;

  font-size: 13px;
  line-height: 15px;
  color: ${({ inputType }) => inputType == "password" ? "#D0D0D0" : "#808080"};

  padding: 0.6rem;
  margin-bottom: 1rem;
`;

class SidebarContribution extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    return (
      <React.Fragment>
        <SidebarSubheader>Welcome, Pedro!</SidebarSubheader>
        <Form>
          <Form.Group controlId="exampleForm.SelectCustom">
            <SelectArea as="select" custom>
              <option>Choose Area</option>
              <option>Seagrass Meadow</option>
            </SelectArea>
          </Form.Group>
        </Form>
      </React.Fragment>
    );
  }
}

export default SidebarContribution;
