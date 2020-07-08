import React, { PureComponent } from "react";
import styled from "styled-components";
import dataFields from "../dataFields";

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

const InfoStat = styled.span`
  font-size: 11px;
  color: #767676;
`;

const ModifyButton = styled.button`
  margin-top: 0.7rem;
  padding: 0.2rem;
  padding-left: 0.7rem;
  padding-right: 0.7rem;

  border: 0.7px solid #c4c4c4;
  box-sizing: border-box;
  border-radius: 9.5px;
  background-color: #f9f9f9;

  font-weight: 600;
  font-size: 9px;
  line-height: 12px;
  text-align: center;
  color: #aeaeae;
`;

class BasePopup extends PureComponent {
  render() {
    const { properties } = this.props;

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
          {dataFields.map(
            (field) =>
              properties[field.value] && (
                <React.Fragment>
                  <InfoStat>
                    {field.label}: <strong>{properties[field.value]}</strong>
                  </InfoStat>
                  <br />
                </React.Fragment>
              )
          )}
          <ModifyButton disabled>Modify Data</ModifyButton>
        </AreaInfo>
      </React.Fragment>
    );
  }
}

export default BasePopup;
