import React, { useState, useEffect } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import PulseLoader from "react-spinners/PulseLoader";

import styles from "./style.module.css";
function FormLoader({ children, loading, className, isError, type }) {
  const [shoswError, setShowError] = useState(isError);
  const error = shoswError;

  useEffect(() => {
    setShowError(isError);
  }, [isError]);

  return (
    <div
      className={`${loading ? styles.wrap : ""} ${error ? styles.wrap : ""}`}
    >
      {loading ? <div className={styles.loaderback} /> : ""}
      {error ? (
        <div className={styles.isError}>
          <div>{isError?.response?.data.message}</div>
          <button className="btn_blue" onClick={() => setShowError(false)}>
            Try again
          </button>
        </div>
      ) : (
        ""
      )}
      {loading ? (
        <div className={styles.loader}>
          {type === 2 ? (
            <PulseLoader color="#878787" loading={loading} size={10} />
          ) : (
            <BeatLoader color="#1876f2" loading={loading} size={20} />
          )}
        </div>
      ) : (
        ""
      )}
      <div className={`${loading ? styles.content : ""} ${className}`}>
        {children}
      </div>
    </div>
  );
}

export default FormLoader;
