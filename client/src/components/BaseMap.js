import React, { Component } from "react";
import { Map, TileLayer, GeoJSON, Popup } from "react-leaflet";
import styled from "styled-components";
import sites from "../data/sites.json";
import BasePopup from "./BasePopup";
import YearDropdown from "./YearDropdown";
import Hamburger from "../assets/hamburger.svg";
import OpenHamburger from "../assets/open_hamburger.svg";
import coordsApi from "../services/siteCoord-services";
import dataApi from "../services/sitedata-services";

const LeafletMap = styled(Map)`
  position: relative;
  height: 98vh;
  width: ${({ isOpen, isMobile }) => (isOpen && isMobile ? "20%" : "100%")};
  float: ${({ isMobile }) => (isMobile ? "left" : null)};
  z-index: 1;
  transition: width 0.5s;
`;

const HamburgerIcon = styled.img`
  position: absolute;
  z-index: 5;

  bottom: 1.5rem;
  right: ${({ isOpen }) => (isOpen ? "83%" : "1.5rem")};
  transition: right 0.5s;
`;

let numMapClicks = 0;

class BaseMap extends Component {
  constructor(props) {
    super(props);
    this.geojson = React.createRef();
    this.state = {
      areas: {},
      popup: {},
      isLoading: false,
    };
  }

  componentDidMount = async () => {
    this.setState({ isLoading: true });
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
  };

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
    // finalData = finalData.filter(site => site.geometry.type == "Polygon")
    return finalData;
  };

  addPopup = (e) => {
    this.setState({
      popup: {
        key: numMapClicks++,
        position: e.latlng,
        properties: e.target.feature.properties,
      },
    });
  };

  highlightFeature = (e) => {
    var layer = e.target;

    layer.setStyle({
      weight: 5,
      color: "#666",
      dashArray: "",
      fillOpacity: 0.7,
    });

    layer.bringToFront();
  };

  resetHighlight = (e) => {
    this.geojson.current.leafletElement.resetStyle(e.target);
  };

  onEachFeature = (feature, layer) => {
    layer.on({
      mouseover: this.highlightFeature,
      mouseout: this.resetHighlight,
      click: this.addPopup,
    });
  };

  toggleModify = (index) => {
    this.setState({
      admins: {
        ...this.state.admins,
        [index]: {
          ...this.state.admins[index],
          showingModify: !this.state.admins[index].showingModify,
        },
      },
    });
  };

  render() {
    const style = {
      fillColor: "#C5F9D0",
      weight: 2,
      opacity: 1,
      color: "#C5F9D0",
      fillOpacity: 0.7,
    };

    const { areas, popup } = this.state;

    return (
      <React.Fragment>
        <YearDropdown setYear={this.props.setYear} />
        <LeafletMap
          center={[15.52, 119.93]}
          zoom={13}
          isOpen={this.props.isOpen}
          isMobile={this.props.isMobile}
        >
          <TileLayer
            url="https://api.mapbox.com/styles/v1/urcseagrass/ck948uacr3vxy1il8a2p5jaux/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoidXJjc2VhZ3Jhc3MiLCJhIjoiY2s5MWg5OXJjMDAxdzNub2sza3Q1OWQwOCJ9.D7jlj6hhwCqCYa80erPKNw"
            attribution='&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>'
          />
          {Object.keys(this.state.areas).length !== 0 && (
            <GeoJSON
              style={style}
              data={areas}
              key={this.props.year}
              onEachFeature={this.onEachFeature}
              filter={(site) => site.properties.year == this.props.year}
              ref={this.geojson}
            />
          )}
          {popup.position && (
            <Popup key={`popup-${popup.key}`} position={popup.position}>
              <BasePopup properties={popup.properties} />
            </Popup>
          )}
        </LeafletMap>
        {this.props.isMobile && (
          <HamburgerIcon
            src={this.props.isOpen ? OpenHamburger : Hamburger}
            alt="Sidebar"
            isOpen={this.props.isOpen}
            onClick={this.props.toggleSidebar}
            isMobile={this.props.isMobile}
          />
        )}
      </React.Fragment>
    );
  }
}

export default BaseMap;
