import { useRef } from "react";
import useOnClickOutside from "../../../hooks/useOnClickOutside";
import Portal from "../../../utils/Portal";
import Card from "../../UI/Card/Card";
import Detail from "./Detail";
import classes from "./EditDetails.module.css";

function EditDetails({
  showEdit,
  setShowEdit,
  infos,
  handleChange,
  updateDetails,
  details,
}) {
  const editDetailsRef = useRef(null);

  useOnClickOutside(editDetailsRef, showEdit, () => {
    setShowEdit(false);
  });

  return (
    <Portal>
      <div className={`${classes.wrap} blur`}>
        <Card className={classes.card} innerRef={editDetailsRef}>
          <div className={classes.header}>
            Edit Details
            <div className="small_circle" onClick={() => setShowEdit(false)}>
              <i className="exit_icon"></i>
            </div>
          </div>
          <div className={classes.content}>
            <div className={classes.h_col}>
              <span className={classes.t1}>Customize your intro</span>
              <span className={classes.t2}>
                Details you select will be public.
              </span>
              <div className={classes.details_header}>Other Name</div>
              <Detail
                value={details?.otherName}
                img="studies"
                placeholder="Add other name"
                name="otherName"
                text="Other Name"
                handleChange={handleChange}
                updateDetails={updateDetails}
                infos={infos}
                details={details}
                max={20}
              />
              <div className={classes.details_header}>Work</div>
              <Detail
                value={details?.job}
                img="job"
                placeholder="Add a job"
                name="job"
                text="A job"
                handleChange={handleChange}
                updateDetails={updateDetails}
                infos={infos}
                details={details}
                max={20}
              />
              <Detail
                value={details?.workplace}
                img="job"
                placeholder="Add a workplace"
                name="workplace"
                text="A workplace"
                handleChange={handleChange}
                updateDetails={updateDetails}
                infos={infos}
                details={details}
                max={20}
              />
              <div className={classes.details_header}>Education</div>
              <Detail
                value={details?.highSchool}
                img="studies"
                placeholder="Add a high School"
                name="highSchool"
                text="A highSchool"
                handleChange={handleChange}
                updateDetails={updateDetails}
                infos={infos}
                details={details}
                max={20}
              />
              <Detail
                value={details?.college}
                img="studies"
                placeholder="Add a college"
                name="college"
                text="A college"
                handleChange={handleChange}
                updateDetails={updateDetails}
                infos={infos}
                details={details}
                max={20}
              />
              <div className={classes.details_header}>Current City</div>
              <Detail
                value={details?.currentCity}
                img="home"
                placeholder="Add a current city"
                name="currentCity"
                text="A current city"
                handleChange={handleChange}
                updateDetails={updateDetails}
                infos={infos}
                details={details}
                max={20}
              />
              <div className={classes.details_header}>Hometown</div>
              <Detail
                value={details?.homeTown}
                img="from"
                placeholder="Add a hometown"
                name="homeTown"
                text="A hometown"
                handleChange={handleChange}
                updateDetails={updateDetails}
                infos={infos}
                details={details}
                max={20}
              />
              <div className={classes.details_header}>Relationship</div>
              <Detail
                value={details?.relationship}
                img="relationship"
                placeholder="Add a relationship"
                name="relationship"
                text="A relationship"
                handleChange={handleChange}
                updateDetails={updateDetails}
                infos={infos}
                details={details}
                max={20}
                rel={true}
              />
              <div className={classes.details_header}>Instagram</div>
              <Detail
                value={details?.instagram}
                img="instagram"
                placeholder="Add a instagram"
                name="instagram"
                text="A instagram"
                handleChange={handleChange}
                updateDetails={updateDetails}
                infos={infos}
                details={details}
                max={20}
              />
            </div>
          </div>
        </Card>
      </div>
    </Portal>
  );
}

export default EditDetails;
