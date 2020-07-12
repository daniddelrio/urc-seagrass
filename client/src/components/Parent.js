import React, { Component } from "react";
import BaseMap from "./BaseMap";
import BaseSidebar from "./BaseSidebar";
import styled from "styled-components";
import { MAX_WIDTH } from "./GlobalDeviceWidths";
import coordsApi from "../services/siteCoord-services";
import dataApi from "../services/sitedata-services";

const AppDiv = styled.div`
  display: flex;
`;

class Parent extends Component {
  constructor() {
    super();
    this.state = {
      isSidebarOpen: window.innerWidth >= MAX_WIDTH,
      isMobile: window.innerWidth < MAX_WIDTH,
      isChoosingCoords: false,
      year: "2020",
      latLng: null,
      areas: {},
    };
  }

  async componentDidMount() {
    window.addEventListener("resize", this.setSidebarOpen);
    window.addEventListener("resize", this.setMobileState);

    await coordsApi.getAllCoords().then((coords) => {
      const newCoords = this.changeSiteKey(coords.data.coords);
      dataApi.getAllData().then((res) => {
        const finalData = this.processSiteData(newCoords, res.data.data);
        this.setState({
          areas: finalData,
          isLoading: false,
        });
      });
    });
  }

  // Make the site code the key in the object
  changeSiteKey = (coords) => {
    const newSites = {};
    coords.forEach((site) => {
      newSites[(site.properties && site.properties.siteCode) || "test"] = site;
    });
    return newSites;
  };

  processSiteData = (newCoords, data) => {
    let finalData = [];
    data.forEach((siteData) => {
      finalData.push({
        ...newCoords[siteData.siteCode],
        properties: {
          ...siteData,
        },
      });
    });
    return finalData;
  };

  setLatLng = (latlng) => {
    this.setState({latLng: latlng})
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.setSidebarOpen);
    window.removeEventListener("resize", this.setMobileState);
  }

  setYear = (year) => {
    this.setState({year: year});
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

  toggleChoosingSidebar = (flag) => {
    this.setState({ isChoosingCoords: flag });
  };

  render() {
    return (
      <AppDiv className="App" isMobile={this.state.isMobile}>
        <BaseMap
          isOpen={this.state.isSidebarOpen}
          isMobile={this.state.isMobile}
          isChoosingCoords={this.state.isChoosingCoords}
          toggleChoosingSidebar={this.toggleChoosingSidebar}
          toggleSidebar={this.toggleSidebar}
          year={this.state.year}
          setYear={this.setYear}
          areas={this.state.areas}
          setLatLng={this.setLatLng}
        />
        <BaseSidebar 
          isOpen={this.state.isSidebarOpen} 
          isMobile={this.state.isMobile}
          areas={this.state.areas}
          toggleSidebar={this.toggleSidebar}
          toggleChoosingSidebar={this.toggleChoosingSidebar}
          isChoosingCoords={this.state.isChoosingCoords}
          setLatLng={this.setLatLng}
          latLng={this.state.latLng}
        />
      </AppDiv>
    );
  }
}

export default Parent;
