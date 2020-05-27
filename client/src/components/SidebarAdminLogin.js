import React from "react";
import styled from "styled-components";
import { SidebarSubheader, FilledButton, AdminTextField } from "./GlobalSidebarComponents";

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const SidebarAdminLogin = (props) => (
  <React.Fragment>
    <ButtonGroup>
      <SidebarSubheader>
        Log in as Administrator
      </SidebarSubheader>
      <AdminTextField placeholder="Username"/>
      <AdminTextField inputType="password" placeholder="Password" type="password" />
      <FilledButton onClick={() => props.setActiveSidebar("adminHome")}>Log in</FilledButton>
    </ButtonGroup>
  </React.Fragment>
);

export default SidebarAdminLogin;
