import React, { Component } from "react";
import styled from "styled-components";
import SidebarHome from "./SidebarHome";
import SidebarAdminLogin from "./SidebarAdminLogin";
import SidebarAdminHome from "./SidebarAdminHome";
import PayPal from "../assets/paypal.svg";
import { MAX_WIDTH, PAYPAL_WIDTH } from "./GlobalDeviceWidths";
import MediaQuery from "react-responsive";
import { SidebarSubheader, ParentButton, EmptyButton } from "./GlobalSidebarComponents";

const ParentDiv = styled.div`
  width: ${({ isOpen, isMobile }) =>
    isOpen ? (isMobile ? "80%" : "40%") : "0"};
  height: 98vh;
  background: #474747;
  z-index: 15;
  transition: width 0 .5s;
  padding: ${({ isOpen }) => (isOpen ? "2rem" : "0")};
  overflow: auto;
`;

const SidebarContent = styled.div`
  position: relative;
  height: 80%;
`;

const SidebarTitle = styled.h1`
  font-size: 17px;
  line-height: 163.18%;
  color: #ececec;
`;

const BottomDiv = styled.div`
  height: 20%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;
  // position: absolute;
  // bottom: ${({ isSmall }) => (isSmall ? "2.0rem" : "2.0rem")};

// const PayPalText = styled(SidebarSubheader)`
//   font-size: 13px;
// `;

  // width: ${({ isSmallMobile }) => (isSmallMobile ? "80%" : "auto")};
const PayPalButton = styled(ParentButton)`
  margin-top: 1rem;
  padding: 0.2rem;
  padding-left: 1rem;
  padding-right: 1rem;
  background: #ffbc32;
  color: #63470f;
  width: auto;

  display: flex;
  align-items: center;
  justify-content: center;
`;

class BaseSidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogoutPresent: false, 
    };
  }

  componentDidMount() {
    window.addEventListener("resize", null);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", null);
  }

  showLogoutButton = () => {
    this.setState({isLogoutPresent: true});
  };

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
          <SidebarAdminHome setActiveSidebar={this.props.setActiveSidebar} showLoginButton={this.showLogoutButton}/>
        );
    }
  }

  render() {
    return (
      <ParentDiv isOpen={this.props.isOpen} isMobile={this.props.isMobile}>
        <SidebarContent>
          <SidebarTitle>URC Seagrass & Carbon Stocks Database</SidebarTitle>
          {this.renderContent()}
        </SidebarContent>
        <BottomDiv isSmall={window.innerWidth <= PAYPAL_WIDTH}>
          {/*<MediaQuery minDeviceWidth={PAYPAL_WIDTH}>
            <PayPalText>Want to help the initiative?</PayPalText>
          </MediaQuery>*/}
          {this.state.isLogoutPresent && <EmptyButton noFlex>
            Log out
          </EmptyButton>}
          <PayPalButton>
            Support us via &nbsp;
            <img src={PayPal} alt="Paypal Logo" />
          </PayPalButton>
        </BottomDiv>
      </ParentDiv>
    );
  }
}

export default BaseSidebar;
