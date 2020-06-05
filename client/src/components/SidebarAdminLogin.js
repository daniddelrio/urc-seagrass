import React from "react";
import styled from "styled-components";
import {
  SidebarSubheader,
  FilledButton,
  AdminTextField,
} from "./GlobalSidebarComponents";
import { Formik, Form, ErrorMessage } from "formik";
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

const SidebarAdminLogin = (props) => (
  <React.Fragment>
    <SidebarSubheader>
      Log in as {props.contributor ? "Contributor (Optional)" : "Administrator"}
    </SidebarSubheader>
    <Formik
      initialValues={{
        username: "",
        password: "",
      }}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(false);
        props.setActiveSidebar(
          props.contributor ? "contribHome" : "adminHome"
        );
      }}
      validationSchema={props.contributor ? validationSchemaContrib : validationSchemaAdmin}
    >
      {({ isSubmitting }) => (
        <Form>
          <ButtonGroup>
            <ErrorMessage name="username" />
            <AdminTextField
              placeholder={props.contributor ? "Display Name" : "Username"}
              name="username"
            />
            {!props.contributor && (
              <AdminTextField
                inputType="password"
                placeholder="Password"
                type="password"
                name="password"
              />
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

export default SidebarAdminLogin;
