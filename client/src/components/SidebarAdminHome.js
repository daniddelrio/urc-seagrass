import React, { Component } from "react";
import styled from "styled-components";
import { PAYPAL_WIDTH } from "./GlobalDeviceWidths";
import {
  SidebarSubheader,
  EmptyButton,
  ParentButton,
  GrayButton,
  AdminTextField,
  FilledButton,
} from "./GlobalSidebarComponents";
import { useMediaQuery } from "react-responsive";
import ContributionPopup from "./ContributionPopup";
import Check from "../assets/checkbox.svg";
import AdminIcon from "../assets/adminIcon.svg";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

const ReviewContributions = styled.div`
  height: 85%;
  overflow-y: auto;
`;

const ReviewContributionsTitle = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const ReviewContributionsText = styled.h4`
  font-size: 0.88em;
  line-height: 173.18%;
  color: #eecfcf;
`;

const Dropdown = styled.div`
  height: ${(props) => (props.isActive ? "13rem" : "0")};
  margin-bottom: ${(props) => (props.isActive ? "0.75rem" : "0")};
  transition: 0.5s height;
`;

const ContributionsNumber = styled(ReviewContributionsText)`
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

const DisabledButton = styled(ParentButton)`
  background: #474747;
  border: 0.7px solid #646464;
  box-sizing: border-box;
  border-radius: 14px;

  color: #8a8a8a;
  flex: 0.8;
  margin-left: ${(props) => props.marginLeft || "0"};
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

  // max-height: ${(props) => (props.isActive ? "20rem" : "0")};
  // transition: 0.5s max-height;
  // height: ${(props) => (props.isActive ? "20rem" : "0")};
  // transition: 0.5s height;
const DropdownAdmin = styled.div`
  visibility: ${(props) => (props.isActive ? "visible" : "hidden")};
`;

const DefaultTitle = styled.h4`
  font-size: 0.88em;
  line-height: 173.18%;
  color: #c4c4c4;

  cursor: pointer;
`;

const ManageAdmins = styled.div`
  max-height: 60%;
  overflow-y: auto;
`;
  // visibility: ${(props) => (props.isActive ? "visible" : "hidden")};

const Administrator = styled.div`
  display: flex;
  margin-bottom: 0.6rem;
`;

const AdminUsername = styled.div`
  font-size: 0.8em;
  color: #bababa;
  margin-left: 1rem;
`;

const ModifyText = styled.div`
  margin-left: auto;
  font-size: 0.56em;
  color: #af7b7b;
  border-bottom: 0.7px solid #865d5d;

  cursor: pointer;
`;

const AddAdmin = styled.div`
  padding: 0.5rem 0.8rem;
  box-sizing: border-box;
  background: #585858;
  border-radius: 12.5px;

  font-weight: 600;
  font-size: 0.75em;
  line-height: 0.75em;

  color: #a5a5a5;

  width: 100%;
  max-height: ${(props) => (props.isShowing ? "15rem" : "1.7rem")};
  visibility: ${(props) => (props.isActive ? "visible" : "hidden")};
  margin-bottom: 1.4rem;

  transition: max-height 0.4s;

  span {
    cursor: pointer;
  }
`;

const ModifyAdmin = styled(AddAdmin)`
  height: auto;
  visibility: ${(props) => (props.isShowing ? "visible" : "hidden")};
`;

const AdminFields = styled.div`
  opacity: ${(props) => (props.isShowing ? "100%" : "0%")};
  transition: opacity 0.4s;

  padding-top: 1rem;
  padding-bottom: 0.1rem;
`;

const TextField = styled(AdminTextField)`
  font-size: 1em;
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 0.4rem;
`;

const SubmitAdminButton = styled(FilledButton)`
  font-size: 0.9em;
  min-width: 45%;
  margin-top: 0.5rem;
  margin-bottom: 0.25rem;
`;

