import React, { Component } from "react";
import BaseMap from "./BaseMap";
import BaseSidebar from "./BaseSidebar";
import styled from "styled-components";

const AppDiv = styled.div`
  display: flex;
`;

class Parent extends Component {
  constructor() {
    super();
    this.state = {
      isSidebarOpen: true,
    };
  }

  toggleSidebar = () => {
    this.setState({isSidebarOpen: !this.state.isSidebarOpen});
  };

  render() {
    return (
      <AppDiv className="App">
        <BaseMap isOpen={this.state.isSidebarOpen} toggleSidebar={this.toggleSidebar}/>
        <BaseSidebar isOpen={this.state.isSidebarOpen}/>
      </AppDiv>
    );
  }
}

export default Parent;
