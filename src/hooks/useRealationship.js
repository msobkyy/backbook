import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { socket } from "../routes/IsLoggedIn";
import { queryClient } from "./../App";

const AddFriend = async ({ id, type }) => {
  const { data } = await axios.put(
    `${process.env.REACT_APP_BACKEND_URL}/api/v1/friends/${type}/${id}`,
    {},
    {
      withCredentials: true,
    }
  );
  return data;
};

export const useRelationship = (usernameID) => {
  return useMutation({
    mutationKey: "useRelationship",
    mutationFn: AddFriend,
    onSuccess: (data) => {
      const newNotification = data?.data?.newNotification;

      queryClient.setQueryData(["getProfile", usernameID], (oldData) => {
        if (!oldData) return oldData;

        let newData = oldData;
        newData.data.friendship = data.data.friendship;
        return oldData
          ? {
              ...oldData,
              newData,
            }
          : oldData;
      });
      if (newNotification) {
        socket.emit("notification", { notification: newNotification });
      }
    },
  });
};
