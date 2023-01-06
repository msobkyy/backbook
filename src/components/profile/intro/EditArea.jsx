import { useRef, useEffect } from "react";
import isRTL from "../../../utils/isRTL";
import classes from "./intro.module.css";

function EditArea({
  innerRef,
  infos,
  handleChange,
  setShow,
  max,
  remain,
  updateDetails,
  details,
  name,
  placeholder,
  rel,
}) {
  const isChanged = rel ? false : details?.[name] === infos?.[name];
  const editAreaRef = useRef(null);

  useEffect(() => {
    editAreaRef.current.focus();
  }, []);

  return (
    <div className={classes.bio_wrap} ref={innerRef}>
      {rel ? (
        <select
          ref={editAreaRef}
          className={classes.select_rel}
          name={name}
          value={infos.relationship}
          onChange={handleChange}
        >
          <option value="" disabled defaultValue>
            Select status
          </option>

          <option value="Single">Single</option>
          <option value="In a realationship">In a relationship</option>
          <option value="Married">Married</option>
          <option value="Divorced">Divorced</option>
          <option value="">Remove relationship</option>
        </select>
      ) : (
        <textarea
          ref={editAreaRef}
          style={{
            fontSize: `${
              infos?.[name] && infos?.[name].length > 75 ? "15px" : ""
            }`,
            direction: `${isRTL(infos?.[name]) ? "rtl" : "ltr"}`,
          }}
          placeholder={placeholder}
          value={infos?.[name]}
          onChange={handleChange}
          className={classes.textarea_blue}
          maxLength={max}
          name={name}
        ></textarea>
      )}
      {name === "bio" && (
        <div className={classes.remaining}>{remain} characters remaining</div>
      )}
      <div className={classes.save_btns}>
        <button className="gray_btn" onClick={() => setShow(false)}>
          Cancel
        </button>
        <button
          disabled={isChanged}
          className={isChanged ? `gray_btn` : `btn_blue`}
          onClick={() => {
            updateDetails();
            setShow(false);
          }}
          style={{
            color: `${isChanged ? `#bcc0c4` : `#fff`}`,
            cursor: `${isChanged ? `not-allowed` : `pointer`}`,
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default EditArea;
