import React from "react";
import styled from "styled-components";
import {
  SidebarSubheader,
  FilledButton,
  AdminTextField,
} from "./GlobalSidebarComponents";

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const SidebarAdminLogin = (props) => (
  <React.Fragment>
    <ButtonGroup>
      <SidebarSubheader>
        Log in as{" "}
        {props.contributor ? "Contributor (Optional)" : "Administrator"}
      </SidebarSubheader>
      <AdminTextField
        placeholder={props.contributor ? "Display Name" : "Username"}
      />
      {!props.contributor && (
        <AdminTextField
          inputType="password"
          placeholder="Password"
          type="password"
        />
      )}
      <FilledButton
        onClick={() => props.setActiveSidebar(props.contributor ? "adminHome": "contribHome")}
        style={{ marginTop: "0.4rem" }}
      >
        Log in
      </FilledButton>
    </ButtonGroup>
  </React.Fragment>
);

export default SidebarAdminLogin;
