import React, { Component } from "react";
import styled from "styled-components";
import {
  SidebarSubheader,
  AdminTextField,
  ParentButton,
} from "./GlobalSidebarComponents";
import Select from "react-select";
import Calendar from "../assets/calendar.svg";
import { Formik, Form, Field, ErrorMessage } from "formik";

const selectOptions = [
  { value: "seagrassMeadow", label: "Seagrass Meadow" },
  { value: "adjacentPowerPlant", label: "Adjacent Power Plant" },
  { value: "adjacentResidential", label: "Adjacent Residential" },
  { value: "adjacentCoralReef", label: "Adjacent Coral Reef" },
  { value: "adjacentMangrove", label: "Adjacent Mangrove" },
  { value: "adjacentAquaculture", label: "Adjacent Aquaculture" },
];

const customStyles = {
  option: (provided, state) => {
    return {
      ...provided,
      background: "#5F5F5F",
      fontSize: "13px",
      color: "#999999",
      fontWeight: 600,
      paddingBottom: "0.3rem",
      paddingTop: "0.3rem",
      cursor: "pointer",

      ":active": {},
    };
  },
  control: (styles) => ({
    ...styles,
    background: "#4F4F4F",
    fontSize: "13px",
    fontWeight: 600,
    border: "0.7px solid #9A9A9A",
    boxSizing: "border-box",
    borderRadius: "4px",
    marginBottom: "0.75rem",
  }),
  menu: (styles) => ({
    ...styles,
    background: "#5F5F5F",
    border: "0.8px solid #AFAFAF",
    boxSizing: "border-box",
    borderRadius: "4px",
  }),
  singleValue: (provided, state) => ({
    color: "#808080",
  }),
  indicatorSeparator: () => ({}),
};

const LabelField = styled.label`
  font-weight: 600;
  font-size: 0.8em;
  line-height: 15px;
  align-items: center;

  color: #808080;
`;

const TextField = styled(AdminTextField)`
  width: 100%;
  margin-bottom: ${(props) => (props.noMarginBottom ? 0 : "1rem")};
  flex: 0.7;
`;

const RelativeDiv = styled.div`
  position: relative;
`;

const FlexDiv = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const UnitText = styled.span`
  font-weight: 600;
  font-size: 0.85em;
  line-height: 16px;

  color: #767676;
  margin-left: 0.8rem;
  flex: 0.3;
`;

const CalendarIcon = styled.img`
  position: absolute;
  right: 0.7rem;
  top: 0.6rem;
  width: 14px;
  height: 14px;
`;

const SubmitButton = styled(ParentButton)`
  margin-top: 0.8rem;

  background: #5e8968;
  border: 0.7px solid #85b790;
  box-sizing: border-box;
  border-radius: 14px;

  text-align: center;
  color: #b4d9bc;
  width: 100%;
`;

class SidebarContribution extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <React.Fragment>
        <SidebarSubheader>Welcome, Pedro!</SidebarSubheader>
        <Formik
          initialValues={{
            area: "",
            date: "",
            contribField1: "",
            contribField2: "",
          }}
          onSubmit={(values, { setSubmitting }) => {
            setSubmitting(false);
            console.log(values);
            this.props.setActiveSidebar("home");
          }}
        >
          {({
            values,
            touched,
            errors,
            handleChange,
            handleBlur,
            handleSubmit,
            handleReset,
            setFieldValue,
            setFieldTouched,
            isSubmitting,
          }) => (
            <Form>
              <Select
                name="area"
                placeholder="Choose Area"
                styles={customStyles}
                options={selectOptions}
                onChange={setFieldValue}
                onBlur={() => setFieldTouched("area")}
                error={errors.area}
                touched={touched.area}
              />
              { touched.area && 
                <React.Fragment>
                  <RelativeDiv>
                    <TextField
                      placeholder="Date of Measuring"
                      type="date"
                      name="date"
                    />
                    <CalendarIcon src={Calendar} />
                  </RelativeDiv>
                  <LabelField for="contribField1">
                    Total Seagrass Count
                  </LabelField>
                  <FlexDiv>
                    <TextField
                      id="contribField1"
                      name="contribField1"
                      noMarginBottom
                    />
                    <UnitText>Mg C/ha</UnitText>
                  </FlexDiv>
                  <LabelField for="contribField2">
                    Inorganic Carbon Percentage
                  </LabelField>
                  <FlexDiv>
                    <TextField
                      id="contribField2"
                      name="contribField2"
                      noMarginBottom
                    />
                    <UnitText>%</UnitText>
                  </FlexDiv>
                  <SubmitButton type="submit" disabled={isSubmitting}>
                    Submit Contribution
                  </SubmitButton>
                </React.Fragment>
              }
            </Form>
          )}
        </Formik>
      </React.Fragment>
    );
  }
}

export default SidebarContribution;
