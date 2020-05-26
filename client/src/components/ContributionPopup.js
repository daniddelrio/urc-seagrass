import React from "react";
import styled from "styled-components";
import { ParentButton } from "./GlobalSidebarComponents";
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';

const BaseFrame = styled(Modal)`
  font-family: Open Sans;
  font-style: normal;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.15);
  border-radius: 6px;

  &.special-modal-content .modal-content {
    width: 100%;
    background: #5A5A5A;
    padding: 1.5rem;
  }
`;

const Header = styled.div`
  font-size: 1.3em;
  color: ${(props) => (props.isApprove ? "#85B790" : "#EC7E7E")};
`;

const Contributions = styled.ul`
  overflow-y: hidden;
  font-size: 0.8em;
  color: #BABABA;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const ApproveButton = styled(ParentButton)`
  background: #5e8968;
  border: 0.7px solid #85b790;
  box-sizing: border-box;
  border-radius: 14px;

  color: #b4d9bc;
`;

const DenyButton = styled(ParentButton)`
  background: #8a5555;
  border: 0.7px solid #c28a8a;
  box-sizing: border-box;
  border-radius: 14px;

  color: #e38787;
`;

const ContributionPopup = (props) => (
  <BaseFrame show={props.show} onHide={props.closeModal} className="special-modal-content">
    <Header isApprove={props.isApprove} closeButton>{`Are you sure to ${
      props.isApprove ? "approve" : "deny"
    }...`}</Header>
    <Modal.Body>
      <Contributions>
        {Object.entries(props.data).map(([key, value]) => (
          <li>
            Change {value.label} {value.fromValue && "from " + value.fromValue} to{" "}
            {value.toValue}
          </li>
        ))}
      </Contributions>
    </Modal.Body>
    <ButtonGroup>
      {props.isApprove ? (
        <ApproveButton>Approve</ApproveButton>
      ) : (
        <DenyButton>Deny</DenyButton>
      )}
    </ButtonGroup>
  </BaseFrame>
);

export default ContributionPopup;