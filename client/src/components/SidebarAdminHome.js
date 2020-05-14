import React, { Component } from "react";
import styled from "styled-components";
import { PAYPAL_WIDTH } from "./GlobalDeviceWidths";
import {
  SidebarSubheader,
  EmptyButton,
  ParentButton,
} from "./GlobalSidebarComponents";
import { useMediaQuery } from "react-responsive";
import Check from "../assets/checkbox.svg";

const ReviewContributions = styled.div`
  height: 85%;
  overflow-y: auto;
`;

const ReviewContributionsTitle = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const ReviewContributionsText = styled.small`
  font-size: 14px;
  line-height: 173.18%;
  color: #eecfcf;
`;

const Dropdown = styled.div`
  height: ${(props) => (props.isActive ? "13rem" : "0")};
`;

const ContributionsNumber = styled.div`
  background: #e76e6e;
  border-radius: 8.5px;

  color: #390303;
  min-width: 30px;
  padding-top: 0.1rem;
  padding-bottom: 0.1rem;

  text-align: center;
  font-size: 11px;
`;

const Contribution = styled.label`
  display: flex;
  margin-top: 0.4rem;

  span {
    font-size: 13px;
    line-height: 173.18%;
    color: #bababa;
    margin-left: 0.8rem;
  }
`;

const ApproveButton = styled(ParentButton)`
  background: #5e8968;
  border: 0.7px solid #85b790;
  box-sizing: border-box;
  border-radius: 14px;

  color: #b4d9bc;
  flex: 0.8;
`;

const DenyButton = styled(ParentButton)`
  background: #8a5555;
  border: 0.7px solid #c28a8a;
  box-sizing: border-box;
  border-radius: 14px;

  color: #e38787;
  flex: 0.8;
  margin-left: 0.8rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  visibility: ${(props) => (props.isActive ? "visible" : "hidden")};
`;

// ================ START OF CHECKBOX STYLES ================
const HiddenCheckbox = styled.input.attrs({ type: "checkbox" })`
  // Hide checkbox visually but remain accessible to screen readers.
  // Source: https://polished.js.org/docs/#hidevisually
  border: 0;
  clip: rect(0 0 0 0);
  clippath: inset(50%);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`;

const StyledCheckbox = styled.div`
  width: 13px;
  height: 13px;
  background: ${(props) => (props.checked ? "#535353" : "#3E3E3E")};
  border-radius: 2px;
  transition: all 150ms;
  position: relative;
`;

const CheckImg = styled.img`
  opacity: ${(props) => (props.checked ? "100%" : "0")};
  transition: opacity 150ms;
  width: 11px;
  position: absolute;
  bottom: 1px;
  left: 1px;
`;

const CheckboxContainer = styled.div`
  display: inline-block;
  vertical-align: middle;
  margin-top: 0.25rem;
`;

const Checkbox = ({ className, checked, ...props }) => (
  <CheckboxContainer className={className}>
    <HiddenCheckbox checked={checked} {...props} />
    <StyledCheckbox checked={checked}>
      <CheckImg src={Check} checked={checked} />
    </StyledCheckbox>
  </CheckboxContainer>
);

// ================ END OF CHECKBOX STYLES ================

const DefaultTitle = styled.h4`
  font-size: 14px;
  line-height: 173.18%;
  color: #c4c4c4;
`;

const ManageAdmins = styled.div``;

const LogoutButton = styled(EmptyButton)`
  position: absolute;
  width: ${({ isSmall }) => (isSmall ? "80%" : "85%")};
  bottom: ${({ isSmall }) => (isSmall ? "4.3rem" : "5.0rem")};
`;

class SidebarAdminHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSection: "",
      checked: false,
      data: {
        10000: {
          label: "Adjacent Coral Reef Total Seagrass Count",
          toValue: "20.20 Mg C/ha",
          checked: false,
        },
        20000: {
          label: "Adjacent Residential Inorganic Carbon Percentage",
          toValue: "11.30%",
          checked: false,
        },
        30000: {
          label: "Adjacent Residential",
          fromValue: "Disturbed",
          toValue: "Conserved",
          checked: false,
        },
        350000: {
          label: "Adjacent Residential",
          fromValue: "Disturbed",
          toValue: "Conserved",
          checked: false,
        },
      },
    };
  }

  setActiveSection = (section) => {
    const currSection = this.state.activeSection == section ? "" : section;
    this.setState({activeSection: currSection});
  };

  handleCheckboxChange = (event, key) => {
    this.setState({
      data: {
        ...this.state.data,
        [key]: {
          ...this.state.data[key],
          checked: event.target.checked,
        },
      },
    });
  };

  render() {
    return (
      <React.Fragment>
        <SidebarSubheader>Welcome, admin_123!</SidebarSubheader>
        <React.Fragment>
          <ReviewContributionsTitle
            onClick={() => this.setActiveSection("contributions")}
          >
            <ReviewContributionsText>
              Review Contributions&emsp;
            </ReviewContributionsText>
            <ContributionsNumber>21</ContributionsNumber>
          </ReviewContributionsTitle>
          <Dropdown isActive={this.state.activeSection == "contributions"}>
            <ReviewContributions
              isActive={this.state.activeSection == "contributions"}
            >
              {Object.entries(this.state.data).map(([key, value]) => (
                <Contribution key={key}>
                  <Checkbox
                    checked={value.checked}
                    onChange={(e) => this.handleCheckboxChange(e, key)}
                  />
                  <span>
                    Change {value.label}{" "}
                    {value.fromValue && "from " + value.fromValue} to{" "}
                    {value.toValue}
                  </span>
                </Contribution>
              ))}
              <br />
            </ReviewContributions>
            <ButtonGroup isActive={this.state.activeSection == "contributions"}>
              <ApproveButton>Approve</ApproveButton>
              <DenyButton>Deny</DenyButton>
            </ButtonGroup>
          </Dropdown>
        </React.Fragment>
        <DefaultTitle>Modify Data on Map</DefaultTitle>
        <ManageAdmins>
          <DefaultTitle>Manage Administrators</DefaultTitle>
        </ManageAdmins>
        <LogoutButton isSmall={window.innerWidth <= PAYPAL_WIDTH}>
          Log out
        </LogoutButton>
      </React.Fragment>
    );
  }
}

export default SidebarAdminHome;
