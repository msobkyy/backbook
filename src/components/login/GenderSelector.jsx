import React, { useState } from "react";
import styles from "./SignupForm.module.css";
import { Field, ErrorMessage, useField } from "formik";

import { useMediaQuery } from "react-responsive";
import Popper from "../Popper/Popper";

export default function GenderSelector({ handleSignupChange, x, disabled }) {
  const [trigger, setTrigger] = useState(null);
  const [show, setShow] = useState(false);
  const [field, meta] = useField({ name: "gender" });
  const genderError = meta.error;

  const desktopView = useMediaQuery({
    query: "(min-width: 850px)",
  });

  return (
    <div
      className={styles.col}
      ref={setTrigger}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <div className={styles.colHeader}>
        Gender{" "}
        {genderError ? (
          <i className={`error_icon ${styles.err_icon}`}></i>
        ) : (
          <i className="info_icon"></i>
        )}
      </div>
      <div className={`${styles.grid} ${styles.gender}`}>
        <label htmlFor="male">
          Male
          <Field
            type="radio"
            name="gender"
            id="male"
            value="male"
            // onChange={handleSignupChange}
          />
        </label>
        <label htmlFor="female">
          Female
          <Field
            type="radio"
            name="gender"
            id="female"
            value="female"
            // onChange={handleSignupChange}
          />
        </label>
        {genderError && show && (
          <Popper
            trigger={trigger}
            placement={desktopView ? "left" : "top-start"}
            offsetNum={desktopView ? 15 : 8}
          >
            <ErrorMessage name="gender" />
          </Popper>
        )}
      </div>
    </div>
  );
}
