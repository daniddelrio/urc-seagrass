import React, { Component } from "react";
import styled from "styled-components";
import { Formik, Form, Field } from "formik";
import { CustomErrorMessage } from "./GlobalSidebarComponents";
import api from "../services/sitedata-services";
import { uploadSiteImage, updateCoords } from "../services/siteCoord-services";
import * as Yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import mapValues from "lodash/mapValues";

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
  height: 150px;
  width: auto;
  background: ${({ backgroundImage }) =>
    backgroundImage
      ? `url(${backgroundImage}) center/cover no-repeat`
      : "#c4c4c4"};
  position: relative;
`;

const UploadLabel = styled.label`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(232, 232, 232, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
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
  width: ${({ isLong, isVeryLong }) =>
    isVeryLong ? "150px" : isLong ? "80px" : "30px"};
  margin-right: ${({ isVeryLong }) => (isVeryLong ? "1rem" : 0)};
`;

const DataErrorMessage = styled(CustomErrorMessage)`
  font-size: 11px;
  margin-bottom: 0.4rem;
`;

const lazyValidationSchema = (dataFields) =>
  Yup.lazy((obj) =>
    Yup.object(
      mapValues(obj, (value, key) => {
        if (key == "areaName") {
          return Yup.string().required();
        }
        if (key == "siteCode") {
          return Yup.string();
        }
        if (key == "status") {
          return Yup.string()
            .uppercase()
            .matches(
              /\bCONSERVED\b|\bDISTURBED\b/,
              "Status must be either CONSERVED or DISTURBED"
            );
        }
        const doesKeyInclude = dataFields.reduce(
          (accumulator, field) => accumulator || key.includes(field._id),
          false
        );
        if (doesKeyInclude) {
          return Yup.number()
            .typeError(`All parameters must be numbers`)
            .min(0);
        }
      })
    )
  );

class BasePopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      dataFields: [],
      image: {
        preview: "",
        raw: "",
      },
    };
  }

  _arrayBufferToBase64 = (buffer) => {
    var binary = "";
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  handleChange = (e) => {
    if (e.target.files.length) {
      this.setState({
        image: {
          preview: URL.createObjectURL(e.target.files[0]),
          raw: e.target.files[0],
        },
      });
    }
  };

  handleSubmit = async (properties, values) => {
    Object.filter = (obj, predicate) =>
      Object.keys(obj)
        .filter((key) => predicate(obj[key]))
        .reduce((res, key) => ((res[key] = obj[key]), res), {});
    let tempParams = Object.entries(
      Object.filter(values, (field) => !isNaN(field) && !!field)
    );
    tempParams = tempParams.reduce((acc, param) => {
      const paramId = param[0].split("_")[0];
      const paramIfExists = acc.findIndex((elem) =>
        elem.hasOwnProperty(paramId)
      );
      if (paramIfExists != -1) {
        acc[paramIfExists][paramId] = acc[paramIfExists][paramId].concat([
          param[1],
        ]);
      } else {
        acc.push({ [paramId]: [param[1]] });
      }
      return acc;
    }, []);

    const parameters = tempParams.map(param => {
      const [key, value] = Object.entries(param)[0];
      return {
        paramId: key,
        paramValues: value
      }
    })

    const formData = new FormData();
    formData.append("file", this.state.image.raw);
    const config = { headers: { "Content-Type": "multipart/form-data" } };

    await Promise.all([
      await api
        .updateData(properties._id, {
          status: values.status,
          parameters,
        })
        .then((data) => {
          console.log(data);
        })
        .catch((err) => {
          console.log(err);
          this.setState({ error: err });
        }),
      await updateCoords(properties.coordId, {
        properties: {
          areaName: values.areaName,
          siteCode: values.siteCode,
        },
      })
        .then((data) => {
          console.log(data);
        })
        .catch((err) => {
          console.log(err);
          this.setState({ error: err });
        }),
      this.state.image.preview &&
        (await uploadSiteImage(properties.coordId, formData, config).catch(
          (err) => {
            console.log(err);
            this.setState({ error: err });
          }
        )),
    ])
      .then((data) => {
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
        this.setState({ error: err });
      });
  };

  render() {
    const { properties, isModifyingData } = this.props;

    return (
      <React.Fragment>
        <PopupImage
          backgroundImage={
            (isModifyingData && this.state.image.preview) ||
            (properties.image &&
              `data:${
                properties.image.contentType
              };base64,${this._arrayBufferToBase64(
                properties.image.data.data
              )}`) ||
            null
          }
        >
          {isModifyingData && (
            <React.Fragment>
              <UploadLabel htmlFor="upload-button">
                <FontAwesomeIcon size="3x" icon={faCamera} />
              </UploadLabel>
              <input
                type="file"
                id="upload-button"
                style={{ display: "none" }}
                onChange={this.handleChange}
              />
            </React.Fragment>
          )}
        </PopupImage>
        <AreaInfo>
          <Formik
            initialValues={{
              areaName: properties.areaName,
              status: properties.status,
              siteCode: properties.siteCode,
              ...this.props.dataFields.reduce((obj, item) => {
                const param = properties.parameters.find(
                  (param) => param.paramId == item._id
                );
                if (param && param.paramValues.length > 0) {
                  const reduction = param.paramValues.reduce(
                    (accumulator, currParamValue, idx) => ({
                      ...accumulator,
                      [item._id + "_" + (idx + 1)]: currParamValue,
                    }),
                    {}
                  );
                  return {
                    ...obj,
                    ...reduction,
                  };
                }

                return {
                  ...obj,
                  ...{
                    [item._id + "_1"]: "",
                  },
                };
              }, {}),
            }}
            onSubmit={async (values, { setSubmitting }) => {
              setSubmitting(false);
              await this.handleSubmit(properties, values);
            }}
            validationSchema={() => lazyValidationSchema(this.props.dataFields)}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form>
                {isModifyingData ? (
                  <ModifyField
                    name="areaName"
                    defaultValue={properties.areaName}
                    isVeryLong
                  />
                ) : (
                  <AreaName>
                    {properties.areaName ||
                      properties.coordinates
                        .reverse()
                        .map((coord) => coord.toFixed(4))
                        .join(", ")}{" "}
                    | {properties.year}
                  </AreaName>
                )}
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
                  {isModifyingData && (
                    <InfoStat>
                      Site Code: &nbsp;{" "}
                      <ModifyField
                        name="siteCode"
                        defaultValue={properties.siteCode}
                      />
                      <br />
                    </InfoStat>
                  )}
                  {this.props.dataFields.map((field) => {
                    const param = properties.parameters.find(
                      (param) => param.paramId == field._id
                    );
                    return isModifyingData ? (
                      param && param.paramValues.length > 0 ? (
                        param.paramValues.map((currParamValue, index) => (
                          <React.Fragment>
                            <InfoStat>
                              {this.props.parameter === field.value ? (
                                <strong>
                                  {field.label + " #" + (index + 1)}:
                                </strong>
                              ) : (
                                field.label + " #" + (index + 1) + ":"
                              )}{" "}
                              <ModifyField
                                name={field._id + "_" + (index + 1)}
                                defaultValue={currParamValue}
                              />{" "}
                              {field.unit || ""}
                            </InfoStat>
                            <br />
                          </React.Fragment>
                        ))
                      ) : (
                        <React.Fragment>
                          <InfoStat>
                            {this.props.parameter === field.value ? (
                              <strong>{field.label}:</strong>
                            ) : (
                              field.label + ":"
                            )}{" "}
                            <ModifyField
                              name={field._id + "_1"}
                              defaultValue={""}
                            />{" "}
                            {field.unit || ""}
                          </InfoStat>
                          <br />
                        </React.Fragment>
                      )
                    ) : (
                      param && !isNaN(param.paramAverage) && (
                        <React.Fragment>
                          <InfoStat>
                            {this.props.parameter === field.value ? (
                              <strong>{field.label}:</strong>
                            ) : (
                              field.label + ":"
                            )}{" "}
                            <strong>{`${param.paramAverage} ${field.unit ||
                              ""}`}</strong>
                          </InfoStat>
                          <br />
                        </React.Fragment>
                      )
                    );
                  })}
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
