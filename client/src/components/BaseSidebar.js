import React, { Component } from "react";
import styled from "styled-components";
import PayPal from "../assets/paypal.svg";
import { MAX_WIDTH } from "./GlobalDeviceWidths";
import MediaQuery from 'react-responsive';

const SidebarFrame = styled.div`
  position: relative;
  width: ${({ isOpen, isMobile }) =>
    isOpen ? (isMobile ? "80%" : "40%") : "0"};
  height: 88vh;
  background: #474747;
  overflow: hidden;

  right: 0;
  padding: ${({ isOpen }) => (isOpen ? "2rem" : "0")};
  z-index: 15;
  transition: width 0.5s;
`;

const SidebarTitle = styled.h1`
  font-size: 17px;
  line-height: 163.18%;
  color: #ececec;
`;

const SidebarSubheader = styled.h1`
  font-size: 14px;
  line-height: 198.18%;
  color: #9f9f9f;
`;

const ButtonDiv = styled.div`
  display: flex;
  width: 100%;
  margin-top: 2rem;
`;

const ParentButton = styled.button`
  padding: 0.5rem;

  border-radius: 15.5px;
  box-sizing: border-box;

  font-weight: 600;
  font-size: 10px;
  line-height: 12px;
  text-align: center;
`;

const FilledButton = styled(ParentButton)`
  flex: 1;
  background: #c4c4c4;
  border: 0.7px solid #c4c4c4;

  color: #474747;
`;

const EmptyButton = styled(ParentButton)`
  flex: 1;
  background: #474747;
  border: 0.7px solid #c4c4c4;
  margin-left: ${(props) => props.marginLeft || 0};

  color: #c4c4c4;
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
  width: ${({ isSmallMobile }) => isSmallMobile ? "80%" : "auto"};

  display: flex;
  align-items: center;
  justify-content: center;
`;

class BaseSidebar extends Component {
  componentDidMount() {
    window.addEventListener("resize", null);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", null);
  }

  render() {
    const paypalMinWidth = 420;

    return (
      <SidebarFrame isOpen={this.props.isOpen} isMobile={this.props.isMobile}>
        <SidebarTitle>URC Seagrass & Carbon Stocks Database</SidebarTitle>
        <SidebarSubheader>
          Welcome to the database of Masinloc’s Seagrass and Carbon Stocks! Log
          in as...
        </SidebarSubheader>
        <ButtonDiv>
          <FilledButton>Administrator</FilledButton>
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
      </SidebarFrame>
    );
  }
}

export default BaseSidebar;
