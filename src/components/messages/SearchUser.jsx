import { useEffect, useRef, useState } from "react";
import { Return, Search } from "../../svg";
import { useNavigate } from "react-router-dom";
import useOnClickOutside from "../../hooks/useOnClickOutside";
import classes from "./SearchUser.module.css";
import { useSearch } from "../../hooks/useSearch";
import { useGetChat } from "../../hooks/useGetChat";

function SearchUser({ color, showSearchMenu, setShowSearchMenu }) {
  let navigate = useNavigate();

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

  const {
    mutate: getChat,
    data: chatData,
    isLoading: isGetChatLoading,
    isSuccess: isGetChatSuccess,
  } = useGetChat();

  const getChatHandler = (id) => {
    getChat({ user: id });
  };

  useOnClickOutside(menu, showSearchMenu, () => {
    setShowSearchMenu(false);
  });

  useEffect(() => {
    input.current.focus();
  }, []);

  useEffect(() => {
    if (chatData?.status === "success") {
      navigate(`/messages/${chatData.data.chat._id}`);
    }
  }, [isGetChatSuccess]);

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
            placeholder="Search Messenger"
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
      <div className="scrollbar" style={{ height: "90%" }}>
        <div className={`${classes.search_results} scrollbar`}>
          {!isSearchLoading &&
          isSearchSuccess &&
          !showHistory &&
          searchData?.data.results.length > 0 &&
          searchTerm.trim().length > 0 ? (
            searchData?.data.results.map((user) => (
              <div
                to={`/messages/${user._id}`}
                className={`${classes.search_item} hover2`}
                onClick={() => {
                  getChatHandler(user._id);
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
              </div>
            ))
          ) : searchTerm ? (
            <p style={{ padding: "10px" }}>No Search Results</p>
          ) : (
            <p style={{ padding: "10px" }}>Type something to search</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchUser;
