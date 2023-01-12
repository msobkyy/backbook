import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";

const AddFCM = async ({ fcm }) => {
  const { data } = await axios.post(
    `${process.env.REACT_APP_BACKEND_URL}/api/v1/users/fcm`,
    { fcmToken: fcm },
    {
      withCredentials: true,
    }
  );
  return data;
};

export const useAddFCM = () => {
  return useMutation({
    mutationKey: "useAddFCM",
    mutationFn: AddFCM,
    onSuccess: (data) => {
      Cookies.set("fcm", JSON.stringify(data.fcmToken), {
        expires: 90,
      });
    },
  });
};
