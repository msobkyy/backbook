import React from "react";
import { Link } from "react-router-dom";
import Card from "../../components/UI/Card/Card";
import classes from "./style.module.css";
import PuffLoader from "react-spinners/PuffLoader";
import Skeleton from "react-loading-skeleton";

function Photos({ photosData, photosSkelton }) {
  return (
    <Card className={classes.photos}>
      <div className={classes.card_header}>
        Photos
        <Link className={classes.link} to="#">
          See all photos
        </Link>
      </div>
      <div className={classes.content}>
        <div className={classes.info}>
          {photosSkelton ? (
            <Skeleton width={80} height={10} />
          ) : (
            `${photosData.total_count} photos`
          )}
        </div>

        {photosSkelton ? (
          <div className={classes.loading}>
            <PuffLoader color="#1876f2" loading={photosSkelton} size={40} />
          </div>
        ) : (
          <div className={classes.photo_grid}>
            {photosData.resources &&
              photosData.resources
                .slice(0, 9)
                .map((img) => (
                  <div
                    className={classes.photo_card}
                    key={img.id}
                    style={{ backgroundImage: `url(${img.url})` }}
                  ></div>
                ))}
          </div>
        )}
      </div>
    </Card>
  );
}

export default Photos;
