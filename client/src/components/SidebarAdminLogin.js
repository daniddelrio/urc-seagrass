import React from "react";
import styled from "styled-components";
import {
  SidebarSubheader,
  FilledButton,
  AdminTextField,
} from "./GlobalSidebarComponents";
import { Formik, Form, ErrorMessage } from "formik";

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

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
    >
      {({ isSubmitting }) => (
        <Form>
          <ButtonGroup>
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
