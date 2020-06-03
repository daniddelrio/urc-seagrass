import React, { Component } from "react";
import { Map, TileLayer, GeoJSON, Popup } from "react-leaflet";
import styled from "styled-components";
import sites from "../data/sites.json";
import BasePopup from "./BasePopup";
import YearDropdown from "./YearDropdown";
import Hamburger from "../assets/hamburger.svg";
import OpenHamburger from "../assets/open_hamburger.svg";

const LeafletMap = styled(Map)`
  position: relative;
  height: 98vh;
  width: ${({ isOpen, isMobile }) => (isOpen && isMobile ? "30%" : "100%")};
  z-index: 1;
`;

const HamburgerIcon = styled.img`
  position: absolute;
  z-index: 5;

  bottom: 1.5rem;
  right: ${({ isOpen, isMobile }) => (isOpen ? "78%" : "1.5rem")};
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
    };
  }

  componentDidMount() {
    this.setState({ areas: sites });
  }

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
          <GeoJSON
            style={style}
            data={areas}
            onEachFeature={this.onEachFeature}
            ref={this.geojson}
          />
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
