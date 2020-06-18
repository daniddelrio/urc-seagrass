import React, { Component } from "react";
import styled from "styled-components";
import {
  SidebarSubheader,
  AdminTextField,
  ParentButton,
  CustomErrorMessage
} from "./GlobalSidebarComponents";
import Select from "react-select";
import Calendar from "../assets/calendar.svg";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import api from "../services/contrib-services";

const selectOptions = [
  { value: "seagrassMeadow", label: "Seagrass Meadow" },
  { value: "adjacentPowerPlant", label: "Adjacent Power Plant" },
  { value: "adjacentResidential", label: "Adjacent Residential" },
  { value: "adjacentCoralReef", label: "Adjacent Coral Reef" },
  { value: "adjacentMangrove", label: "Adjacent Mangrove" },
  { value: "adjacentAquaculture", label: "Adjacent Aquaculture" },
];

const customStyles = {
  option: (provided, state) => ({
    ...provided,
    background: "#5F5F5F",
    fontSize: "13px",
    color: "#999999",
    fontWeight: 600,
    paddingBottom: "0.3rem",
    paddingTop: "0.3rem",
    cursor: "pointer",

    ":active": {},
  }),
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

const ContributionFields = styled.div`
  opacity: ${(props) => props.isShown ? "100%" : 0};
  transition: 0.5s opacity;
`;

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
  width: 16px;
  height: 16px;
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

const validationSchema = Yup.object()
  .shape({
    area: Yup.string()
      .required("Please input an area")
      .oneOf(selectOptions.map(option => option.value)),
    date: Yup.date()
      .required("Please input a date")
      .max(new Date(), "Measuring date must be before today's date"),
    seagrassCount: Yup.number()
      .typeError('Total count must be a number')
      .min(0)
      .when("carbonPercentage", {
        is: val => !val,
        then: Yup.number()
          .typeError('Total count must be a number')
          .min(0)
          .required("Please fill in at least one field")
        }),
    carbonPercentage: Yup.number()
      .typeError('Percentage must be a number')
      .min(0, "Percentage must be at least 0%")
      .max(100, "Percentage must be at most 100%")
      .when("seagrassCount", {
        is: val => !val,
        then: Yup.number()
          .typeError('Percentage must be a number')
          .min(0, "Percentage must be at least 0%")
          .max(100, "Percentage must be at most 100%")
          .required("Please fill in at least one field")
        }),
  }, [['area'], ['seagrassCount', 'carbonPercentage']]);

const AdminErrorMessage = styled(CustomErrorMessage)`
  font-size: 13px;
  margin-bottom: 0.4rem;
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
            seagrassCount: "",
            carbonPercentage: "",
          }}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(false);
            await api.createContribution(values).then(contrib => {
              this.props.setActiveSidebar("contribDone");
            });
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
              <ContributionFields isShown={values.area != ""}>
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
                <LabelField for="seagrassCount">
                  Total Seagrass Count
                </LabelField>
                <FlexDiv>
                  <TextField
                    id="seagrassCount"
                    name="seagrassCount"
                    style={
                      values.seagrassCount && values.seagrassCount != ""
                        ? { background: "#5A5A5A", color: "#ABABAB" }
                        : null
                    }
                    noMarginBottom
                  />
                  <UnitText>Mg C/ha</UnitText>
                </FlexDiv>
                <LabelField for="carbonPercentage">
                  Inorganic Carbon Percentage
                </LabelField>
                <FlexDiv>
                  <TextField
                    id="carbonPercentage"
                    name="carbonPercentage"
                    style={
                      values.carbonPercentage && values.carbonPercentage != ""
                        ? { background: "#5A5A5A", color: "#ABABAB" }
                        : null
                    }
                    noMarginBottom
                  />
                  <UnitText>%</UnitText>
                </FlexDiv>
                {!values.area && errors.area && touched.area && (
                  <AdminErrorMessage>
                    <span>Error: {errors.area}</span>
                  </AdminErrorMessage>
                )}
                {errors.date && touched.date && (
                  <AdminErrorMessage>
                    <span>Error: {errors.date}</span>
                  </AdminErrorMessage>
                )}
                {errors.seagrassCount && touched.seagrassCount && (
                  <AdminErrorMessage>
                    <span>Error: {errors.seagrassCount}</span>
                  </AdminErrorMessage>
                )}
                {errors.carbonPercentage && touched.carbonPercentage && (
                  <AdminErrorMessage>
                    <span>Error: {errors.carbonPercentage}</span>
                  </AdminErrorMessage>
                )}
                <SubmitButton
                  type="submit"
                  disabled={
                    isSubmitting ||
                    !touched.date ||
                    !(values.seagrassCount != "" || values.carbonPercentage != "")
                  }
                >
                  Submit Contribution
                </SubmitButton>
              </ContributionFields>
            </Form>
          )}
        </Formik>
      </React.Fragment>
    );
  }
}

export default SidebarContribution;
