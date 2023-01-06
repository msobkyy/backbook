import React, { useState } from "react";
import styles from "./SignupForm.module.css";
import { useMediaQuery } from "react-responsive";
import Popper from "../Popper/Popper";
import { Field } from "formik";

export default function DateSelector({
  birth_Day,
  birth_Month,
  birth_Year,
  handleSignupChange,
  disabled,
  dateError,
}) {
  const [trigger, setTrigger] = useState(null);
  const [show, setShow] = useState(false);

  const desktopView = useMediaQuery({
    query: "(min-width: 850px)",
  });

  const yearTemp = new Date().getFullYear();
  const years = Array.from(new Array(108), (val, index) => yearTemp - index);
  const months = Array.from(new Array(12), (val, index) => 1 + index);
  const getDays = () => {
    return new Date(birth_Year, birth_Month, 0).getDate();
  };

  const days = Array.from(new Array(getDays()), (val, index) => 1 + index);

  return (
    <div
      className={styles.col}
      ref={setTrigger}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <div className={styles.colHeader}>
        Date of birth{" "}
        {dateError ? (
          <i className={`error_icon ${styles.err_icon}`}></i>
        ) : (
          <i className="info_icon"></i>
        )}
      </div>
      <div className={styles.grid}>
        <Field
          name="birth_Day"
          // value={birth_Day}
          // onChange={handleSignupChange}
          disabled={disabled}
          as="select"
        >
          {days.map((day, i) => (
            <option value={day} key={i}>
              {day}
            </option>
          ))}
        </Field>
        <Field
          name="birth_Month"
          // value={birth_Month}
          // onChange={handleSignupChange}
          as="select"
        >
          {months.map((month, i) => (
            <option value={month} key={i}>
              {month}
            </option>
          ))}
        </Field>
        <Field
          name="birth_Year"
          // value={birth_Year}
          // onChange={handleSignupChange}
          as="select"
        >
          {years.map((year, i) => (
            <option value={year} key={i}>
              {year}
            </option>
          ))}
        </Field>
        {dateError && show && (
          <Popper
            trigger={trigger}
            placement={desktopView ? "left" : "top-start"}
            offsetNum={desktopView ? 15 : 8}
          >
            {dateError}
          </Popper>
        )}
      </div>
    </div>
  );
}
