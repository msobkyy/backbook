import { useEffect, useRef, useState } from "react";
import { Return, Search } from "../../svg";
import { Link } from "react-router-dom";
import useOnClickOutside from "../../hooks/useOnClickOutside";
import classes from "./SearchMenu.module.css";
import { useSearch } from "../../hooks/useSearch";
import { useAddToSearch } from "../../hooks/useAddToSearch";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRemoveFromSearch } from "../../hooks/useRemoveFromSearch";

function SearchMenu({ color, showSearchMenu, setShowSearchMenu }) {
  const [iconVisible, setIconVisible] = useState(true);
  const [showHistory, setShowHistory] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState(searchTerm);

  const menu = useRef(null);
  const input = useRef(null);

  const {
    mutate: search,
    data: searchData,
    isLoading: isSearchLoading,
    isSuccess: isSearchSuccess,
  } = useSearch();
  const { mutate: addToSearch, isSuccess: isAddedSuccess } = useAddToSearch();
  const { mutate: RemoveFromSearch, isSuccess: isRemovedSuccess } =
    useRemoveFromSearch();

  const {
    isLoading: isSearchHistoryLoading,
    data: searchHistort,
    isSuccess: isSearchHistorySuccess,
    refetch: refetchSearchHistory,
  } = useQuery({
    queryKey: ["searchHistory"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/users/search`,
        {
          withCredentials: true,
        }
      );
      return data;
    },
    refetchOnWindowFocus: false,
  });

  useOnClickOutside(menu, showSearchMenu, () => {
    setShowSearchMenu(false);
  });

  useEffect(() => {
    input.current.focus();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setSearchTerm(debouncedTerm), 1000);
    return () => clearTimeout(timer);
  }, [debouncedTerm]);

  // submit a new search
  useEffect(() => {
    if (searchTerm.trim().length > 0) {
      search({ term: searchTerm });
      setShowHistory(false);
    } else {
      setShowHistory(true);
    }
  }, [searchTerm]);

  useEffect(() => {
    if (isAddedSuccess || isRemovedSuccess) {
      refetchSearchHistory();
    }
  }, [isAddedSuccess, isRemovedSuccess]);

  return (
    <div className={`${classes.header_left} ${classes.search_area}`} ref={menu}>
      <div className={classes.search_wrap}>
        <div
          className="circle hover1"
          onClick={() => {
            setShowSearchMenu(false);
          }}
        >
          <Return color={color} />
        </div>
        <div
          className={classes.search}
          onClick={() => {
            input.current.focus();
          }}
        >
          {iconVisible && (
            <div>
              <Search color={color} />
            </div>
          )}
          <input
            className={classes.input}
            type="text"
            placeholder="Search Backbook"
            ref={input}
            onChange={(e) => setDebouncedTerm(e.target.value)}
            value={debouncedTerm}
            onFocus={() => {
              setIconVisible(false);
            }}
            onBlur={() => {
              setIconVisible(true);
            }}
          />
        </div>
      </div>
      {showHistory && (
        <div className={classes.search_history_header}>
          <span>Recent searches</span>
          <a>Edit</a>
        </div>
      )}
      <div className="scrollbar" style={{ height: "100%" }}>
        <div className={`${classes.search_results} `}>
          {!isSearchHistoryLoading &&
            isSearchHistorySuccess &&
            showHistory &&
            searchHistort?.data.results.length > 0 &&
            searchHistort?.data.results.map((user) => (
              <div
                className={`${classes.search_user_item} ${classes.search_item} hover2`}
                key={user._id}
              >
                <Link
                  to={`/profile/${user.user.username}`}
                  className={`${classes.search_item}`}
                  onClick={() => {
                    addToSearch({ user: user._id });
                    setDebouncedTerm("");
                  }}
                >
                  <div className={`${classes.search_result}`}>
                    <div>
                      <img
                        className={classes.search_result_img}
                        src={user.user.photo}
                        alt=""
                      />
                    </div>
                    <span>
                      {user.user.first_name} {user.user.last_name}
                    </span>
                  </div>
                </Link>
                <i
                  className="exit_icon"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    RemoveFromSearch({ user: user._id });
                  }}
                ></i>
              </div>
            ))}
        </div>
        <div className={`${classes.search_results} scrollbar`}>
          {!isSearchLoading &&
          isSearchSuccess &&
          !showHistory &&
          searchData?.data.results.length > 0 &&
          searchTerm.trim().length > 0 ? (
            searchData?.data.results.map((user) => (
              <Link
                to={`/profile/${user.username}`}
                className={`${classes.search_item} hover2`}
                onClick={() => {
                  addToSearch({ user: user._id });
                  setDebouncedTerm("");
                }}
                key={user._id}
              >
                <div className={`${classes.search_result}`}>
                  <div>
                    <img
                      className={classes.search_result_img}
                      src={user.photo}
                      alt=""
                    />
                  </div>
                  <span>
                    {user.first_name} {user.last_name}
                  </span>
                </div>
              </Link>
            ))
          ) : searchTerm ? (
            <p style={{ padding: "10px" }}>No Search Results</p>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchMenu;
