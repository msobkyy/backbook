import React from "react";
import styles from "./Card.module.css";

function Card({ children, className, innerRef, style }) {
  return (
    <div ref={innerRef} style={style} className={`${styles.card} ${className}`}>
      {children}
    </div>
  );
}

export default Card;
