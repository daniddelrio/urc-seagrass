import React, { Component } from "react";
import styled from "styled-components";
import SidebarHome from "./SidebarHome";
import SidebarAdminLogin from "./SidebarAdminLogin";
import SidebarAdminHome from "./SidebarAdminHome";
import PayPal from "../assets/paypal.svg";
import { MAX_WIDTH } from "./GlobalDeviceWidths";
import MediaQuery from "react-responsive";
import { SidebarSubheader, ParentButton } from "./GlobalSidebarComponents";

const SidebarFrame = styled.div`
  position: relative;
  width: ${({ isOpen, isMobile }) =>
    isOpen ? (isMobile ? "80%" : "40%") : "0"};
  background: #474747;
  overflow: hidden;

  padding: ${({ isOpen }) => (isOpen ? "2rem" : "0")};
  z-index: 15;
  transition: width 0.5s;
`;

const SidebarTitle = styled.h1`
  font-size: 17px;
  line-height: 163.18%;
  color: #ececec;
`;

const PayPalDiv = styled.div`
  display: flex;
  width: 100%;
  margin-top: 2rem;

  position: absolute;
  bottom: 2rem;
  align-items: center;
`;

const PayPalText = styled(SidebarSubheader)`
  font-size: 13px;
  flex: 0.75;
`;

const ButtonDiv = styled.div`
  display: flex;
  width: 100%;
  margin-top: 2rem;
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

class BaseSidebar extends Component {
  componentDidMount() {
    window.addEventListener("resize", null);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", null);
  }

  renderContent() {
    switch (this.props.activeSidebar) {
      case "home":
        return <SidebarHome setActiveSidebar={this.props.setActiveSidebar} />;
      case "adminLogin":
        return (
          <SidebarAdminLogin setActiveSidebar={this.props.setActiveSidebar} />
        );
      case "adminHome":
        return (
          <SidebarAdminHome setActiveSidebar={this.props.setActiveSidebar} />
        );
    }
  }

  render() {
    return (
      <SidebarFrame isOpen={this.props.isOpen} isMobile={this.props.isMobile}>
        <SidebarTitle>URC Seagrass & Carbon Stocks Database</SidebarTitle>
        {this.renderContent()}
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