const validationSchema = Yup.object({
  username: Yup
    .string()
    .required("No username provided"),
  password1: Yup
    .string()
    .required("No password provided"),
  password2: Yup
    .string()
    .oneOf([Yup.ref('password1'), null], "Passwords don't match")
    .required("Please retype your password"),
});

class SidebarAdminHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSection: "",
      showModal: "",
      isAdminShowing: false,
      checked: false,
      data: [
        {
          id: 10000,
          label: "Adjacent Coral Reef Total Seagrass Count",
          toValue: "20.20 Mg C/ha",
          checked: false,
        },
        {
          id: 20000,
          label: "Adjacent Residential Inorganic Carbon Percentage",
          toValue: "11.30%",
          checked: false,
        },
        {
          id: 30000,
          label: "Adjacent Residential",
          fromValue: "Disturbed",
          toValue: "Conserved",
          checked: false,
        },
        {
          id: 40000,
          label: "Adjacent Residential",
          fromValue: "Disturbed",
          toValue: "Conserved",
          checked: false,
        },
      ],
      admins: [
        {
          id: 10000,
          username: "JohnDoe51",
          showingModify: false,
        },
        {
          id: 12321,
          username: "Anonymous",
          showingModify: false,
        },
        {
          id: 12121,
          username: "Anonymous",
          showingModify: false,
        },
        {
          id: 12351,
          username: "Anonymous",
          showingModify: false,
        },
      ],
    };
  }

  componentDidMount() {
    this.props.showLoginButton();
  }

  setActiveSection = (section) => {
    const currSection = this.state.activeSection == section ? "" : section;
    this.setState({ activeSection: currSection });
  };

  toggleModify = (index) => {
    this.setState({
      admins: {
        ...this.state.admins,
        [index]: {
          ...this.state.admins[index],
          showingModify: !this.state.admins[index].showingModify,
        },
      },
    });
  };

  setModal = (kind) => {
    this.setState({ showModal: kind });
  };

  closeModal = () => {
    this.setState({ showModal: "" });
  };

  toggleAdmin = () => {
    this.setState({ isAdminShowing: !this.state.isAdminShowing });
  };

  handleCheckboxChange = (event, index) => {
    this.setState({
      data: {
        ...this.state.data,
        [index]: {
          ...this.state.data[index],
          checked: event.target.checked,
        },
      },
    });
  };

  render() {
    const noneChecked = Object.values(this.state.data).every(
      (value) => !value.checked
    );

    Object.filter = (obj, predicate) =>
      Object.keys(obj)
        .filter((key) => predicate(obj[key]))
        .reduce((res, key) => ((res[key] = obj[key]), res), {});

    const checkedContribs = Object.filter(
      this.state.data,
      (data) => data.checked
    );

    return (
      <React.Fragment>
        <ContributionPopup
          show={this.state.showModal != ""}
          isApprove={this.state.showModal == "approve"}
          closeModal={this.closeModal}
          data={checkedContribs}
        />
        <SidebarSubheader>Welcome, admin_123!</SidebarSubheader>
        <React.Fragment>
          <ReviewContributionsTitle
            onClick={() => this.setActiveSection("contributions")}
          >
            <ReviewContributionsText>
              Review Contributions&emsp;
            </ReviewContributionsText>
            <ContributionsNumber>
              {Object.keys(this.state.data).length}
            </ContributionsNumber>
          </ReviewContributionsTitle>
          <Dropdown isActive={this.state.activeSection == "contributions"}>
            <ReviewContributions>
              {Object.entries(this.state.data).map(([key, value]) => (
                <Contribution key={value.id}>
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
              {noneChecked ? (
                <DisabledButton disabled>Approve</DisabledButton>
              ) : (
                <ApproveButton onClick={() => this.setModal("approve")}>
                  Approve
                </ApproveButton>
              )}
              {noneChecked ? (
                <DisabledButton marginLeft="0.8rem" disabled>
                  Deny
                </DisabledButton>
              ) : (
                <DenyButton onClick={() => this.setModal("deny")}>
                  Deny
                </DenyButton>
              )}
            </ButtonGroup>
          </Dropdown>
        </React.Fragment>
        <DefaultTitle>Modify Data on Map</DefaultTitle>
        <React.Fragment>
          <DefaultTitle onClick={() => this.setActiveSection("manageAdmins")}>
            Manage Administrators
          </DefaultTitle>
          <DropdownAdmin isActive={this.state.activeSection == "manageAdmins"}>
            <ManageAdmins isActive={this.state.activeSection == "manageAdmins"}>
              {Object.entries(this.state.admins).map(([key, value]) => (
                <React.Fragment>
                  <Administrator key={value.id}>
                    <img src={AdminIcon} alt="Admin Avatar" />
                    <AdminUsername>{value.username}</AdminUsername>
                    <ModifyText onClick={() => this.toggleModify(key)}>{value.showingModify ? "Cancel" : "Modify"}</ModifyText>
                  </Administrator>
                  {value.showingModify && (
                    <ModifyAdmin
                      isShowing={value.showingModify && this.state.activeSection == "manageAdmins"}
                      key={"addAdmin" + key}
                    >
                      <span onClick={() => this.toggleModify(key)}>
                        Modify {value.username}
                      </span>
                      <Formik
                        initialValues={{
                          username: value.username,
                          password1: "",
                          password2: "",
                        }}
                        onSubmit={(values, { setSubmitting }) => {
                          setSubmitting(false);
                        }}
                        validationSchema={validationSchema}
                      >
                        {({ isSubmitting }) => (
                          <Form>
                            <AdminFields
                              isActive={value.showingModify}
                              isShowing={value.showingModify}
                            >
                              <ErrorMessage name="username" />
                              <TextField 
                                name="username"
                                placeholder="Username" 
                              />
                              <ErrorMessage name="password1" />
                              <TextField
                                name="password1"
                                inputType="password"
                                placeholder="Password"
                                type="password"
                              />
                              <ErrorMessage name="password2" />
                              <TextField
                                name="password2"
                                inputType="password"
                                placeholder="Retype Password"
                                type="password"
                              />
                              <SubmitAdminButton>Modify Admin</SubmitAdminButton>
                            </AdminFields>
                          </Form>
                        )}
                      </Formik>
                    </ModifyAdmin>
                  )}
                </React.Fragment>
              ))}
            </ManageAdmins>
            <Formik
              initialValues={{
                username: "",
                password1: "",
                password2: "",
              }}
              onSubmit={(values, { setSubmitting }) => {
                setSubmitting(false);
              }}
              validationSchema={validationSchema}
            >
              {({ isSubmitting, values }) => (
                <Form>
                  <AddAdmin
                    isActive={this.state.activeSection == "manageAdmins"}
                    isShowing={this.state.isAdminShowing}
                  >
                    <span onClick={this.toggleAdmin}>
                      {this.state.isAdminShowing ? "-" : "+"}&emsp;Add New Administrator
                    </span>
                    <AdminFields
                      isActive={this.state.activeSection == "manageAdmins"}
                      isShowing={this.state.isAdminShowing}
                    >
                      <TextField 
                        placeholder="Username" 
                        name="username"
                      />
                      <TextField
                        inputType="password"
                        placeholder="Password"
                        type="password"
                        name="password1"
                      />
                      <TextField
                        inputType="password"
                        placeholder="Retype Password"
                        type="password"
                        name="password2"
                      />
                      <SubmitAdminButton>Add Admin</SubmitAdminButton>
                    </AdminFields>
                  </AddAdmin>
                </Form>
              )}
            </Formik>
          </DropdownAdmin>
        </React.Fragment>
      </React.Fragment>
    );
  }
}

export default SidebarAdminHome;
