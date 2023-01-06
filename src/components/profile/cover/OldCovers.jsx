import React, { useRef } from "react";
import useOnClickOutside from "../../../hooks/useOnClickOutside";
import Card from "../../UI/Card/Card";
import classes from "./OldCovers.module.css";

function OldCovers({ setShowOldCover, setImage, photosData, showOldCover }) {
  const oldCoversCardRef = useRef(null);

  useOnClickOutside(oldCoversCardRef, showOldCover, () => {
    setShowOldCover(false);
  });

  return (
    <div className={`${classes.wrap} blur`}>
      <Card className={classes.card} innerRef={oldCoversCardRef}>
        <div className={classes.header}>
          Update Cover Photo
          <div className="small_circle" onClick={() => setShowOldCover(false)}>
            <i className="exit_icon"></i>
          </div>
        </div>
        <div className={classes.content}>
          {photosData?.profileCovers.length > 0 && (
            <>
              <div>Choose from old cover picture</div>
              <div className={classes.old_photos}>
                {photosData?.profileCovers.map((photo) => (
                  <img
                    src={photo.url}
                    alt={photo.id}
                    onClick={() => {
                      setImage(photo.url);
                      setShowOldCover(false);
                    }}
                    key={photo.id}
                  />
                ))}
              </div>
            </>
          )}
          {photosData?.resources.length > 0 && (
            <>
              <div>Choose from your profile photos</div>
              <div className={classes.old_photos}>
                {photosData?.resources.map((photo) => (
                  <img
                    src={photo.url}
                    alt={photo.id}
                    onClick={() => {
                      setImage(photo.url);
                      setShowOldCover(false);
                    }}
                    key={photo.id}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}

export default OldCovers;
