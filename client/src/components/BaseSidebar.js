import React, { Component } from "react";
import styled from "styled-components";
import SidebarHome from "./SidebarHome";
import SidebarAdminLogin from "./SidebarAdminLogin";
import SidebarAdminHome from "./SidebarAdminHome";
import SidebarContribution from "./SidebarContribution";
import SidebarContributionDone from "./SidebarContributionDone";
import PayPal from "../assets/paypal.svg";
import { PAYPAL_WIDTH } from "./GlobalDeviceWidths";
import MediaQuery from "react-responsive";
import {
  SidebarSubheader,
  ParentButton,
  FilledButton,
  EmptyButton,
} from "./GlobalSidebarComponents";
import { logout, isLoggedIn } from "../services/auth-funcs";

const ParentDiv = styled.div`
  display: flex;
  flex-direction: column;
  width: ${({ isOpen, isMobile }) =>
    isOpen ? (isMobile ? "80%" : "40%") : "0"};
  height: 98vh;
  background: #474747;
  z-index: 15;
  transition: width 0.5s;
  padding: ${({ isOpen }) => (isOpen ? "2rem" : "0")};
  padding-bottom: ${({ isOpen }) => (isOpen ? "1rem" : "0")};
  overflow: auto;
  float: ${({ isMobile }) => (isMobile ? "right" : null)};

  .sidebar-content {
    opacity: ${({ isOpen }) => (isOpen ? "100%" : "0%")};
    transition: 0.5s opacity;
  }
`;

const SidebarContent = styled.div`
  position: relative;
  margin-bottom: 1rem;
`;

const SidebarTitle = styled.h1`
  font-size: 17px;
  line-height: 163.18%;
  color: #ececec;
`;

const BottomDiv = styled.div`
  margin-top: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

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
      // activeSidebar: "contribDone",
      activeSidebar: isLoggedIn() ? "adminHome" : "home",
      contribName: "",
      logoutButtonText: "",
    };
  }

  componentDidMount() {
    window.addEventListener("resize", null);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", null);
  }

  showLogoutButton = (text) => {
    this.setState({ isLogoutPresent: true, logoutButtonText: text });
  };

  setActiveSidebar = (key) => {
    this.setState({ activeSidebar: key });
  };

  setContribName = (name) => {
    this.setState({ contribName: name });
  };

  handleLogout = (isContributor) => {
    if (isContributor) {
      this.setContribName("");
    } else {
      logout();
    }
    this.props.turnOffModifyingData(false);
    this.props.toggleChoosingSidebar(false);
    this.props.setLatLng(null);
    this.setActiveSidebar("home");
    this.setState({ isLogoutPresent: false });
  };

  renderContent() {
    switch (this.state.activeSidebar) {
      case "home":
        return <SidebarHome setActiveSidebar={this.setActiveSidebar} />;
      case "adminLogin":
        return (
          <SidebarAdminLogin
            setActiveSidebar={this.setActiveSidebar}
            showLogoutButton={this.showLogoutButton}
          />
        );
      case "adminHome":
        return (
          <SidebarAdminHome
            areas={this.props.areas}
            isMobile={this.props.isMobile}
            setActiveSidebar={this.setActiveSidebar}
            showLogoutButton={this.showLogoutButton}
            toggleModifyingData={this.props.toggleModifyingData}
            isModifyingData={this.props.isModifyingData}
            dataFields={this.props.dataFields}
          />
        );
      case "contribLogin":
        return (
          <SidebarAdminLogin
            showLogoutButton={this.showLogoutButton}
            setActiveSidebar={this.setActiveSidebar}
            setContribName={this.setContribName}
            contributor
          />
        );
      case "contribHome":
        return (
          <SidebarContribution
            areas={this.props.areas}
            showLogoutButton={this.showLogoutButton}
            setActiveSidebar={this.setActiveSidebar}
            contribName={this.state.contribName}
            toggleSidebar={this.props.toggleSidebar}
            isMobile={this.props.isMobile}
            toggleChoosingSidebar={this.props.toggleChoosingSidebar}
            isChoosingCoords={this.state.isChoosingCoords}
            setLatLng={this.props.setLatLng}
            latLng={this.props.latLng}
            dataFields={this.props.dataFields}
          />
        );
      case "contribDone":
        return (
          <SidebarContributionDone
            setActiveSidebar={this.setActiveSidebar}
            contribName={this.state.contribName}
            setContribName={this.setContribName}
            handleLogout={this.handleLogout}
          />
        );
    }
  }

  render() {
    return (
      <ParentDiv isOpen={this.props.isOpen} isMobile={this.props.isMobile}>
        <SidebarContent className="sidebar-content">
          <SidebarTitle>URC Seagrass & Carbon Stocks Database</SidebarTitle>
          {this.renderContent()}
        </SidebarContent>
        <BottomDiv
          className="sidebar-content"
          isSmall={window.innerWidth <= PAYPAL_WIDTH}
        >
          {/*<MediaQuery minDeviceWidth={PAYPAL_WIDTH}>
            <PayPalText>Want to help the initiative?</PayPalText>
          </MediaQuery>*/}
          {this.state.isLogoutPresent && (
            <EmptyButton
              onClick={() =>
                this.handleLogout(
                  this.props.activeSidebar == "contribHome" ||
                    this.props.activeSidebar == "contribDone"
                )
              }
              noFlex
            >
              {this.state.logoutButtonText}
            </EmptyButton>
          )}
          <FilledButton
            style={{
              color: "#63470f",
              background: "#ffbc32",
              marginTop: "0.5rem",
            }}
          >
            Download Dataset
          </FilledButton>
          {/*<PayPalButton>
                      Support us via &nbsp;
                      <img src={PayPal} alt="Paypal Logo" />
                    </PayPalButton>*/}
        </BottomDiv>
      </ParentDiv>
    );
  }
}

export default BaseSidebar;
