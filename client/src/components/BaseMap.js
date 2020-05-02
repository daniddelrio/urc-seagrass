import React, { Component } from "react";
import { Map, TileLayer, GeoJSON, Popup } from "react-leaflet";
import styled from "styled-components";
import sites from "../data/sites.json";
import BasePopup from "./BasePopup";
import Hamburger from "../assets/hamburger.svg";

const LeafletMap = styled(Map)`
  position: relative;
  width: 100%;
  height: 98vh;
  z-index: 1;
`;

const HamburgerIcon = styled.img`
  position: absolute;
  z-index: 5;

  bottom: 1.5rem;
  right: 5.5rem;
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
        <LeafletMap center={[15.52, 119.93]} zoom={13}>
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
        <HamburgerIcon src={Hamburger} alt="Sidebar" onClick={this.props.toggleSidebar}/>
      </React.Fragment>
    );
  }
}

export default BaseMap;
