import React, { Component } from "react";
import styled from "styled-components";
import {
  SidebarSubheader,
  FilledButton,
  AdminTextField,
  CustomErrorMessage,
} from "./GlobalSidebarComponents";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import api from "../services/admin-services";
import { handleLogin } from "../services/auth-funcs";

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const validationSchemaAdmin = Yup.object({
  username: Yup.string().required("No username provided"),
  password: Yup.string().required("No password provided"),
});

const validationSchemaContrib = Yup.object({
  username: Yup.string(),
});

class SidebarAdminLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginError: false,
    };
  }

  componentDidMount() {
    this.props.showLogoutButton("Back to home");
  }

  render() {
    return (
      <React.Fragment>
        <SidebarSubheader>
          Log in as{" "}
          {this.props.contributor ? "Contributor (Optional)" : "Administrator"}
        </SidebarSubheader>
        <Formik
          initialValues={{
            username: "",
            password: "",
          }}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(false);

            if(!this.props.contributor) {
              const loginResult = await handleLogin(
                values.username,
                values.password
              );
              if (loginResult) {
                this.props.setActiveSidebar("adminHome");
              } else {
                this.setState({
                  loginError: true,
                });
              }
            }
            else {
              this.props.setContribName(values.username);
              this.props.setActiveSidebar("contribHome");
            }
          }}
          validationSchema={
            this.props.contributor
              ? validationSchemaContrib
              : validationSchemaAdmin
          }
        >
          {({ isSubmitting, errors, touched }) => (
            <Form>
              <ButtonGroup>
                {this.state.loginError && (
                  <CustomErrorMessage>
                    <span>Error: Your username and/or password were incorrect. </span>
                  </CustomErrorMessage>
                )}
                <AdminTextField
                  placeholder={
                    this.props.contributor ? "Display Name" : "Username"
                  }
                  name="username"
                />
                {!this.props.contributor && (
                  <AdminTextField
                    inputType="password"
                    placeholder="Password"
                    type="password"
                    name="password"
                  />
                )}
                {errors.username && touched.username && (
                  <CustomErrorMessage>
                    <span>Error: {errors.username}</span>
                  </CustomErrorMessage>
                )}
                {errors.password && touched.password && (
                  <CustomErrorMessage>
                    <span>Error: {errors.password}</span>
                  </CustomErrorMessage>
                )}
                <FilledButton
                  style={{ marginTop: "0.4rem" }}
                  type="submit"
                  disabled={isSubmitting}
                >
                  Log in
                </FilledButton>
              </ButtonGroup>
            </Form>
          )}
        </Formik>
      </React.Fragment>
    );
  }
}

export default SidebarAdminLogin;
