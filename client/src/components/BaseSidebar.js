import React, { Component } from "react";
import styled from "styled-components";
import SidebarHome from "./SidebarHome";
import SidebarAdminLogin from "./SidebarAdminLogin";
import SidebarAdminHome from "./SidebarAdminHome";
import PayPal from "../assets/paypal.svg";
import { MAX_WIDTH, PAYPAL_WIDTH } from "./GlobalDeviceWidths";
import MediaQuery from "react-responsive";
import { SidebarSubheader, ParentButton, EmptyButton } from "./GlobalSidebarComponents";

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

const BottomDiv = styled.div`
  display: flex;
  flex-direction: column;
  width: ${({ isSmall }) => (isSmall ? "80%" : "85%")};

  position: absolute;
  bottom: ${({ isSmall }) => (isSmall ? "2.0rem" : "2.0rem")};
`;

// const PayPalText = styled(SidebarSubheader)`
//   font-size: 13px;
// `;

const ButtonDiv = styled.div`
  display: flex;
  width: 100%;
  margin-top: 2rem;
`;

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
      isLoginPresent: false, 
    };
  }

  componentDidMount() {
    window.addEventListener("resize", null);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", null);
  }

  showLoginButton = () => {
    this.setState({isLoginPresent: true});
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
          <SidebarAdminHome setActiveSidebar={this.props.setActiveSidebar} showLoginButton={this.showLoginButton}/>
        );
    }
  }

  render() {
    return (
      <SidebarFrame isOpen={this.props.isOpen} isMobile={this.props.isMobile}>
        <SidebarTitle>URC Seagrass & Carbon Stocks Database</SidebarTitle>
        {this.renderContent()}
        <BottomDiv isSmall={window.innerWidth <= PAYPAL_WIDTH}>
          {/*<MediaQuery minDeviceWidth={PAYPAL_WIDTH}>
            <PayPalText>Want to help the initiative?</PayPalText>
          </MediaQuery>*/}
          {this.state.isLoginPresent && <EmptyButton>
            Log out
          </EmptyButton>}
          <PayPalButton>
            Support us via &nbsp;
            <img src={PayPal} alt="Paypal Logo" />
          </PayPalButton>
        </BottomDiv>
      </SidebarFrame>
    );
  }
}

export default BaseSidebar;
