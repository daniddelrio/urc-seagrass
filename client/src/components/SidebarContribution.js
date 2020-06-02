import React, { Component } from "react";
import styled from "styled-components";
import {
  SidebarSubheader,
  AdminTextField,
  ParentButton,
} from "./GlobalSidebarComponents";
import Select from "react-select";
import Calendar from "../assets/calendar.svg";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

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
  control: (styles, state) => ({
    ...styles,
    background: state.hasValue ? "#5A5A5A" : "#4F4F4F",
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
    color: state.hasValue ? "#ABABAB" : "#808080",
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

  background: ${({ disabled }) => (disabled ? "#474747" : "#5e8968")};
  border: 0.7px solid ${({ disabled }) => (disabled ? "#646464" : "#85b790")};
  box-sizing: border-box;
  border-radius: 14px;

  text-align: center;
  color: ${({ disabled }) => (disabled ? "#8a8a8a" : "#b4d9bc")};
  width: 100%;
`;

Yup.addMethod(Yup.object, "atLeastOneOf", function(list) {
  return this.test({
    name: 'atLeastOneOf',
    message: '${path} must have at least one of these keys: ${keys}',
    exclusive: true,
    params: { keys: list.join(', ') },
    test: (value) => value == null || list.some((f) => value[f] !== undefined),
  })
});

const validationSchema = Yup.object()
  .shape({
    area: Yup.string().required("Please input an area"),
    date: Yup.string().required("Please input a date"),
    contribField1: Yup.number(),
    contribField2: Yup.number(),
  })
  .atLeastOneOf(["contribField1", "contribField2"]);

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
            this.props.setActiveSidebar("contribDone");
          }}
          validationSchema={validationSchema}
        >
          {({
            values,
            touched,
            errors,
            handleChange,
            handleBlur,
            handleSubmit,
            handleReset,
            setFieldError,
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
                onChange={(selectedOption) => setFieldValue("area", selectedOption.value)}
                onBlur={() => setFieldTouched("area")}
                error={(error) => setFieldError("area")(error)}
              />
              {console.log("ERRORS")}
              {console.log(errors)}
              {values.area != "" && (
                <React.Fragment>
                  <RelativeDiv>
                    <TextField
                      placeholder="Date of Measuring"
                      type="date"
                      name="date"
                      style={
                        values.date && values.date != ""
                          ? { background: "#5A5A5A", color: "#ABABAB" }
                          : null
                      }
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
                      style={
                        values.contribField1 && values.contribField1 != ""
                          ? { background: "#5A5A5A", color: "#ABABAB" }
                          : null
                      }
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
                      style={
                        values.contribField2 && values.contribField2 != ""
                          ? { background: "#5A5A5A", color: "#ABABAB" }
                          : null
                      }
                      noMarginBottom
                    />
                    <UnitText>%</UnitText>
                  </FlexDiv>
                  <SubmitButton
                    type="submit"
                    disabled={
                      isSubmitting ||
                      !touched.date ||
                      !(values.contribField1 != "" || values.contribField2 != "")
                    }
                  >
                    Submit Contribution
                  </SubmitButton>
                </React.Fragment>
              )}
            </Form>
          )}
        </Formik>
      </React.Fragment>
    );
  }
}

export default SidebarContribution;
