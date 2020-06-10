import React, { Component } from "react";
import styled from "styled-components";
import {
  SidebarSubheader,
  FilledButton,
  AdminTextField,
  CustomErrorMessage
} from "./GlobalSidebarComponents";
import { Formik, Form } from "formik";
import * as Yup from "yup";

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
          onSubmit={(values, { setSubmitting }) => {
            setSubmitting(false);
            this.props.setActiveSidebar(
              this.props.contributor ? "contribHome" : "adminHome"
            );
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
