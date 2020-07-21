import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  SidebarSubheader,
  FilledButton,
  AdminTextField,
} from "./GlobalSidebarComponents";
import Select from "react-select";

const customStyles = {
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? "rgba(66, 66, 66, 0.15)" : null,
    fontFamily: "Roboto",
    fontSize: "12px",
    fontWeight: 500,
    color: "white",
    paddingBottom: "0.2rem",
    paddingTop: "0.2rem",
    cursor: "pointer",

    "&:hover": {
      background: "rgba(92, 92, 92, 0.15)",
    },
  }),
  control: (styles, { selectProps }) => ({
    ...styles,
    marginLeft: "0.5rem",
    width: selectProps.name == "mapField" ? "125px" : "75px",
    background: "rgba(92, 92, 92, 0.15)",
    border: "none",
    borderRadius: "14.5px",
    fontFamily: "Roboto",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: "12px",
    lineHeight: "12px",
    textAlign: "center",
    boxShadow: "",
  }),
  menu: (styles) => ({
    ...styles,
    backgroundColor: "rgba(66, 66, 66, 0.15)",
    border: "0.8px solid rgba(66, 66, 66, 0.15)",
    borderRadius: "4px",
  }),
  singleValue: (provided, state) => ({
    ...provided,
    color: "#F2F2F2",
  }),
  indicatorSeparator: () => ({}),
  dropdownIndicator: (styles) => ({
    ...styles,
    color: "#E7E7E7",
    ":hover": {},
  }),
};

const handleChange = (e, props) => {
  if (props.isYear) props.setYear(e.value);
  else props.setParameter(e.value);
};


const SelectDropdown = React.memo((props) => {
  return (
    <Select
      name={props.isYear ? "mapYear" : "mapField"}
      styles={customStyles}
      options={props.isYear ? props.yearOptions : props.paramOptions}
      defaultValue={
        props.isYear
          ? props.yearOptions[0] || { label: new Date().getFullYear(), value: new Date().getFullYear() }
          : { label: "All Parameters", value: "all" }
      }
      onChange={(e) => {
        handleChange(e, props);
      }}
      menuPortalTarget={document.body}
    />
  );
});

export default SelectDropdown;
