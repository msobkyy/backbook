import React, { useState, useRef } from "react";
import styles from "./SignupForm.module.css";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import SignupInput from "../input/signup/index";
import DateSelector from "./DateSelector";
import GenderSelector from "./GenderSelector";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login } from "../../app/slices/userSlice";
import { useNavigate } from "react-router-dom";
import Card from "../UI/Card/Card";
import FormLoader from "../FormLoader";
import useOnClickOutside from "../../hooks/useOnClickOutside";

function SignupForm({ setRenderSignUp, renderSignUp }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const signUpRef = useRef();
  const userInfos = {
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    passwordConfirm: "",
    birth_Year: new Date().getFullYear(),
    birth_Month: new Date().getMonth() + 1,
    birth_Day: new Date().getDay(),
    gender: "",
  };
  const [genderError, setGenderError] = useState(true);
  const [dateError, setDateError] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    first_name,
    last_name,
    email,
    password,
    passwordConfirm,
    birth_Year,
    birth_Month,
    birth_Day,
    gender,
  } = userInfos;

  const signupValidation = Yup.object({
    first_name: Yup.string()
      .required("What's your first name?")
      .max(100)
      .min(2)
      .matches(
        /^([a-zA-Z]+\s)*[a-zA-Z]+$/,
        "You can use english charcters only"
      ),
    last_name: Yup.string()
      .required("What's your last name?")
      .max(100)
      .min(2)
      .matches(
        /^([a-zA-Z]+\s)*[a-zA-Z]+$/,
        "You can use english charcters only"
      ),
    email: Yup.string()
      .required(
        "You'll need this when you log in and if you ever need to reset your password."
      )
      .email("Must be a valid email.")
      .max(100),
    password: Yup.string()
      .required("Password is required")
      .min(6)
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#_$%^&*])(?=.{6,})/,
        "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character"
      ),
    passwordConfirm: Yup.string().test(
      "passwords-match",
      "Password confirm must match password !",
      function (value) {
        return this.parent.password === value;
      }
    ),
    gender: Yup.string().required("Gender is required"),
  });

  const submitHandler = async (values) => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/users/signup`,
        {
          first_name: values.first_name,
          last_name: values.last_name,
          email: values.email,
          password: values.password,
          passwordConfirm: values.passwordConfirm,
          birth_Year: values.birth_Year,
          birth_Month: values.birth_Month,
          birth_Day: values.birth_Day,
          gender: values.gender,
        },
        {
          withCredentials: true,
        }
      );
      setError("");
      setSuccess(data.status);
      dispatch(login(data));
      setTimeout(() => {
        setLoading(false);
        navigate("/");
      }, 2000);
    } catch (error) {
      setLoading(false);
      setSuccess("");
      setError(error.response.data.message);
    }
  };

  useOnClickOutside(signUpRef, renderSignUp, () => {
    setRenderSignUp(false);
  });

  return (
    <div className="blur">
      <Card className={styles.signup} innerRef={signUpRef}>
        <div className={styles.signup_header}>
          <i onClick={() => setRenderSignUp(false)} className="exit_icon"></i>
          <span>Sign Up</span>
          <span>it's quick and easy</span>
        </div>
        <Formik
          enableReinitialize
          validationSchema={signupValidation}
          initialValues={{
            first_name,
            last_name,
            email,
            password,
            passwordConfirm,
            birth_Year,
            birth_Month,
            birth_Day,
            gender,
          }}
          onSubmit={(values) => {
            let current_date = new Date();

            const picked_date = new Date(
              values.birth_Year,
              values.birth_Month - 1,
              values.birth_Day
            );

            let atleast14 = new Date(1970 + 14, 0, 1);
            let noMoreThan70 = new Date(1970 + 70, 0, 1);
            if (current_date - picked_date < atleast14) {
              setDateError(
                "it looks like you(ve enetered the wrong info.Please make sure that you use your real date of birth."
              );
            } else if (current_date - picked_date > noMoreThan70) {
              setDateError(
                "it looks like you've enetered the wrong info.Please make sure that you use your real date of birth."
              );
            } else {
              setDateError(false);
              setGenderError(false);
              submitHandler(values);
            }
          }}
        >
          {(formik) => {
            return (
              <Form className={styles.form} noValidate>
                <FormLoader loading={loading}>
                  <div className={styles.line}>
                    <SignupInput
                      type="text"
                      placeholder="First name"
                      name="first_name"
                      disabled={loading}
                    />

                    <SignupInput
                      dir="right"
                      type="text"
                      placeholder="Last name"
                      name="last_name"
                      disabled={loading}
                    />
                  </div>
                  <div className={styles.line}>
                    <SignupInput
                      type="email"
                      placeholder="Email address"
                      name="email"
                      disabled={loading}
                    />
                  </div>
                  <div className={styles.line}>
                    <SignupInput
                      type="password"
                      placeholder="Password"
                      name="password"
                      disabled={loading}
                    />
                  </div>
                  <div className={styles.line}>
                    <SignupInput
                      type="password"
                      placeholder="Password confirm"
                      name="passwordConfirm"
                      disabled={loading}
                    />
                  </div>
                  <DateSelector
                    birth_Day={birth_Day}
                    birth_Month={birth_Month}
                    birth_Year={birth_Year}
                    disabled={loading}
                    dateError={dateError}
                  />

                  <GenderSelector
                    disabled={loading}
                    genderError={genderError}
                  />
                </FormLoader>
                <div className={styles.info}>
                  By clicking Sign Up, you agree to our{" "}
                  <span>Terms, Data Policy &nbsp;</span>and{" "}
                  <span>Cookie Policy.</span> You may receive SMS notifications
                  from us and can opt out at any time.
                </div>

                <div className={styles.btn_wrap}>
                  <button type="submit" disabled={loading} className="btn_blue">
                    Sign up
                  </button>
                </div>
                {error && <div className={styles.error_text}>{error}</div>}
                {success && (
                  <div className={styles.success_text}>{success}</div>
                )}
              </Form>
            );
          }}
        </Formik>
      </Card>
    </div>
  );
}

export default SignupForm;
