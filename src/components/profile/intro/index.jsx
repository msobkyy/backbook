import React, { useState, useEffect } from "react";
import isRTL from "../../../utils/isRTL";
import Card from "../../UI/Card/Card";
import EditArea from "./EditArea";
import classes from "./intro.module.css";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import EditDetails from "./EditDetails";
import { queryClient } from "./../../../App";
import Skeleton from "react-loading-skeleton";

function Intro({ userData, isVisitor, showEdit, setShowEdit, profileSkelton }) {
  const dData = userData?.details;
  const [details, setDetails] = useState(dData);
  const [infos, setInfos] = useState(dData);
  const [showBio, setShowBio] = useState(false);
  const [max, setMax] = useState(infos?.bio ? 100 - infos?.bio.length : 100);

  const handleBioChange = (e) => {
    const { name, value } = e.target;
    setInfos({ ...infos, [name]: value.replace(/(^[ \t]*\n)/gm, "") });
    setMax(100 - e.target.value.length);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInfos({ ...infos, [name]: value });
  };

  const sendPost = () => {
    return axios.put(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/users/update/profile/details`,
      { infos },
      {
        withCredentials: true,
      }
    );
  };

  const { data, isSuccess, mutate } = useMutation({
    mutationKey: "updateDetails",
    mutationFn: sendPost,
    onSuccess: (data) => {
      queryClient.setQueryData(["getProfile", userData.username], (oldData) => {
        let newData = oldData;

        newData.data.user.details = data.data.data.details;
        return oldData
          ? {
              ...oldData,
              newData,
            }
          : oldData;
      });
    },
  });

  const updateDetails = () => {
    mutate();
  };

  useEffect(() => {
    setDetails(dData);
    setInfos(dData);
    setMax(dData?.bio ? 100 - dData?.bio.length : 100);
  }, [dData]);

  useEffect(() => {
    if (isSuccess && data?.data?.status === "success") {
      setDetails(data.data.data.details);
      setInfos(data.data.data.details);
      setTimeout(() => {
        setShowBio(false);
      }, 500);
    }
  }, [data, isSuccess]);

  useEffect(() => {
    if (showEdit) {
      document.documentElement.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "auto";
    }
  }, [showEdit]);

  return (
    <Card>
      <div className={classes.card_header}>Intro</div>
      {profileSkelton ? (
        <Skeleton count={3} height={20} width="100%" />
      ) : (
        <div className={classes.content}>
          {details?.bio && !showBio && (
            <>
              <div
                className={classes.bio}
                style={{
                  direction: `${isRTL(details?.bio) ? "rtl" : "ltr"}`,
                }}
              >
                {details?.bio}
              </div>

              {isVisitor && <div className="line-spliter" />}
            </>
          )}
          {showBio && (
            <EditArea
              remain={max}
              infos={infos}
              details={details}
              handleChange={handleBioChange}
              setShow={setShowBio}
              updateDetails={updateDetails}
              name="bio"
              placeholder="Describe who you are"
              max={100}
            />
          )}
          {!isVisitor && !showBio && (
            <button
              className={`gray_btn ${classes.edit_btn}`}
              onClick={() => setShowBio((perv) => !perv)}
            >
              {details?.bio ? `Edit` : `Add`} Bio
            </button>
          )}
          {(details?.job || details?.workplace) && (
            <div className={classes.info_profile}>
              <img src="../../../icons/job.png" alt="" />
              <span>
                works{details?.job && <span> as {details?.job}</span>}
                {details?.workplace && (
                  <span>
                    {" "}
                    at <b>{details?.workplace}</b>
                  </span>
                )}
              </span>
            </div>
          )}
          {details?.relationship && (
            <div className={classes.info_profile}>
              <img src="../../../icons/relationship.png" alt="" />
              {details?.relationship}
            </div>
          )}
          {details?.college && (
            <div className={classes.info_profile}>
              <img src="../../../icons/studies.png" alt="" />
              studied at {details?.college}
            </div>
          )}
          {details?.highSchool && (
            <div className={classes.info_profile}>
              <img src="../../../icons/studies.png" alt="" />
              studied at {details?.highSchool}
            </div>
          )}
          {details?.currentCity && (
            <div className={classes.info_profile}>
              <img src="../../../icons/home.png" alt="" />
              Lives in {details?.currentCity}
            </div>
          )}
          {details?.homeTown && (
            <div className={classes.info_profile}>
              <img src="../../../icons/from.png" alt="" />
              From {details?.homeTown}
            </div>
          )}
          {details?.instagram && (
            <div className={classes.info_profile}>
              <img src="../../../icons/instagram.png" alt="" />
              <a
                href={`https://www.instagram.com/${details?.instagram}`}
                target="_blank"
                rel="noreferrer"
              >
                {details?.instagram}
              </a>
            </div>
          )}
          {userData?.createdAt && (
            <div className={classes.info_profile}>
              <img width={20} src="../../../icons/join.png" alt="joindAT" />
              Joined{" "}
              {new Date(userData?.createdAt).toLocaleString("default", {
                month: "long",
                year: "numeric",
                day: "numeric",
              })}
            </div>
          )}
          {!isVisitor && (
            <button
              className={`gray_btn ${classes.edit_btn}`}
              onClick={() => setShowEdit((perv) => !perv)}
            >
              Edit Details
            </button>
          )}
          {showEdit && (
            <EditDetails
              showEdit={showEdit}
              setShowEdit={setShowEdit}
              infos={infos}
              handleChange={handleChange}
              updateDetails={updateDetails}
              details={details}
            />
          )}
        </div>
      )}
    </Card>
  );
}

export default Intro;
