import React, { useState, useRef } from "react";
import styles from "./Header.module.css";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  ArrowDown,
  Friends,
  FriendsActive,
  Gaming,
  Home,
  HomeActive,
  Logo,
  Market,
  Menu,
  Messenger,
  Notifications,
  Search,
  Watch,
} from "../../svg";
import SearchMenu from "./SearchMenu";
import AllMenu from "./AllMenu";
import useOnClickOutside from "../../hooks/useOnClickOutside";
import UserMenu from "./userMenu/index";
import NotificationMenu from "./notificationMenu/NotificationMenu";
function Header() {
  const color = "#65676b";
  const input = useRef();
  const [showIcon, setShowIcon] = useState(true);
  const [showSearchMenu, setShowSearchMenu] = useState(false);
  const [showAllMenu, setShowAllMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);
  const allmenu = useRef(null);
  const usermenu = useRef(null);
  const notificationmenu = useRef(null);
  const location = useLocation();

  useOnClickOutside(allmenu, showAllMenu, () => {
    setShowAllMenu(false);
  });

  useOnClickOutside(usermenu, showUserMenu, () => {
    setShowUserMenu(false);
  });

  useOnClickOutside(notificationmenu, showNotificationMenu, () => {
    setShowNotificationMenu(false);
  });

  const user = useSelector((state) => ({ ...state.user.userinfo }));
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <Link to="/" className={styles.logo}>
          <div className={styles.circle}>
            <Logo width={200} />
          </div>
        </Link>
        <div
          className={styles.search}
          onClick={() => {
            input.current.focus();
            setShowSearchMenu(true);
          }}
        >
          {showIcon && <Search color={color} />}
          <input
            ref={input}
            type="text"
            name="search"
            placeholder="Search Backbook"
            className={styles.input}
            onFocus={() => {
              setShowIcon(false);
              setShowSearchMenu(true);
            }}
            onBlur={() => setShowIcon(true)}
          />
        </div>
      </div>
      {showSearchMenu && (
        <SearchMenu
          color={color}
          showSearchMenu={showSearchMenu}
          setShowSearchMenu={setShowSearchMenu}
        />
      )}
      <div className={styles.middle}>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? `${styles.active} ${styles.middle_icon}`
              : styles.middle_icon
          }
        >
          <HomeActive className={styles.active_icon} />
          <Home className={styles.icon} />
        </NavLink>

        <NavLink
          to="/friends"
          className={({ isActive }) =>
            isActive
              ? `${styles.active} ${styles.middle_icon}`
              : styles.middle_icon
          }
        >
          <span
            style={{ transform: "translateY(5px)" }}
            className={styles.active_icon}
          >
            <FriendsActive />
          </span>
          <span
            style={{ transform: "translateY(5px)" }}
            className={styles.icon}
          >
            <Friends />
          </span>
          {user?.recivedRequestsCount > 0 && (
            <div
              style={{ transform: "translateY(3px)" }}
              className={styles.notification}
            >
              {user?.recivedRequestsCount}
            </div>
          )}
        </NavLink>
        <Link to="/" className={`${styles.middle_icon} hover1`}>
          <Watch style={{ transform: "translateY(5px)" }} color={color} />
          <div
            style={{ transform: "translateY(3px)" }}
            className={styles.notification}
          >
            9+
          </div>
        </Link>
        <Link to="/" className={`${styles.middle_icon} hover1`}>
          <Market color={color} />
        </Link>
        <Link to="/" className={`${styles.middle_icon} hover1`}>
          <Gaming color={color} />
        </Link>
      </div>
      <div className={styles.right}>
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            isActive &&
            (location.pathname === "/profile" ||
              location.pathname === `/profile/${user?.username}`)
              ? `${styles.profile_active} ${styles.profile}`
              : `${styles.profile} hover1`
          }
        >
          <img src={user?.photo} alt={user?.username} className="shadow" />
          <span>{user?.first_name}</span>
        </NavLink>
        <div ref={allmenu}>
          <div
            className={`${styles.circle_icon}  ${
              showAllMenu && styles.active_header
            }`}
            onClick={() => {
              setShowAllMenu((prev) => !prev);
            }}
          >
            <div style={{ transform: "translateY(2px)" }}>
              <Menu />
            </div>
          </div>

          {showAllMenu && <AllMenu />}
        </div>
        <NavLink
          to="/messages"
          className={({ isActive }) =>
            isActive
              ? `${styles.active_header} ${styles.circle_icon}`
              : styles.circle_icon
          }
        >
          <Messenger className={styles.icon} />
          {user?.unseenMessages > 0 && (
            <div
              style={{
                transform: "translateY(3px)",
                right: "0px",
                top: "-5px",
              }}
              className={styles.notification}
            >
              {user?.unseenMessages}
            </div>
          )}
        </NavLink>
        <div ref={notificationmenu}>
          <div
            className={`${styles.circle_icon}  ${
              showNotificationMenu && styles.active_header
            }`}
            onClick={() => {
              setShowNotificationMenu((prev) => !prev);
            }}
          >
            <Notifications />
            {user?.unseenNotification > 0 && (
              <div
                style={{
                  transform: "translateY(3px)",
                  right: "0px",
                  top: "-5px",
                }}
                className={styles.notification}
              >
                {user?.unseenNotification}
              </div>
            )}
          </div>

          {showNotificationMenu && (
            <NotificationMenu
              setShowNotificationMenu={setShowNotificationMenu}
              user={user}
            />
          )}
        </div>

        <div ref={usermenu}>
          <div
            className={`${styles.circle_icon}  ${
              showUserMenu && styles.active_header
            }`}
            onClick={() => {
              setShowUserMenu((prev) => !prev);
            }}
          >
            <div style={{ transform: "translateY(2px)" }}>
              <ArrowDown />
            </div>
          </div>

          {showUserMenu && (
            <UserMenu setShowUserMenu={setShowUserMenu} user={user} />
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
