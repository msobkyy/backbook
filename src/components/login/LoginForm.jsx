import React from "react";
import * as Yup from "yup";
import { useState } from "react";
import styles from "./LoginForm.module.css";
import { Formik, Form } from "formik";
import { Link } from "react-router-dom";
import LoginInput from "../input/login";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login } from "../../app/slices/userSlice";
import Card from "../UI/Card/Card";
import FormLoader from "../FormLoader";

const initialloginInfos = {
  email: "",
  password: "",
};

function LoginForm({ setRenderSignUp }) {
  const dispatch = useDispatch();

  const { email, password } = initialloginInfos;
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const loginValidation = Yup.object({
    email: Yup.string()
      .required("Email address is required.")
      .email("Must be a valid email.")
      .max(100),
    password: Yup.string().required("Password is required").min(6),
  });

  const submitHandler = async (values) => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/users/login`,
        {
          email: values.email,
          password: values.password,
        },
        {
          withCredentials: true,
        }
      );
      setError("");
      setSuccess(data.status);
      dispatch(login(data));
      setLoading(false);
    } catch (error) {
      setSuccess("");
      setError(error.response?.data?.message);
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };
  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <img src="../../icons/backbook.svg" alt="" />
        <span>
          Backbook helps you connect and share with the people in your life.
        </span>
      </div>
      <div className={styles.login}>
        <Card className={styles.login_wrapper}>
          <Formik
            enableReinitialize
            validationSchema={loginValidation}
            initialValues={{
              email,
              password,
            }}
            onSubmit={(values) => submitHandler(values)}
          >
            {(formik) => (
              <Form className={styles.form} noValidate>
                <FormLoader loading={loading}>
                  <LoginInput
                    type="email"
                    name="email"
                    placeholder="Email address"
                    disabled={loading}
                  />
                  <LoginInput
                    type="password"
                    name="password"
                    placeholder="Password"
                    disabled={loading}
                  />
                </FormLoader>

                {error && <div className={styles.error_text}>{error}</div>}
                {success && (
                  <div className={styles.success_text}>{success}</div>
                )}
                <button type="submit" className="btn_blue" disabled={loading}>
                  Log in
                </button>
                <button
                  style={{ width: "100%", marginTop: "10px" }}
                  className="gray_btn"
                  type="button"
                  disabled={loading}
                  onClick={() => {
                    submitHandler({
                      email: "guest@backbook.io",
                      password: "V0j^Lok?DYdv63rzSQxL6IK?mG2vX]v",
                    });
                  }}
                >
                  Login With Guest Account
                </button>
              </Form>
            )}
          </Formik>
          <Link to="/forgot" className={styles.forgot}>
            Forgotten password?
          </Link>
          <div className="line-spliter"></div>
          <button
            className={`btn_blue ${styles.signup_btn}`}
            onClick={() => setRenderSignUp(true)}
          >
            Create New Account
          </button>
        </Card>
        <div className={styles.extra}>
          <span>
            <b>Create a Page</b> for a celebrity, brand or business.
          </span>
        </div>
      </div>
    </main>
  );
}

export default LoginForm;
