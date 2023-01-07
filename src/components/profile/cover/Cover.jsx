import React, { useState, useRef, useEffect, useCallback } from "react";
import useOnClickOutside from "../../../hooks/useOnClickOutside";
import Card from "../../UI/Card/Card";
import classes from "./Cover.module.css";
import Cropper from "react-easy-crop";
import getCroppedImg from "../../../utils/getCroppedImg";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import FormLoader from "../../FormLoader";
import { useDispatch } from "react-redux";
import { updateCoverPhoto } from "../../../app/slices/userSlice";
import OldCovers from "./OldCovers";

function Cover({ isVisitor, user, photosData }) {
  const dispatch = useDispatch();
  const [showCoverMneu, setShowCoverMenu] = useState(false);
  const [showOldCover, setShowOldCover] = useState(false);
  const CoverMenuRef = useRef();
  const [image, setImage] = useState(null);
  const refInput = useRef(null);
  const coverRef = useRef(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [width, setWidth] = useState();
  const [height, setHeight] = useState();

  useEffect(() => {
    setWidth(coverRef.current.clientWidth);
    setHeight(coverRef.current.clientHeight);
  }, [window.innerWidth]);

  useEffect(() => {
    if (showOldCover) {
      document.documentElement.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "auto";
    }
  }, [showOldCover]);

  const getCroppedImage = useCallback(
    async (show) => {
      try {
        const img = await getCroppedImg(image, croppedAreaPixels);
        if (show) {
          setZoom(1);
          setCrop({ x: 0, y: 0 });
          setImage(img);
        } else {
          return img;
        }
      } catch (error) {
        console.log(error);
      }
    },
    [croppedAreaPixels]
  );

  const handleImage = (e) => {
    let file = e.target.files[0];
    if (
      file.type !== "image/jpeg" &&
      file.type !== "image/png" &&
      file.type !== "image/webp" &&
      file.type !== "image/gif"
    ) {
      //   setError(`${file.name} format is not supported.`);
      return;
    } else if (file.size > 1024 * 1024 * 5) {
      //   setError(`${file.name} is too large max 5mb allowed.`);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      setImage(event.target.result);
    };
  };
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const sendPost = (senFormData) => {
    return axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/users/update/profile/cover`,
      senFormData,
      {
        withCredentials: true,
      }
    );
  };

  const { data, isLoading, isSuccess, mutate } = useMutation({
    mutationFn: sendPost,
  });

  const updateCover = async () => {
    try {
      let img = await getCroppedImage(false);
      let blob = await fetch(img).then((r) => r.blob());
      let form = new FormData();
      form.append("photo", blob);
      mutate(form);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isSuccess && data?.data?.status === "success") {
      coverRef.current.style.backgroundImage = `url(${data.data.data.url})`;
      dispatch(updateCoverPhoto(data.data.data.url));
      setTimeout(() => {
        setImage(null);
      }, 200);
    }
  }, [data, isSuccess]);

  useOnClickOutside(CoverMenuRef, showCoverMneu, () => {
    setShowCoverMenu(false);
  });
  return (
    <div
      className={classes.cover}
      ref={coverRef}
      style={{ backgroundImage: `${!isLoading ? `url(${user.cover})` : ""}` }}
    >
      {image && (
        <>
          <div className={classes.save_cover}>
            <div className={classes.left}>
              <i className="public_icon"></i>
              Your cover is public
            </div>
            <div className={classes.btns}>
              <button
                className="gray_btn opacity_btn"
                onClick={() => setImage(null)}
              >
                Cancel
              </button>
              <button className="btn_blue " onClick={() => updateCover()}>
                Save
              </button>
            </div>
          </div>
          <FormLoader loading={isLoading}>
            <div className={classes.cover_cropper}>
              <Cropper
                classes={{
                  mediaClassName: classes.mediaClassName,
                }}
                image={image}
                crop={crop}
                zoom={zoom}
                aspect={width / height}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                showGrid={true}
                objectFit="horizontal-cover"
              />
            </div>
          </FormLoader>
        </>
      )}
      {!isVisitor && (
        <>
          <div className={classes.edit_cover_wrapper}>
            <input
              type="file"
              ref={refInput}
              hidden
              onChange={handleImage}
              accept="image/jpeg,image/png,image/webp,image/gif"
            />
            <div
              className={classes.edit_cover}
              onClick={() => setShowCoverMenu((prev) => !prev)}
            >
              <i className="camera_filled_icon"></i>
              <span>Add Cover Photo</span>
            </div>
            {showCoverMneu && (
              <Card
                className={classes.cover_upload_menu}
                innerRef={CoverMenuRef}
              >
                <div
                  className={`${classes.open_cover_menu_item} hover1`}
                  onClick={() => setShowOldCover(true)}
                >
                  <i className="photo_icon"></i>
                  Select Photo
                </div>
                <div
                  className={`${classes.open_cover_menu_item} hover1`}
                  onClick={() => refInput.current.click()}
                >
                  <i className="upload_icon"></i>
                  Upload Photo
                </div>
              </Card>
            )}
          </div>
          {showOldCover && (
            <OldCovers
              showOldCover={showOldCover}
              setShowOldCover={setShowOldCover}
              setImage={setImage}
              photosData={photosData}
            />
          )}
        </>
      )}
    </div>
  );
}

export default Cover;
