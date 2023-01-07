import { useState } from "react";
import Card from "../UI/Card/Card";
import styles from "./style.module.css";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import LoginInput from "../input/login";
import FormLoader from "../FormLoader";
import { Link } from "react-router-dom";
import axios from "axios";

function CodeVerification({ setVisible, setUserInfos, userInfos }) {
  const { email, code } = userInfos;
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCodeChange = (e) => {
    const { name, value } = e.target;
    setUserInfos({ ...userInfos, [name]: value });
  };

  const forgotValidation = Yup.object({
    code: Yup.string().required("Security code is required.").max(6).min(6),
  });

  const submitHandler = async (values) => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/users/resetPassword`,
        {
          email,
          code: values.code,
        },
        {
          withCredentials: true,
        }
      );
      setUserInfos({ ...userInfos, token: data.data.token });
      setVisible(3);
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
      <div className={styles.header}>Enter security code</div>
      {error ? (
        <div className={styles.error}>
          <div className={styles.error_header}>Something went wrong!</div>
          <span>{error}</span>
        </div>
      ) : (
        ""
      )}

      <div className={styles.content}>
        <span className={styles.text}>
          Please check your emails for a message with your code. Your code is 8
          numbers long.
        </span>
        <Formik
          enableReinitialize
          initialValues={{ code }}
          validationSchema={forgotValidation}
          onSubmit={(values) => {
            submitHandler(values);
          }}
        >
          {(formik) => (
            <Form noValidate>
              <FormLoader loading={loading} className={styles.code_form}>
                <LoginInput
                  className={styles.input}
                  type="number"
                  name="code"
                  placeholder="Enter Code"
                  onChange={handleCodeChange}
                  disabled={loading}
                />
                <div className={styles.label_col}>
                  <span>We sent your code to:</span>
                  <span>{userInfos.email}</span>
                </div>
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

export default CodeVerification;
