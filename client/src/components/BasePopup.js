import React, { Component } from "react";
import styled from "styled-components";
import getData from "../dataFields";
import { Formik, Form, Field } from "formik";
import { CustomErrorMessage } from "./GlobalSidebarComponents";
import api from "../services/sitedata-services";
import * as Yup from "yup";

const StatusBoxColors = {
  DISTURBED: {
    background: "#FFEBD8",
    border: "#F58E2E",
    font: "#DC6A00",
  },
  CONSERVED: {
    background: "#E8FFED",
    border: "#2DB44B",
    font: "#0A8324",
  },
};

const PopupImage = styled.div`
  height: 106px;
  background-color: #c4c4c4;
`;

const AreaInfo = styled.div`
  height: 100%;
  padding: 1rem;
  padding-top: 0.7rem;
`;

const AreaName = styled.strong`
  font-weight: 600;
  font-size: 13px;
  line-height: 16px;
  margin-right: 1rem;
`;

const StatusBox = styled.div`
  max-width: 80px;
  background: ${(props) => StatusBoxColors[props.status]["background"]};
  border: 0.7px solid ${(props) => StatusBoxColors[props.status]["border"]};
  box-sizing: border-box;
  border-radius: 7px;
  padding: 0.15rem 0.55rem;
  margin-top: 0.3rem;
  margin-bottom: 0.5rem;

  font-weight: 600;
  font-size: 7px;
  line-height: 10px;
  text-align: center;
  color: ${(props) => StatusBoxColors[props.status]["font"]};
`;

const FieldsDiv = styled.div`
  max-height: 4rem;
  overflow-y: auto;
`;

const InfoStat = styled.span`
  font-size: 11px;
  color: #767676;
`;

const ModifyButton = styled.button`
  margin-top: 0.7rem;
  padding: 0.2rem;
  padding-left: 0.7rem;
  padding-right: 0.7rem;

  border: ${({ disabled }) => (disabled ? "0.7px solid #c4c4c4" : "none")};
  box-sizing: border-box;
  border-radius: 9.5px;
  background-color: ${({ disabled }) => (disabled ? "#f9f9f9" : "#7C7C7C;")};

  font-weight: 600;
  font-size: 9px;
  line-height: 12px;
  text-align: center;
  color: ${({ disabled }) => (disabled ? "#aeaeae" : "#F9F9F9")};
`;

const ModifyField = styled(Field)`
  background: #f2f2f2;
  border: 0.7px solid #ececec;
  box-sizing: border-box;
  border-radius: 2px;

  color: #767676;
  width: ${({ isLong }) => isLong ? "80px" : "30px"};
`;

const DataErrorMessage = styled(CustomErrorMessage)`
  font-size: 11px;
  margin-bottom: 0.4rem;
`;

const validationSchema = (dataFields) =>
  Yup.object().shape({
    status: Yup.string()
      .uppercase()
      .matches(/\bCONSERVED\b|\bDISTURBED\b/, "Status must be either CONSERVED or DISTURBED"),
    ...dataFields.reduce(
      (obj, item) => ({
        ...obj,
        ...{
          [item.value]: Yup.number()
            .typeError(`${item.label} must be a number`)
            .min(0),
        },
      }),
      {}
    ),
  });

class BasePopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      dataFields: [],
    };
  }

  render() {
    const { properties, isModifyingData } = this.props;

    return (
      <React.Fragment>
        <PopupImage />
        <AreaInfo>
          <Formik
            initialValues={{
              status: properties.status,
              ...this.props.dataFields.reduce(
                (obj, item) => ({
                  ...obj,
                  ...{
                    [item.value]: properties[item.value] || "",
                  },
                }),
                {}
              ),
            }}
            onSubmit={async (values, { setSubmitting }) => {
              setSubmitting(false);
              Object.filter = (obj, predicate) =>
                Object.keys(obj)
                  .filter((key) => predicate(obj[key]))
                  .reduce((res, key) => ((res[key] = obj[key]), res), {});
              const filteredValues = Object.filter(values, (field) => !isNaN(field));

              await api
                .updateData(properties._id, {
                  ...filteredValues,
                  ...properties,
                })
                .then((data) => {
                  window.location.reload();
                })
                .catch((err) => {
                  this.setState({ error: err });
                });
            }}
            validationSchema={() => validationSchema(this.props.dataFields)}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form>
                <AreaName>
                  {properties.areaName ||
                    properties.coordinates
                      .reverse()
                      .map((coord) => coord.toFixed(4))
                      .join(", ")}{" "}
                  | {properties.year}
                </AreaName>
                {isModifyingData ? (
                  <ModifyField
                    name="status"
                    defaultValue={properties.status}
                    isLong
                  />
                ) : (
                  properties.status && (
                    <StatusBox status={properties.status}>
                      {properties.status}
                    </StatusBox>
                  )
                )}
                <FieldsDiv>
                  {this.state.error && (
                    <DataErrorMessage>
                      <span>Error: {this.state.error}</span>
                    </DataErrorMessage>
                  )}
                  {Object.keys(errors).map(
                    (key) =>
                      errors[key] &&
                      touched[key] && (
                        <DataErrorMessage>
                          <span>Error: {errors[key]}</span>
                        </DataErrorMessage>
                      )
                  )}
                  {this.props.dataFields.map((field) =>
                    isModifyingData ? (
                      <React.Fragment>
                        <InfoStat>
                          {this.props.parameter === field.value ? (
                            <strong>{field.label}:</strong>
                          ) : (
                            field.label + ":"
                          )}{" "}
                          <ModifyField
                            name={field.value}
                            defaultValue={properties[field.value]}
                          />{" "}
                          {field.unit || ""}
                        </InfoStat>
                        <br />
                      </React.Fragment>
                    ) : (
                      !isNaN(properties[field.value]) && (
                        <React.Fragment>
                          <InfoStat>
                            {this.props.parameter === field.value ? (
                              <strong>{field.label}:</strong>
                            ) : (
                              field.label + ":"
                            )}{" "}
                            <strong>{`${properties[field.value]} ${
                              field.unit || ""
                            }`}</strong>
                          </InfoStat>
                          <br />
                        </React.Fragment>
                      )
                    )
                  )}
                </FieldsDiv>
                <ModifyButton type="submit" disabled={!isModifyingData}>
                  Modify Data
                </ModifyButton>
              </Form>
            )}
          </Formik>
        </AreaInfo>
      </React.Fragment>
    );
  }
}

export default BasePopup;
