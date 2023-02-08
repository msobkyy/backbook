import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { queryClient } from "../App";

const SeenNotification = async ({ nid }) => {
  const { data } = await axios.put(
    `${process.env.REACT_APP_BACKEND_URL}/api/v1/users/notifications/${nid}/seen`,
    {},
    {
      withCredentials: true,
    }
  );
  return data;
};

export const useSeenNotification = () => {
  return useMutation({
    mutationKey: "useSeenNotification",
    mutationFn: SeenNotification,
    onSuccess: (data) => {
      const newNotification = data?.data?.notification;

      queryClient.setQueryData(["getNotifications"], (oldData) => {
        if (!oldData) return oldData;
        let newData = oldData;
        newData.data.notifications = newData.data.notifications.map(
          (notification) => {
            if (notification._id === newNotification._id) {
              return {
                ...notification,
                seen: "seen",
              };
            }
            return notification;
          }
        );
        return {
          ...oldData,
          newData,
        };
      });
    },
  });
};
