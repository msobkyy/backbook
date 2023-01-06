import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import SettingsPrivacy from "./SettingsPrivacy";
import { useDispatch } from "react-redux";
import styles from "./UserMenu.module.css";
import HelpSupport from "./HelpSupport";
import DisplayAccessibility from "./DisplayAccessibility";
import { logout } from "../../../app/slices/userSlice";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function UserMenu({ user, setShowUserMenu }) {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(0);

  const { data, refetch } = useQuery({
    queryKey: ["logout"],
    queryFn: async () => {
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/users/logout`,
        {},
        {
          withCredentials: true,
        }
      );
      return data;
    },
    enabled: false,
    retry: false,
    cacheTime: 0,
  });

  const logoutHandler = () => {
    refetch();
  };

  useEffect(() => {
    if (data?.status === "success") {
      dispatch(logout());
    }
  }, [data, logoutHandler]);

  return (
    <div className={`${styles.menu} shadow`}>
      {visible === 0 && (
        <div>
          <Link
            to="/profile"
            className={`${styles.mmenu_header} hover3`}
            onClick={() => setShowUserMenu(false)}
          >
            <img src={user?.photo} alt="" />
            <div className={styles.mmenu_col}>
              <span>
                {user?.first_name} {user?.last_name}
              </span>
              <span>See your profile</span>
            </div>
          </Link>
          <div className={styles.mmenu_splitter}></div>
          <div className={`${styles.mmenu_main} hover3`}>
            <div className={styles.small_circle}>
              <i className="report_filled_icon"></i>
            </div>
            <div className={styles.mmenu_col}>
              <div className={styles.mmenu_span1}>Give feedback</div>
              <div className={styles.mmenu_span2}>Help us improve facebook</div>
            </div>
          </div>
          <div className={styles.mmenu_splitter}></div>
          <div
            className={`${styles.mmenu_item} hover3`}
            onClick={() => {
              setVisible(1);
            }}
          >
            <div className={styles.small_circle}>
              <i className="settings_filled_icon"></i>
            </div>
            <span>Settings & privacy</span>
            <div className={styles.rArrow}>
              <i className="right_icon"></i>
            </div>
          </div>
          <div
            className={`${styles.mmenu_item} hover3`}
            onClick={() => {
              setVisible(2);
            }}
          >
            <div className={styles.small_circle}>
              <i className="help_filled_icon"></i>
            </div>
            <span>Help & support</span>
            <div className={styles.rArrow}>
              <i className="right_icon"></i>
            </div>
          </div>
          <div
            className={`${styles.mmenu_item} hover3`}
            onClick={() => {
              setVisible(3);
            }}
          >
            <div className={styles.small_circle}>
              <i className="dark_filled_icon"></i>
            </div>
            <span>Display & Accessibility</span>
            <div className={styles.rArrow}>
              <i className="right_icon"></i>
            </div>
          </div>
          <div
            className={`${styles.mmenu_item} hover3 click`}
            onClick={() => {
              logoutHandler();
            }}
          >
            <div className={styles.small_circle}>
              <i className="logout_filled_icon"></i>
            </div>
            <span>Logout</span>
          </div>
        </div>
      )}
      {visible === 1 && <SettingsPrivacy setVisible={setVisible} />}
      {visible === 2 && <HelpSupport setVisible={setVisible} />}
      {visible === 3 && (
        <DisplayAccessibility user={user} setVisible={setVisible} />
      )}
    </div>
  );
}
