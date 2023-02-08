import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const GetChat = async ({ user }) => {
  const { data } = await axios.post(
    `${process.env.REACT_APP_BACKEND_URL}/api/v1/chats/create/private`,
    { userId: user },
    {
      withCredentials: true,
    }
  );
  return data;
};

export const useGetChat = () => {
  return useMutation({
    mutationKey: "useGetChat",
    mutationFn: GetChat,
  });
};
