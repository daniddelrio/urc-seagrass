import React from "react";
import styled from "styled-components";
import { SidebarSubheader, FilledButton } from "./GlobalSidebarComponents";

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const AdminTextField = styled.input`
  flex: 1;
  type: ${(type) => type || "text" }

  background: #4F4F4F;
  border: 0.7px solid #9A9A9A;
  box-sizing: border-box;
  border-radius: 4px;

  font-size: 13px;
  line-height: 15px;
  color: #808080;

  padding: 0.6rem;
  margin-bottom: 1rem;
`;

const SidebarAdminLogin = (props) => (
  <React.Fragment>
    <ButtonGroup>
      <SidebarSubheader>
        Log in as Administrator
      </SidebarSubheader>
      <AdminTextField placeholder="Username"/>
      <AdminTextField placeholder="Password" type="password" />
      <FilledButton>Log in</FilledButton>
    </ButtonGroup>
  </React.Fragment>
);

export default SidebarAdminLogin;
