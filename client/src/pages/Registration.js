import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../CSS/Registration.css"

function Registration() {
  const initialValues = {
    username: "",
    password: "",
  };

  let navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, "Username must be at least 3 characters")
      .max(15, "Username cannot exceed 15 characters")
      .matches(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores"
      )
      .required("Username is required"),
    password: Yup.string()
      .min(4, "Password must be at least 4 characters")
      .max(20, "Password cannot exceed 20 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{4,20}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      )
      .required("Password is required"),
  });

  const onSubmit = (data, { setSubmitting, setFieldError }) => {
    axios
      .post("http://localhost:3001/auth", data)
      .then(() => {
        console.log(data);
        //alert("Registration successful!");
        navigate("/");
      })
      .catch((error) => {
        setFieldError("username", "This username is already taken.");
        console.error("Registration error:", error);
        //alert("An error occurred during registration. Please try again.");
      })
      .finally(() => {
        setSubmitting(false); // Stop the Formik submission spinner
      });
  };

  return (
    <div>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        {({ isSubmitting }) => (
          <Form className="formContainer">
            <label>Username: </label>
            <ErrorMessage name="username" component="span" />
            <Field
              autocomplete="off"
              id="inputCreatePost"
              name="username"
              placeholder="(Ex. User123...)"
            />

            <label>Password: </label>
            <ErrorMessage name="password" component="span" />
            <Field
              autocomplete="off"
              type="password"
              id="inputCreatePost"
              name="password"
              placeholder="Your Password..."
            />

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Registering..." : "Register"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default Registration;
