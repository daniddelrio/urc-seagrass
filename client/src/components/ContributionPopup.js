import React from "react";
import styled from "styled-components";
import { ParentButton } from "./GlobalSidebarComponents";

const BaseFrame = styled.div`
  background: #5a5a5a;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.15);
  border-radius: 6px;

  width: 80%;
  max-height: 30%;
`;

const Header = styled.h1`
  font-size: 14px;
  color: ${(props) => (props.isApprove ? "" : "#EC7E7E")};
`;

const Contributions = styled.ul`
  overflow-y: hidden;
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
  <BaseFrame>
    <Header isApprove={props.isApprove}>{`Are you sure to ${
      props.isApprove ? "approve" : "deny"
    }...`}</Header>
    <Contributions>
      {Object.entries(props.data).map(([key, value]) => (
        <li>
          Change {value.label} {value.fromValue && "from " + value.fromValue} to{" "}
          {value.toValue}
        </li>
      ))}
    </Contributions>
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
