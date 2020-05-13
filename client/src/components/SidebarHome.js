import React from "react";
import styled from "styled-components";
import PayPal from "../assets/paypal.svg";
import { MAX_WIDTH } from "./GlobalDeviceWidths";
import {
  SidebarSubheader,
  FilledButton,
  EmptyButton,
  ParentButton,
} from "./GlobalSidebarComponents";
import MediaQuery from "react-responsive";

const SidebarTitle = styled.h1`
  font-size: 17px;
  line-height: 163.18%;
  color: #ececec;
`;

const ButtonDiv = styled.div`
  display: flex;
  width: 100%;
  margin-top: 2rem;
`;

const PayPalDiv = styled(ButtonDiv)`
  position: absolute;
  bottom: 2rem;
  align-items: center;
`;

const PayPalText = styled(SidebarSubheader)`
  font-size: 13px;
  flex: 0.75;
`;

const PayPalButton = styled(ParentButton)`
  padding: 0.2rem;
  padding-left: 1rem;
  padding-right: 1rem;
  background: #ffbc32;
  color: #63470f;
  width: ${({ isSmallMobile }) => (isSmallMobile ? "80%" : "auto")};

  display: flex;
  align-items: center;
  justify-content: center;
`;

const paypalMinWidth = 420;

const SidebarHome = (props) => (
  <React.Fragment>
    <SidebarSubheader>
      Welcome to the database of Masinloc’s Seagrass and Carbon Stocks! Log in
      as...
    </SidebarSubheader>
    <ButtonDiv>
      <FilledButton onClick={() => props.setActiveSidebar("adminLogin")}>
        Administrator
      </FilledButton>
      <EmptyButton marginLeft="0.4rem">Contributor</EmptyButton>
    </ButtonDiv>

    <PayPalDiv>
      <MediaQuery minDeviceWidth={paypalMinWidth}>
        <PayPalText>Want to help the initiative?</PayPalText>
      </MediaQuery>
      <PayPalButton isSmallMobile={window.innerWidth <= paypalMinWidth}>
        Support us via &nbsp;
        <img src={PayPal} alt="Paypal Logo" />
      </PayPalButton>
    </PayPalDiv>
  </React.Fragment>
);

export default SidebarHome;
