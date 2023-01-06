import React, { useRef, useState, useCallback, useEffect } from "react";
import isRTL from "../../../utils/isRTL";
import Portal from "../../../utils/Portal";
import Card from "../../UI/Card/Card";
import classes from "./ProfilePhoto.module.css";
import Cropper from "react-easy-crop";
import getCroppedImg from "../../../utils/getCroppedImg";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import useOnClickOutside from "../../../hooks/useOnClickOutside";
import FormLoader from "../../FormLoader";
import { useDispatch } from "react-redux";

import { updateProfilePhoto } from "../../../app/slices/userSlice";

function ProfilePhoto({
  showProfilePhoto,
  setShowProfilePhoto,
  pRef,
  photosData,
}) {
  const dispatch = useDispatch();

  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const slider = useRef(null);
  const refInput = useRef(null);
  const ProfilePhotoCardref = useRef(null);

  useOnClickOutside(ProfilePhotoCardref, showProfilePhoto, () => {
    setShowProfilePhoto(false);
  });

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
  const zoomIn = () => {
    slider.current.stepUp();
    setZoom(slider.current.value);
  };

  const zoomOut = () => {
    slider.current.stepDown();
    setZoom(slider.current.value);
  };

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

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const sendPost = (senFormData) => {
    return axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/users/update/profile/photo`,
      senFormData,
      {
        withCredentials: true,
      }
    );
  };

  const { data, isLoading, isSuccess, error, mutate } = useMutation({
    mutationFn: sendPost,
  });

  const updateProfielPicture = async () => {
    try {
      let img = await getCroppedImage(false);
      let blob = await fetch(img).then((r) => r.blob());
      let form = new FormData();
      form.append("photo", blob);
      form.append("text", description);
      mutate(form);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isSuccess && data?.data?.status === "success") {
      pRef.current.src = data.data.data.url;
      dispatch(updateProfilePhoto(data.data.data.url));
      setTimeout(() => {
        setShowProfilePhoto(false);
      }, 200);
    }
  }, [data, isSuccess]);

  return (
    <Portal>
      <div className={`${classes.wrap} blur`}>
        <Card className={classes.card} innerRef={ProfilePhotoCardref}>
          <input
            type="file"
            ref={refInput}
            hidden
            onChange={handleImage}
            accept="image/jpeg,image/png,image/webp,image/gif"
          />
          <div className={classes.header}>
            Update profile picture
            <div
              className="small_circle"
              onClick={() => setShowProfilePhoto(false)}
            >
              <i className="exit_icon"></i>
            </div>
          </div>
          <div className={classes.content}>
            {!image ? (
              <>
                <button
                  className="light_blue_btn"
                  onClick={() => refInput.current.click()}
                >
                  <i className="plus_icon filter_blue"></i>
                  Upload photo
                </button>
                {photosData?.profilePhotos.length > 0 && (
                  <>
                    <div>Choose from old profile picture</div>
                    <div className={classes.old_photos}>
                      {photosData?.profilePhotos.map((photo) => (
                        <img
                          src={photo.url}
                          alt={photo.id}
                          onClick={() => setImage(photo.url)}
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
                          onClick={() => setImage(photo.url)}
                          key={photo.id}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <FormLoader loading={isLoading}>
                <textarea
                  style={{
                    fontSize: `${
                      description && description.length > 75 ? "15px" : ""
                    }`,
                    direction: `${isRTL(description) ? "rtl" : "ltr"}`,
                  }}
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={classes.textarea_blue}
                ></textarea>
                <div className={classes.crooper}>
                  <Cropper
                    image={image}
                    crop={crop}
                    zoom={zoom}
                    cropShape="round"
                    aspect={1 / 1}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                  />
                </div>
                <div className={classes.slider}>
                  <div
                    className="small_circle hover1"
                    onClick={() => zoomOut()}
                  >
                    <i className="minus_icon"></i>
                  </div>
                  <input
                    ref={slider}
                    type="range"
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    aria-labelledby="Zoom"
                    onChange={(e) => {
                      setZoom(e.target.value);
                    }}
                    className="zoom-range"
                  />
                  <div className="small_circle hover1" onClick={() => zoomIn()}>
                    <i className="plus_icon"></i>
                  </div>
                </div>
                <div className={classes.btns}>
                  <button
                    className="gray_btn"
                    onClick={() => setShowProfilePhoto(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn_blue"
                    onClick={() => updateProfielPicture()}
                  >
                    Save
                  </button>
                </div>
              </FormLoader>
            )}
          </div>
        </Card>
      </div>
    </Portal>
  );
}

export default ProfilePhoto;
