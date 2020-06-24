import React from "react";
import styled from "styled-components";
import {
  SidebarSubheader,
  FilledButton,
  EmptyButton,
} from "./GlobalSidebarComponents";

const SidebarTitle = styled.h1`
  font-size: 17px;
  line-height: 163.18%;
  color: #ececec;
`;

const ButtonDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  margin-top: 2rem;
`;

const SidebarHome = React.memo((props) => (
  <React.Fragment>
    <SidebarSubheader>
      Welcome to the database of Masinloc’s Seagrass and Carbon Stocks! Log in
      as...
    </SidebarSubheader>
    <ButtonDiv>
      <FilledButton onClick={() => props.setActiveSidebar("adminLogin")}>
        Administrator
      </FilledButton>
      <EmptyButton
        marginLeft="0.4rem"
        onClick={() => props.setActiveSidebar("contribLogin")}
      >
        Contributor
      </EmptyButton>
    </ButtonDiv>
  </React.Fragment>
));

export default SidebarHome;
