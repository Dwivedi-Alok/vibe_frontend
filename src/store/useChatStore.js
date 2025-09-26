import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
// import { useAuthStore } from "../store/useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUserLoading: false,
  isMessageLoading: false,

  // Fetch users for sidebar
  getUsers: async () => {
    set({ isUserLoading: true });
    try {
      const res = await axiosInstance.get("/message/user");
      set({ users: res.data || [] });
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to fetch users"
      );
    } finally {
      set({ isUserLoading: false });
    }
  },

  // Fetch messages for selected user
   getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/message/${userId}`);
      set({ messages: res.data });
    } catch (err) {
      toast.error(
      err?.response?.data?.message || "Failed to fetch messages"
    );
    } finally {
      set({ isMessagesLoading: false });
    }
  },


  // Send message (text + image via FormData)
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    if (!selectedUser) return toast.error("No user selected");

    try {
      const res = await axiosInstance.post(
        `/message/send/${selectedUser._id}`,
        messageData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      set({ messages: [...messages, res.data] });
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to send message"
      );
    }
  },

  // Subscribe to socket messages
  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;
  
  
    const socket = useAuthStore.getState().socket;
    socket.on("newMessage", (newMessage) => {
      const isFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isFromSelectedUser) return;

      set({ messages: [...get().messages, newMessage] });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

 setSelectedUser: (user) => {
  const { selectedUser } = get();
  if (selectedUser?._id === user?._id) return; // prevent redundant updates
  set({ selectedUser: user });
},

}));
