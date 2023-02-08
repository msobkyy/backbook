import { useState } from "react";
import Card from "../UI/Card/Card";
import styles from "./style.module.css";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import LoginInput from "../input/login";
import FormLoader from "../FormLoader";
import { Link } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login } from "../../app/slices/userSlice";

function ChangePassword({ setUserInfos, userInfos }) {
  const { email, token, password, passwordConfirm } = userInfos;
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setUserInfos({ ...userInfos, [name]: value });
  };

  const changePasswordValid = Yup.object({
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
  });

  const submitHandler = async (values) => {
    try {
      setLoading(true);
      const { data } = await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/users/resetPassword`,
        {
          email,
          token,
          password: values.password,
          passwordConfirm: values.passwordConfirm,
        },
        {
          withCredentials: true,
        }
      );
      dispatch(login(data));
      setError("");
      setLoading(false);
    } catch (error) {
      setError(error.response?.data?.message);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  return (
    <Card className={styles.wrap}>
      <div className={styles.header}>Change Your Password</div>
      {error ? (
        <div className={styles.error}>
          <div className={styles.error_header}>Something went wrong</div>
          <span>{error}</span>
        </div>
      ) : (
        ""
      )}

      <div className={styles.content}>
        <span className={styles.text}>
          Please crate a new password for your account
        </span>
        <Formik
          enableReinitialize
          initialValues={{ password, passwordConfirm }}
          validationSchema={changePasswordValid}
          onSubmit={(values) => {
            submitHandler(values);
          }}
        >
          {(formik) => (
            <Form noValidate>
              <FormLoader loading={loading} className={styles.form}>
                <LoginInput
                  className={styles.input}
                  type="text"
                  name="password"
                  placeholder="New Password"
                  onChange={handlePasswordChange}
                  disabled={loading}
                />
                <LoginInput
                  className={styles.input}
                  type="text"
                  name="passwordConfirm"
                  placeholder="Confirm new password"
                  onChange={handlePasswordChange}
                  disabled={loading}
                />
              </FormLoader>

              <div className={styles.btns}>
                <Link className="gray_btn" to="/login">
                  Cancel
                </Link>
                <button type="submit" className="btn_blue">
                  Continue
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Card>
  );
}

export default ChangePassword;
