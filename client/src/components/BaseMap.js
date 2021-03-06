import React, { Component } from "react";
import { Map, TileLayer, GeoJSON, Popup } from "react-leaflet";
import styled from "styled-components";
import sites from "../data/sites.json";
import BasePopup from "./BasePopup";
import SelectDropdown from "./SelectDropdown";
import MapLegend from "./MapLegend";
import Hamburger from "../assets/hamburger.svg";
import OpenHamburger from "../assets/open_hamburger.svg";
import coordsApi from "../services/siteCoord-services";
import dataApi from "../services/sitedata-services";
import L from "leaflet";
import { MapLoading } from "./GlobalSidebarComponents";

const LeafletMap = styled(Map)`
  position: relative;
  height: 98vh;
  width: ${({ isOpen, isMobile }) => (isOpen && isMobile ? "20%" : "100%")};
  float: ${({ isMobile }) => (isMobile ? "left" : null)};
  z-index: 1;
  transition: width 0.5s;
  cursor: ${({ isChoosingCoords }) =>
    isChoosingCoords ? "crosshair" : "default"};
`;

const HamburgerIcon = styled.img`
  position: absolute;
  z-index: 5;

  bottom: 1.5rem;
  right: ${({ isOpen }) => (isOpen ? "83%" : "1.5rem")};
  transition: right 0.5s;
`;

const ReminderMessage = styled.div`
  z-index: 999;
  position: absolute;
  bottom: 1.5rem;
  left: 1rem;

  padding: 0.2rem 1rem;
  background: rgba(255, 175, 7, 0.37);
  border-radius: 14.5px;

  font-family: Roboto;
  font-style: normal;
  font-size: 10px;
  line-height: 12px;
  text-align: center;

  color: #bb5f0a;
`;

const FlexDiv = styled.div`
  display: flex;
  position: absolute;
  top: 1.2rem;
  left: 3.3rem;
  z-index: 10;
`;

let numMapClicks = 0;

class BaseMap extends Component {
  constructor(props) {
    super(props);
    this.geojson = React.createRef();
    this.state = {
      popup: {},
      isLoadingPopups: true,
    };
  }

  addPopup = (e) => {
    this.setState({
      popup: {
        key: numMapClicks++,
        position: e.latlng,
        properties: e.target.feature.properties,
        ...(e.target.feature.geometry.type == "Point" && {
          coordinates: e.target.feature.geometry.coordinates,
        }),
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

  setLoadingFalse = () => {
    this.setState({ isLoadingPopups: false });
  };

  handleClick = (e) => {
    this.props.setLatLng(e.latlng);
    this.props.toggleChoosingSidebar(false);
    if (this.props.isMobile) this.props.toggleSidebar();
  };

  compareStandards = (d, standards) => {
    const compareLessWithEqual = (comparison) =>
      comparison.hasEqual ? d <= comparison.standard : d < comparison.standard;
    const compareGreaterWithEqual = (comparison) =>
      comparison.hasEqual ? d >= comparison.standard : d > comparison.standard;
    if (standards.lessThan && standards.greaterThan) {
      if (standards.lessThan.standard > standards.greaterThan.standard) {
        return (
          compareGreaterWithEqual(standards.greaterThan) &&
          compareLessWithEqual(standards.lessThan)
        );
      }
      return (
        compareGreaterWithEqual(standards.greaterThan) ||
        compareLessWithEqual(standards.lessThan)
      );
    }

    if (standards.lessThan) return compareLessWithEqual(standards.lessThan);
    if (standards.greaterThan)
      return compareGreaterWithEqual(standards.greaterThan);

    return false;
  };

  getColor = (d) => {
    if (this.props.parameter != "all") {
      const standards = this.props.dataFields.find(
        (field) => field._id == this.props.parameter
      ).standards;
      if (!standards) {
        return "#DEDEDE";
      }
      if (standards.green) {
        if (this.compareStandards(d, standards.green)) return "#C5F9D0";
      }
      if (standards.yellow) {
        if (this.compareStandards(d, standards.yellow)) return "#FFDCBC";
      }
      if (standards.red) {
        if (this.compareStandards(d, standards.red)) return "#FFC4C4";
      }

      return "#DEDEDE";
    }

    return "#C5F9D0";
  };

  render() {
    const getParamValue = (feature) =>
      feature.properties.parameters.find(
        (param) => param.paramId == this.props.parameter
      );
    const style = (feature) => ({
      fillColor: this.getColor(
        getParamValue(feature) && getParamValue(feature).paramAverage
      ),
      weight: 3,
      opacity: 0.8,
      color: feature.properties.status === "CONSERVED" ? "#C5F9D0" : "#FFC4C4",
      fillOpacity: 0.8,
    });

    const { popup } = this.state;

    return (
      <React.Fragment>
        <FlexDiv>
          <SelectDropdown
            isYear
            setYear={this.props.setYear}
            yearOptions={this.props.yearOptions}
          />
          <SelectDropdown
            setParameter={this.props.setParameter}
            paramOptions={this.props.paramOptions}
          />
        </FlexDiv>
        <LeafletMap
          center={[15.52, 119.93]}
          zoom={13}
          isOpen={this.props.isOpen}
          isMobile={this.props.isMobile}
          isChoosingCoords={this.props.isChoosingCoords}
          onClick={(e) => {
            if (this.props.isChoosingCoords) this.handleClick(e);
          }}
        >
          <TileLayer
            url="https://api.mapbox.com/styles/v1/urcseagrass/ck948uacr3vxy1il8a2p5jaux/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoidXJjc2VhZ3Jhc3MiLCJhIjoiY2s5MWg5OXJjMDAxdzNub2sza3Q1OWQwOCJ9.D7jlj6hhwCqCYa80erPKNw"
            attribution='&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>'
          />
          {this.props.isLoadingMap ? (
            <MapLoading type="spin" />
          ) : (
            <GeoJSON
              style={style}
              data={this.props.areas}
              key={this.props.year}
              onEachFeature={this.onEachFeature}
              pointToLayer={(feature, latlng) => L.circleMarker(latlng, null)}
              filter={(site) =>
                site.properties &&
                (this.props.year
                  ? site.properties.year == this.props.year
                  : site.properties.year == this.props.yearOptions[0].value)
              }
              ref={this.geojson}
            />
          )}
          {popup.position && (
            <Popup
              key={`popup-${popup.key}`}
              position={popup.position}
              style={{ position: "relative" }}
            >
              {this.props.isLoadingPopups ? (
                <MapLoading type="spin" />
              ) : (
                <BasePopup
                  dataFields={this.props.dataFields}
                  setLoadingFalse={this.setLoadingFalse}
                  isModifyingData={this.props.isModifyingData}
                  parameter={this.props.parameter}
                  properties={{
                    ...popup.properties,
                    coordinates: popup.coordinates,
                  }}
                />
              )}
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
        <MapLegend isStatusShowing={this.props.isModifyingData || this.props.isChoosingCoords} />
        {(this.props.isMobile ? !this.props.isOpen : true) &&
          (this.props.isChoosingCoords || this.props.isModifyingData) && (
            <ReminderMessage>{`You are currently ${
              this.props.isChoosingCoords
                ? "choosing coordinates"
                : this.props.isModifyingData
                ? "modifying data"
                : "not on any mode"
            }`}</ReminderMessage>
          )}
      </React.Fragment>
    );
  }
}

export default BaseMap;
