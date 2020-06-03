import React from "react";
import styled from "styled-components";
import {
  SidebarSubheader,
  FilledButton,
  AdminTextField,
} from "./GlobalSidebarComponents";
import 'bootstrap/dist/css/bootstrap.min.css';
import Dropdown from 'react-bootstrap/Dropdown';
import Select from "react-select";

const DropdownBase = styled(Dropdown)`
  position: absolute;
  top: 1.2rem;
  left: 3.3rem;
  z-index: 10;
`;

const CustomToggle = styled(Dropdown.Toggle)`
  width: 55px;
  height: 22px;

  font-family: Roboto;
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 12px;
  text-align: center;

  color: #F2F2F2;

  background: rgba(92, 92, 92, 0.15);
  border: none;
  border-radius: 14.5px;

  &:hover {
    color: #F2F2F2;
    background-color: rgba(92, 92, 92, 0.15);
    border-color: none;
  }
`;

const CustomMenu = styled(Dropdown.Menu)`
  background: rgba(66, 66, 66, 0.15);
  border-radius: 6px;
  width: 55px;
`;

const CustomItem = styled(Dropdown.Item)`
  color: white;  
  font-family: Roboto;
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 12px;
  text-align: center;

  &:hover {
    color: white;
    background: rgba(66, 66, 66, 0.15);
  }
`;

const selectOptions = [
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
  control: (styles, state) => ({
    ...styles,
    position: "absolute",
    top: "1.2rem",
    left: "3.3rem",
    zIndex: "10",
    width: "75px",
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
  /*<DropdownBase>
    <CustomToggle>2020</CustomToggle>
    <CustomMenu>
      <CustomItem>2012</CustomItem>
    </CustomMenu>
  </DropdownBase>*/
const YearDropdown = (props) => (
  <Select
    name="mapYear"
    styles={customStyles}
    options={selectOptions}
    defaultValue={{ label: "2020", value: "2020" }}
    onChange={(e) => {props.setYear(e.value)}}
    menuPortalTarget={document.body}
  />
);

export default YearDropdown;
