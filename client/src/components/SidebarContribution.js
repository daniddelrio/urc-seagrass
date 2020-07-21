import React, { Component } from "react";
import styled from "styled-components";
import {
  SidebarSubheader,
  AdminTextField,
  ParentButton,
  CustomErrorMessage,
} from "./GlobalSidebarComponents";
import Select from "react-select";
import Calendar from "../assets/calendar.svg";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import api from "../services/contrib-services";
import getData from "../dataFields";

const selectOptions = [
  { value: "SM", label: "Seagrass Meadow" },
  { value: "CP", label: "Adjacent Coal Power Plant" },
  { value: "RA", label: "Adjacent Residential Area" },
  { value: "CR", label: "Adjacent Coral Reef" },
  { value: "MF", label: "Adjacent Mangrove Forest" },
  { value: "AC", label: "Adjacent Aquaculture" },
  { value: "newCoordinates", label: "+ New Coordinates" },
];

const customStyles = {
  option: (provided, { data }) => ({
    ...provided,
    background: data.value === "newCoordinates" ? "#585858" : "#5F5F5F",
    fontSize: "13px",
    color: data.value === "newCoordinates" ? "#C8A55F" : "#999999",
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
  opacity: ${(props) => (props.isShown ? "100%" : 0)};
  transition: 0.5s opacity;

  max-height: 50vh;
  overflow-y: auto;
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

// Produces all pairs of an array
const pairsOfArray = (array) =>
  array.reduce(
    (acc, val, i1) => [
      ...acc,
      ...new Array(array.length - 1 - i1)
        .fill(0)
        .map((v, i2) => [array[i1], array[i1 + 1 + i2]]),
    ],
    []
  );

const dataValidationFields = (fields) => {
  return fields.reduce(
    (obj, item) => ({
      ...obj,
      ...{
        [item.value]: Yup.number()
          .typeError(`${item.label} must be a number`)
          .when(
            fields
              .filter((field) => field.value != item.value)
              .map((field) => field.value),
            {
              is: (...args) => args.every((obj) => !obj),
              then: Yup.number()
                .typeError(`${item.label} must be a number`)
                .min(0)
                .required("Please fill in at least one field"),
            }
          ),
      },
    }),
    {}
  );
};

const validationSchema = async (dataFields) =>
  Yup.object().shape(
    {
      ...dataValidationFields(dataFields),
      area: Yup.mixed().required("Please input an area"),
      coordinates: Yup.mixed(),
      date: Yup.date()
        .required("Please input a date")
        .max(new Date(), "Measuring date must be before today's date"),
    },
    // If the fields are: seagrassCount, carbonPercentage, phosphates
    // It should look something like: [carbonPercentage, phosphates], [seagrassCount, phosphates], [seagrassCount, carbonPercentage]
    [["area"]].concat(pairsOfArray(dataFields.map((field) => field.value)))
  );

const AdminErrorMessage = styled(CustomErrorMessage)`
  font-size: 13px;
  margin-bottom: 0.4rem;
`;

class SidebarContribution extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      dataFields: [],
    };
  }

  async componentDidMount() {
    this.props.showLogoutButton("Log out");
    const dataFields = await getData();
    this.setState({ dataFields });
  }

  componentDidUpdate(prevProps, prevstate) {
    if (this.props.latLng !== prevProps.latLng && this.props.latLng) {
      this.setState({ error: null });
    }
  }

  render() {
    const dataFieldsObj = (values) =>
      this.state.dataFields.reduce(
        (obj, item) => ({
          ...obj,
          ...(values[item.value] !== "" && {
            [item.value]: values[item.value],
          }),
        }),
        {}
      );

    return (
      <React.Fragment>
        <SidebarSubheader>
          {this.props.contribName
            ? `Welcome, {this.props.contribName}!`
            : "Welcome!"}
          !
        </SidebarSubheader>
        <Formik
          initialValues={{
            area: null,
            date: "",
            ...dataFieldsObj(
              this.state.dataFields.map((field) => ({ [field.value]: null }))
            ),
          }}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(false);
            if (values.area == "newCoordinates" && !this.props.latLng) {
              this.setState({
                error: "Please choose coordinates by clicking on the map",
              });
            } else {
              const { date } = values;
              const body = {
                ...(values.area == "newCoordinates"
                  ? {
                      coordinates: [
                        this.props.latLng.lng,
                        this.props.latLng.lat,
                      ],
                    }
                  : { site: values.area }),
                ...(this.props.contribName && {
                  contributor: this.props.contribName,
                }),
                ...dataFieldsObj(values),
                date,
              };
              await api.createContribution(body).then((contrib) => {
                this.props.setActiveSidebar("contribDone");
                this.props.setLatLng(null);
              });
            }
          }}
          validationSchema={() => validationSchema(this.state.dataFields)}
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
              {this.state.error && !this.props.latLng && (
                <AdminErrorMessage key={!!this.props.latLng}>
                  <span>Error: {this.state.error}</span>
                </AdminErrorMessage>
              )}
              <Select
                name="area"
                placeholder="Choose Area"
                styles={customStyles}
                options={selectOptions}
                onChange={(selectedOption) => {
                  if (selectedOption.value == "newCoordinates") {
                    if (this.props.isMobile) this.props.toggleSidebar();
                    this.props.toggleChoosingSidebar(true);
                  } else {
                    this.props.toggleChoosingSidebar(false);
                    this.props.setLatLng(null);
                  }
                  setFieldValue("area", selectedOption.value);
                }}
                onBlur={() => setFieldTouched("area")}
                error={(error) => setFieldError("area")(error)}
              />
              <ContributionFields isShown={values.area || this.props.latLng}>
                {this.props.latLng && (
                  <LabelField>{`Coordinates: ${this.props.latLng.lat} ${
                    this.props.latLng.lng
                  }`}</LabelField>
                )}
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
                {this.state.dataFields.map((field) => (
                  <React.Fragment key={"contribField" + field.value}>
                    <LabelField for="seagrassCount">{field.label}</LabelField>
                    <FlexDiv>
                      <TextField
                        id={field.value}
                        name={field.value}
                        style={
                          values[field.value] && values[field.value] != ""
                            ? { background: "#5A5A5A", color: "#ABABAB" }
                            : null
                        }
                        noMarginBottom
                      />
                      <UnitText>{field.unit}</UnitText>
                    </FlexDiv>
                  </React.Fragment>
                ))}
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
                {this.state.dataFields.map(
                  (field) =>
                    errors[field.value] &&
                    touched[field.value] && (
                      <AdminErrorMessage>
                        <span>Error: {errors[field.value]}</span>
                      </AdminErrorMessage>
                    )
                )}
                <SubmitButton
                  type="submit"
                  disabled={
                    isSubmitting ||
                    !touched.date ||
                    !this.state.dataFields.some(
                      (field) => !!values[field.value]
                    )
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
