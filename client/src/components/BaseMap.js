import React, { Component } from 'react';
import { Map, Marker, Popup, TileLayer } from "react-leaflet";
import { Icon } from "leaflet";
import styled from 'styled-components';

const LeafletMap = styled(Map)`
  width: 100%;
  height: 98vh;

`

class BaseMap extends Component {
  render() {
    return (
      <LeafletMap center={[15.52, 119.93]} zoom={13}>
        <TileLayer
          url="https://api.mapbox.com/styles/v1/urcseagrass/ck948uacr3vxy1il8a2p5jaux/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoidXJjc2VhZ3Jhc3MiLCJhIjoiY2s5MWg5OXJjMDAxdzNub2sza3Q1OWQwOCJ9.D7jlj6hhwCqCYa80erPKNw"
          attribution='&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>'
        />
      </LeafletMap>
    );
  }
}

export default BaseMap;
