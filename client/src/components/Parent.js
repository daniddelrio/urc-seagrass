import React, { Component } from "react";
import BaseMap from "./BaseMap";
import BaseSidebar from "./BaseSidebar";
import styled from "styled-components";
import { MAX_WIDTH } from "./GlobalDeviceWidths";

const AppDiv = styled.div`
  display: flex;
`;

class Parent extends Component {
  constructor() {
    super();
    this.state = {
      isSidebarOpen: window.innerWidth >= MAX_WIDTH,
      isMobile: window.innerWidth < MAX_WIDTH,
    };
  }

  componentDidMount() {
    window.addEventListener("resize", this.setSidebarOpen);
    window.addEventListener("resize", this.setMobileState);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.setSidebarOpen);
    window.removeEventListener("resize", this.setMobileState);
  }

  setSidebarOpen = () => {
    if(window.innerWidth >= MAX_WIDTH) {
      this.setState({ isSidebarOpen: true });
    }
  };

  setMobileState = () => {
    this.setState({ isMobile: window.innerWidth < MAX_WIDTH });
  };

  toggleSidebar = () => {
    this.setState({ isSidebarOpen: !this.state.isSidebarOpen });
  };

  render() {
    return (
      <AppDiv className="App">
        <BaseMap
          isOpen={this.state.isSidebarOpen}
          isMobile={this.state.isMobile}
          toggleSidebar={this.toggleSidebar}
        />
        <BaseSidebar 
          isOpen={this.state.isSidebarOpen} 
          isMobile={this.state.isMobile}
        />
      </AppDiv>
    );
  }
}

export default Parent;
