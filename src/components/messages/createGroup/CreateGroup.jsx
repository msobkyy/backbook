import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import { useRef } from "react";
import useOnClickOutside from "../../../hooks/useOnClickOutside";
import FormLoader from "../../FormLoader";
import LoginInput from "../../input/login";
import Card from "../../UI/Card/Card";
import styles from "./CreateGroup.module.css";
import classes from "./../SearchUser.module.css";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useState } from "react";
import { useSearch } from "../../../hooks/useSearch";
import { toast } from "react-hot-toast";
import { useCreateChatGroup } from "../../../hooks/useCreateChatGroup";
import { useAddMember } from "../../../hooks/useAddMember";
import { useRenameGroup } from "../../../hooks/useRenameGroup";
import Portal from "../../../utils/Portal";

const isDuplicate = (data, obj) =>
  data.some((el) =>
    Object.entries(obj).every(([key, value]) => value === el[key])
  );

// type = "create" \ "add"  \ "rename"

function CreateGroup({ setShowCreateGroup, showCreateGroup, type, chat }) {
  let navigate = useNavigate();

  const initialloginInfos = {
    chatName: chat ? chat.chatName : "",
  };

  const createGroupValidation = Yup.object({
    chatName:
      type === "create" || type === "rename"
        ? Yup.string().required("Group name is required.").min(3).max(40)
        : Yup.string(),
  });

  const input = useRef(null);
  const popUpRef = useRef();
  useOnClickOutside(popUpRef, showCreateGroup, () => {
    setShowCreateGroup(false);
  });
  const { chatName } = initialloginInfos;
  const [members, setMembers] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState(searchTerm);

  const {
    mutate: search,
    data: searchData,
    isLoading: isSearchLoading,
    isSuccess: isSearchSuccess,
  } = useSearch();

  const {
    mutate: CreateChatGroup,
    data: CreateChatGroupData,
    isLoading: isChatGroupLoading,
    isSuccess: isChatGroupSuccess,
    isError: isChatGroupError,
    error: ChatGroupError,
  } = useCreateChatGroup();

  const {
    mutate: AddMember,
    data: AddMemberData,
    isLoading: isAddMemberLoading,
    isSuccess: isAddMemberSuccess,
    isError: isAddMemberError,
    error: AddMemberError,
  } = useAddMember(chat);

  const {
    mutate: RenameGroup,
    data: RenameGroupData,
    isLoading: isRenameGroupLoading,
    isSuccess: isRenameGroupSuccess,
    isError: isRenameGroupError,
    error: RenameGroupError,
  } = useRenameGroup(chat);

  const isLoading =
    isChatGroupLoading || isAddMemberLoading || isRenameGroupLoading;
  const isError = isChatGroupError || isAddMemberError || isRenameGroupError;
  const error = ChatGroupError || AddMemberError || RenameGroupError;
  const isSuccess =
    isChatGroupSuccess || isAddMemberSuccess || isRenameGroupSuccess;

  const submitHandler = async (values) => {
    const groupMembers = members.map((member) => member._id);

    if (type === "create") {
      CreateChatGroup({ chatName: values.chatName, users: groupMembers });
    } else if (type === "add") {
      AddMember({ userId: groupMembers[0], chatId: chat._id });
    } else if (type === "rename") {
      RenameGroup({ chatName: values.chatName, chatId: chat._id });
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setSearchTerm(debouncedTerm), 1000);
    return () => clearTimeout(timer);
  }, [debouncedTerm]);

  // submit a new search
  useEffect(() => {
    if (searchTerm.trim().length > 0) {
      search({ term: searchTerm });
    } else {
    }
  }, [searchTerm]);

  useEffect(() => {
    if (type === "create" && CreateChatGroupData?.status === "success") {
      navigate(`/messages/${CreateChatGroupData.data.chat._id}`);
      setShowCreateGroup(false);
    } else if (type === "add" && AddMemberData?.status === "success") {
      setShowCreateGroup(false);
    } else if (type === "rename" && RenameGroupData?.status === "success") {
      setShowCreateGroup(false);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      toast.error(error?.response?.data?.message);
    }
  }, [isError]);
  return (
    <div className={`${styles.wrap} blur`}>
      <Card className={styles.card} innerRef={popUpRef}>
        <div className={styles.header}>
          <span>
            {type === "create"
              ? "Create Group"
              : type === "add"
              ? "Add member"
              : type === "rename"
              ? "Chane Group Name"
              : ""}
          </span>
          <div
            onClick={() => {
              setShowCreateGroup(false);
            }}
            className={`${styles.exit} small_circle`}
          >
            <i className="exit_icon"></i>
          </div>
        </div>
        <div className={styles.content}>
          <Formik
            enableReinitialize
            validationSchema={createGroupValidation}
            initialValues={{
              chatName,
            }}
            onSubmit={(values) => {
              if (members.length < 2 && type === "create") {
                toast.error("Please add at least 2 members to group");
                return;
              } else if (members.length < 1 && type === "add") {
                toast.error("Please select member first");
                return;
              }

              submitHandler(values);
            }}
          >
            {(formik) => (
              <Form className={styles.form} noValidate>
                <FormLoader loading={isLoading}>
                  {(type === "create" || type === "rename") && (
                    <LoginInput
                      type="text"
                      name="chatName"
                      placeholder="Group Name"
                      disabled={isLoading}
                    />
                  )}

                  {(type === "create" || type === "add") && (
                    <p className={styles.label}>Add members to group</p>
                  )}
                  {members.length > 0 && (
                    <div className={styles.members}>
                      {members.map((member) => (
                        <div className={styles.member} key={member._id}>
                          <img src={member.photo} alt="" />
                          {`${member.first_name} ${member.last_name}`}
                          <i
                            style={{
                              transform: "scale(.8)",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              setMembers((perv) =>
                                perv.filter((m) => m._id !== member._id)
                              );
                            }}
                            className="exit_icon"
                          ></i>
                        </div>
                      ))}
                    </div>
                  )}
                  {(type === "create" ||
                    (type === "add" && members.length < 1)) && (
                    <>
                      <div className={`${styles.input_wrap}`}>
                        <input
                          type="text"
                          placeholder="search for members to add"
                          ref={input}
                          onChange={(e) => setDebouncedTerm(e.target.value)}
                          value={debouncedTerm}
                        />
                      </div>

                      <div
                        className="scrollbar"
                        style={{ maxHeight: "150px", marginBottom: "10px" }}
                      >
                        <div className={`${classes.search_results} scrollbar`}>
                          {!isSearchLoading &&
                          isSearchSuccess &&
                          searchData?.data.results.length > 0 &&
                          searchTerm.trim().length > 0 ? (
                            searchData?.data.results.map((user) => (
                              <div
                                to={`/messages/${user._id}`}
                                className={`${classes.search_item} hover2`}
                                onClick={() => {
                                  if (!isDuplicate(members, user)) {
                                    setMembers((perv) => [...perv, user]);
                                  }
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
                            ""
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </FormLoader>
                <button type="submit" className="btn_blue" disabled={isLoading}>
                  {type === "create"
                    ? "Create"
                    : type === "add"
                    ? "Add"
                    : type === "rename"
                    ? "Change"
                    : ""}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </Card>
    </div>
  );
}

export default CreateGroup;
