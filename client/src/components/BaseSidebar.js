import React, { Component } from "react";
import styled from "styled-components";
import SidebarHome from "./SidebarHome";
import SidebarAdminLogin from "./SidebarAdminLogin";

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

class BaseSidebar extends Component {
  componentDidMount() {
    window.addEventListener("resize", null);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", null);
  }

  renderContent() {
    switch(this.props.activeSidebar) {
      case "home":
        return (
          <SidebarHome
            setActiveSidebar={this.props.setActiveSidebar}
          />
        );
      case "adminLogin":
        return (
          <SidebarAdminLogin
            setActiveSidebar={this.props.setActiveSidebar}
          />
        )
    }
  }

  render() {
    return (
      <SidebarFrame isOpen={this.props.isOpen} isMobile={this.props.isMobile}>
        <SidebarTitle>URC Seagrass & Carbon Stocks Database</SidebarTitle>
        { this.renderContent() }
      </SidebarFrame>
    );
  }
}

export default BaseSidebar;
