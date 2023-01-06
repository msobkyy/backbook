import { useState, useRef } from "react";
import useOnClickOutside from "../../../hooks/useOnClickOutside";
import EditArea from "./EditArea";
import classes from "./EditDetails.module.css";

function Detail({
  img,
  value,
  placeholder,
  name,
  handleChange,
  updateDetails,
  infos,
  text,
  max,
  details,
  rel,
}) {
  const [show, setShow] = useState(false);

  const editAreaRef = useRef(null);

  useOnClickOutside(editAreaRef, show, () => {
    setShow(false);
  });
  return (
    <div>
      <div
        className={classes.add_details_flex}
        onClick={() => setShow(true)}
        ref={editAreaRef}
      >
        {value ? (
          <div className={classes.info_profile}>
            <img src={`../../../icons/${img}.png`} alt="" />
            {value}
            <i className="edit_icon" style={{ marginLeft: "auto" }}></i>
          </div>
        ) : (
          <>
            <i className="rounded_plus_icon"></i>
            <span className={classes.underline}>Add {text}</span>
          </>
        )}
      </div>
      {show && (
        <EditArea
          innerRef={editAreaRef}
          placeholder={placeholder}
          name={name}
          handleChange={handleChange}
          updateDetails={updateDetails}
          infos={infos}
          details={details}
          setShow={setShow}
          max={max}
          rel={rel}
        />
      )}
    </div>
  );
}

export default Detail;
