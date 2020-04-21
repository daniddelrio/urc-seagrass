import React, { Component } from 'react';
import styled from 'styled-components';

const StatusBoxColors = {
  DISTURBED: {
    background: "#FFEBD8",
    border: "#F58E2E", 
    font: "#DC6A00"
  },
  CONSERVED: {
    background: "#E8FFED",
    border: "#2DB44B", 
    font: "#0A8324"
  }
};

const BaseFrame = styled.div`
  width: 221px;
  height: 230px;
  background-color: #F9F9F9;

  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
`

const PopupImage = styled.div`
  height: 106px;
  background-color: #C4C4C4;
`

const AreaInfo = styled.div`
  height: 100%;
  padding: 1.0rem;
  padding-top: 0.7rem;
`

const AreaHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 0.2rem;
`

const AreaName = styled.strong`
  font-weight: 600;
  font-size: 13px;
  line-height: 16px;
  margin-right: 0.4rem;
`

const StatusBox = styled.div`
  max-width: 150px;
  background: ${props => StatusBoxColors[props.status]["background"]};
  border: 0.7px solid ${props => StatusBoxColors[props.status]["border"]};
  box-sizing: border-box;
  border-radius: 7px;
  padding: 0.15rem;
  padding-left: 0.55rem;
  padding-right: 0.55rem;

  font-weight: 600;
  font-size: 7px;
  line-height: 10px;
  text-align: center;
  color: ${props => StatusBoxColors[props.status]["font"]};
`

const InfoStat = styled.span`
  font-size: 11px;
  color: #767676;
`

const ModifyButton = styled.button`
  margin-top: 0.7rem;
  padding: 0.2rem;
  padding-left: 0.7rem;
  padding-right: 0.7rem;

  border: 0.7px solid #C4C4C4;
  box-sizing: border-box;
  border-radius: 9.5px;
  background-color: #F9F9F9;

  font-weight: 600;
  font-size: 9px;
  line-height: 12px;
  text-align: center;
  color: #AEAEAE;
`

const BoxArrow = styled.div`
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 20px solid #F9F9F9;
  margin: 0 auto;
  margin-top: 2px;

  filter: drop-shadow(0 4px 4px rgba(0, 0, 0, 0.1));
  -webkit-filter: drop-shadow(0 4px 4px rgba(0, 0, 0, 0.1));
`

class BasePopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      areaName: "Adjacent Residential",
      status: "CONSERVED",
      seagrassCount: 13.74,
      percentage: 11.30
    };
  }

  render() {
    const { areaName, status, seagrassCount, percentage } = this.state

    return (
      <BaseFrame>
        <div>
          <PopupImage />
          <AreaInfo>
            <AreaHeader>
              <AreaName>{ areaName }</AreaName>
              <StatusBox status={status}>{ status }</StatusBox>
            </AreaHeader>
            <InfoStat>Total Seagrass Count: <strong>{seagrassCount}</strong></InfoStat>
            <br />
            <InfoStat>Inorganic Carbon Percentage: <strong>{percentage}</strong></InfoStat>
            <ModifyButton disabled>
              Modify Data
            </ModifyButton>
          </AreaInfo>
        </div>
        <BoxArrow />
      </BaseFrame>
    );
  }
}

export default BasePopup;
