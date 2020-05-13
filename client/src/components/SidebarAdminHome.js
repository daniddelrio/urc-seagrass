import React, { Component } from "react";
import styled from "styled-components";
import { PAYPAL_WIDTH } from "./GlobalDeviceWidths";
import { SidebarSubheader, EmptyButton } from "./GlobalSidebarComponents";
import { useMediaQuery } from 'react-responsive';

const ReviewContributions = styled.div`
  
`;

const ReviewContributionsTitle = styled.div`
  display: flex;
  align-items: center;
`;

const ReviewContributionsText = styled.small`
  font-size: 12px;
  line-height: 173.18%;
  color: #EECFCF;
`;

const ContributionsNumber = styled.div`
  background: #E76E6E;
  border-radius: 8.5px;

  color: #390303;
  min-width: 30px;
  padding-top: 0.1rem;
  padding-bottom: 0.1rem;

  text-align: center;
  font-size: 11px;
`;

const DefaultTitle = styled.h4`

  font-size: 12px;
  line-height: 173.18%;
  color: #C4C4C4;
`;

const ManageAdmins = styled.div`

`;

const LogoutButton = styled(EmptyButton)`
  position: absolute;
  width: ${({ isSmall }) => isSmall ? "80%" : "85%"};
  bottom: ${({ isSmall }) => isSmall ? "4.3rem" : "5.0rem"};
`;

class SidebarAdminHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSection: "",
    };
  }

  render() {
    return (
      <React.Fragment>
        <SidebarSubheader>
          Welcome, admin_123!
        </SidebarSubheader>
        <ReviewContributions>
          <ReviewContributionsTitle>
            <ReviewContributionsText>Review Contributions&emsp;</ReviewContributionsText>
            <ContributionsNumber>21</ContributionsNumber>
          </ReviewContributionsTitle>
        </ReviewContributions>
        <DefaultTitle>Modify Data on Map</DefaultTitle>
        <ManageAdmins>
          <DefaultTitle>Manage Administrators</DefaultTitle>
        </ManageAdmins>
        <LogoutButton isSmall={window.innerWidth <= PAYPAL_WIDTH}>Log out</LogoutButton>
      </React.Fragment>
    );
  }
}

export default SidebarAdminHome;
