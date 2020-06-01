import React from "react";
import styled from "styled-components";
import {
  SidebarSubheader,
  ParentButton,
  EmptyButton,
} from "./GlobalSidebarComponents";

const NewContribButton = styled(ParentButton)`
  background: #626262;
  border: 0.7px solid #969696;
  box-sizing: border-box;
  border-radius: 14px;

  font-weight: 600;
  color: #d1d1d1;
  width: 100%;

  margin-top: 1rem;
  margin-bottom: 1rem;
`;

const SidebarContributionDone = (props) => (
  <React.Fragment>
    <SidebarSubheader>
      Thanks for contributing to the database! Our administrators will review
      your submission as soon as possible.
    </SidebarSubheader>
    <NewContribButton onClick={() => props.setActiveSidebar("contribHome")}>
      Submit New Contribution
    </NewContribButton>
    <EmptyButton
      style={{ width: "100%" }}
      onClick={() => props.setActiveSidebar("home")}
    >
      Log Out
    </EmptyButton>
  </React.Fragment>
);

export default SidebarContributionDone;
