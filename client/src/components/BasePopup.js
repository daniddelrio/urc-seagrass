import React, { Component } from "react";
import styled from "styled-components";
import dataFields from "../dataFields";
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

const AreaHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 0.2rem;
`;

const AreaName = styled.strong`
  font-weight: 600;
  font-size: 13px;
  line-height: 16px;
  margin-right: 0.4rem;
`;

const StatusBox = styled.div`
  max-width: 150px;
  background: ${(props) => StatusBoxColors[props.status]["background"]};
  border: 0.7px solid ${(props) => StatusBoxColors[props.status]["border"]};
  box-sizing: border-box;
  border-radius: 7px;
  padding: 0.15rem;
  padding-left: 0.55rem;
  padding-right: 0.55rem;

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
  width: 30px;
`;

const DataErrorMessage = styled(CustomErrorMessage)`
  font-size: 11px;
  margin-bottom: 0.4rem;
`;

const validationSchema = Yup.object().shape({
  ...dataFields.reduce(
    (obj, item) => ({
      ...obj,
      ...{
        [item.value]: Yup.number().typeError(`${item.label} must be a number`).min(0),
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
    };
  }

  render() {
    const { properties, isModifyingData } = this.props;

    return (
      <React.Fragment>
        <PopupImage />
        <AreaInfo>
          <AreaHeader>
            <AreaName>{properties.areaName}</AreaName>
            {properties.status && (
              <StatusBox status={properties.status}>
                {properties.status}
              </StatusBox>
            )}
          </AreaHeader>
          <Formik
            initialValues={{
              ...dataFields.reduce(
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
              const filteredValues = Object.filter(
                values,
                (field) => !!field
              );

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
            validationSchema={validationSchema}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form>
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
                {dataFields.map((field) =>
                  isModifyingData ? (
                    <React.Fragment>
                      <InfoStat>
                        {field.label}: <ModifyField 
                          name={field.value}
                          defaultValue={properties[field.value]}
                        /> {field.unit}
                      </InfoStat>
                      <br />
                    </React.Fragment>
                  ) : (
                    properties[field.value] && (
                      <React.Fragment>
                        <InfoStat>
                          {field.label}:{" "}
                          <strong>{`${properties[field.value]} ${
                            field.unit
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
