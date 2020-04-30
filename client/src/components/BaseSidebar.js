import React, { Component } from "react";
import styled from "styled-components";
import PayPal from "../assets/paypal.svg";

const SidebarFrame = styled.div`
  position: relative;
  width: 40%;
  height: 88vh;
  background: #474747;

  padding: 2rem;
`;

const SidebarTitle = styled.h1`
  font-size: 17px;
  line-height: 163.18%;
  color: #ECECEC;
`

const SidebarSubheader = styled.h1`
  font-size: 14px;
  line-height: 198.18%;
  color: #9F9F9F;
`

const ButtonDiv = styled.div`
  display: flex;
  width: 100%;
  margin-top: 2rem;
`

const ParentButton = styled.button`
  padding: 0.5rem;

  border-radius: 15.5px;
  box-sizing: border-box;

  font-weight: 600;
  font-size: 10px;
  line-height: 12px;
  text-align: center;
`

const FilledButton = styled(ParentButton)`
  flex: 1;
  background: #C4C4C4;
  border: 0.7px solid #C4C4C4;

  color: #474747;
`;

const EmptyButton = styled(ParentButton)`
  flex: 1;
  background: #474747;
  border: 0.7px solid #C4C4C4;
  margin-left: ${(props) => props.marginLeft || 0};

  color: #C4C4C4;
`;

const PayPalDiv = styled(ButtonDiv)`
  position: absolute;
  bottom: 2rem;
  align-items: center;
`;

const PayPalText = styled(SidebarSubheader)`
  font-size: 13px;
  flex: 0.75;
`;

const PayPalButton = styled(ParentButton)`
  padding: 0.2rem;
  padding-left: 1rem;
  padding-right: 1rem;
  background: #FFBC32;
  color: #63470F;

  display: flex;
  align-items: center;
`;

class BaseSidebar extends Component {
  render() {
    return (
      <SidebarFrame>
        <SidebarTitle>URC Seagrass & Carbon Stocks Database</SidebarTitle>
        <SidebarSubheader>Welcome to the database of Masinloc’s Seagrass and Carbon Stocks! Log in as...</SidebarSubheader>
        <ButtonDiv>
          <FilledButton>Administrator</FilledButton>
          <EmptyButton marginLeft="0.4rem">Contributor</EmptyButton>
        </ButtonDiv>

        <PayPalDiv>
          <PayPalText>Want to help the initiative?</PayPalText>
          <PayPalButton>Support us via  &nbsp;<img src={PayPal} /></PayPalButton>
        </PayPalDiv>
      </SidebarFrame>
    );
  }
}

export default BaseSidebar;
