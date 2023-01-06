import React, { useState } from "react";
import styles from "./input.module.css";
import { useField, ErrorMessage } from "formik";
import { useMediaQuery } from "react-responsive";
import Popper from "../../Popper/Popper";

function LoginInput({ placeholder, type, disabled, className, ...props }) {
  const [field, meta] = useField(props);
  const [trigger, setTrigger] = useState(null);
  const [show, setShow] = useState(false);

  const desktopView = useMediaQuery({
    query: "(min-width: 850px)",
  });

  return (
    <div className={`${styles.wrap} ${className}`} ref={setTrigger}>
      {meta.touched && meta.error && show && (
        <Popper
          trigger={trigger}
          placement={desktopView ? "left" : "top-start"}
          offsetNum={desktopView ? 15 : 8}
        >
          <ErrorMessage name={field.name} />
        </Popper>
      )}
      <input
        className={meta.touched && meta.error ? styles.error : ""}
        type={type}
        name={field.name}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="on"
        {...field}
        onFocusCapture={() => setShow(true)}
        onBlurCapture={(e) => {
          setShow(false);
        }}
      />
      {meta.touched && meta.error && (
        <i className="error_icon" style={{ top: "15px" }}></i>
      )}
    </div>
  );
}

export default LoginInput;
