import React, { Component } from "react";
import styled from "styled-components";

const MapFrame = styled.div`
  position: absolute;
  width: 170px;
  height: 190px;
  background: rgba(255, 255, 255, 0.5);
  padding: 0.5rem 0.7rem;

  bottom: ${({ isStatusShowing }) => isStatusShowing ? "55px" : "30px"};
  left: 30px;

  z-index: 3;

  @media screen and (max-width: 850px) {
    width: 130px;
    height: 150px;
  }
`;

const ListDiv = styled.div`
  display: flex;
  align-items: center;
  margin-top: ${({ noMargin }) => noMargin ? 0 : "0.3rem"};
  box-sizing: border-box;

  @media screen and (max-width: 850px) {
    margin-top: ${({ noMargin }) => noMargin ? 0 : "0.15rem"};
  }
`;

const SquarePoint = styled.div`
  width: 10px;
  height: 10px;
  background: ${({ background }) => background || "none"};
  border: 2px solid
    ${({ borderColor, background }) => borderColor || background};
  margin-right: 10px;
  flex-shrink: 0;

  @media screen and (max-width: 850px) {
    width: 8px;
    height: 8px;
  }
`;

const LegendText = styled.span`
  font-size: 13px;
  font-weight: 600;
  font-family: Open Sans;
  color: ${({ color }) => color};

  @media screen and (max-width: 850px) {
    font-size: 10px;
  }
`;

const ListItem = (props) => (
  <ListDiv noMargin={props.noMargin}>
    <SquarePoint
      background={props.background}
      borderColor={props.borderColor}
    />
    <LegendText color={props.color}>{props.text}</LegendText>
  </ListDiv>
);

const MapLegend = React.memo((props) => {
  return (
    <React.Fragment>
      <MapFrame isStatusShowing={props.isStatusShowing}>
        <ListItem text="Disturbed" borderColor="#E22626" color="#B42B2B" noMargin />
        <ListItem text="Conserved" borderColor="#19B43B" color="#07A52A" />
        <ListItem text="Does not satisfy DAO standards" background="#FFC3C3" color="#B42B2B" />
        <ListItem text="Satisfies DAO, not ASEAN standards" background="#FFDCBC" color="#EE7E16" />
        <ListItem text="Satisfies DAO and ASEAN standards" background="#C5F9D0" color="#07A52A" />
      </MapFrame>
    </React.Fragment>
  );
});

export default MapLegend;
