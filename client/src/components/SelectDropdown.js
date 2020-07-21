import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  SidebarSubheader,
  FilledButton,
  AdminTextField,
} from "./GlobalSidebarComponents";
import Select from "react-select";
import getData from "../dataFields";

const paramOptions = async () => {
  const dataFields = await getData();
  return [{ value: "all", label: "All Parameters" }].concat(
    dataFields.map((field) => ({
      ...field,
      label: field.label + " (" + field.unit + ")",
    }))
  );
};

const yearOptions = [
  { value: "2020", label: "2020" },
  { value: "2019", label: "2019" },
  { value: "2018", label: "2018" },
  { value: "2017", label: "2017" },
  { value: "2016", label: "2016" },
];

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
  const [stateParamOptions, setParamOptions] = useState([]);

  useEffect(async () => {
    const stateParamOptions = await paramOptions();
    console.log(stateParamOptions)
    setParamOptions(stateParamOptions);
  }, []);

  return (
    <Select
      name={props.isYear ? "mapYear" : "mapField"}
      styles={customStyles}
      options={props.isYear ? yearOptions : stateParamOptions}
      defaultValue={
        props.isYear
          ? { label: "2020", value: "2020" }
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
