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
      isSidebarOpen: false,
    };
  }

  toggleSidebar = () => {
    this.setState({isSidebarOpen: !this.state.isSidebarOpen});
  };

  render() {
    return (
      <AppDiv className="App">
        <BaseMap />
        <BaseSidebar isOpen={this.state.isSidebarOpen} toggleSidebar={this.toggleSidebar}/>
      </AppDiv>
    );
  }
}

export default Parent;
