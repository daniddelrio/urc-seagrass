import React, { Component } from "react";
import { Map, TileLayer, GeoJSON } from "react-leaflet";
import styled from "styled-components";
import sites from "../data/sites.json";

const LeafletMap = styled(Map)`
  width: 100%;
  height: 98vh;
`;

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    layer.bringToFront();
}

function resetHighlight(component, e) {
  var geojson = component.refs.geojson.leafletElement.resetStyle(e.target);
  // resetStyle(e.target);
}

function onEachFeature(component, feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight.bind(null, component)
    });
}

class BaseMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      areas: {},
    };
  }

  componentDidMount() {
    this.setState({areas: sites});
  }

  render() {
    const style = {
      fillColor: "#C5F9D0",
      weight: 2,
      opacity: 1,
      color: "#C5F9D0",
      fillOpacity: 0.7,
    };

    const { areas } = this.state;

    return (
      <LeafletMap center={[15.52, 119.93]} zoom={13}>
        <TileLayer
          url="https://api.mapbox.com/styles/v1/urcseagrass/ck948uacr3vxy1il8a2p5jaux/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoidXJjc2VhZ3Jhc3MiLCJhIjoiY2s5MWg5OXJjMDAxdzNub2sza3Q1OWQwOCJ9.D7jlj6hhwCqCYa80erPKNw"
          attribution='&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>'
        />

        <GeoJSON key="whatever" style={style} data={areas} onEachFeature={ onEachFeature.bind(null, this) } ref="geojson"/>
      </LeafletMap>
    );
  }
}

export default BaseMap;
