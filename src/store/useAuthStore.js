import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';
const BASE_URL="https://vibe-backend-5bmf.onrender.com";
export const useAuthStore = create((set,get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket:null,
  // Check Auth
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check"); 
      set({ authUser: res.data }); 
      get().connectSocket(); // now includes gender, isActive, lastSeen
    } catch (error) {
      console.log("Error in checkAuth:", error); 
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // Signup
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data }); // stores full user object
      toast.success("Signup Successful");
      get().connectSocket();
    } catch (error) {
      console.log("Error in signup store", error.response?.data?.message);
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      set({ isSigningUp: false });
    }
  },

  // Login
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data }); // stores full user object including gender, isActive, lastSeen
      toast.success("Login Successful");
      get().connectSocket();
    } catch (error) {
      console.log("Error in login store", error.response?.data?.message);
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  // Logout
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
      
    } catch (error) {
      console.log("Error in logout:", error.response?.data?.message );
      toast.error("Failed to logout");
    }
  },

  // Update Profile
   updateProfile : async (formData) => {
  set({ isUpdatingProfile: true });
  try {
    const res = await axiosInstance.post("/auth/updateProfile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    set({ authUser: (prev) => ({ ...prev, profilePic: res.data.profilePic }) });
    toast.success("Profile updated successfully");
  } catch (error) {
    console.log("Error in updateProfile store:", error);
    toast.error("Failed to update profile");
  } finally {
    set({ isUpdatingProfile: false });
  }
}, 
 
  connectSocket: async () => {
    const {authUser} =get();
    if(!authUser ||get().socket?.connected) return;
    const socket=io(BASE_URL,{
      query:{userId:authUser._id}
    
    });
    socket.on("getOnlineUsers",(userId)=>{
      set({onlineUsers:userId});
    });
    socket.connect();
    set({socket:socket});
  },
  disconnectSocket: async () => {
    if (get().socket?.connected) get().socket.disconnect();
    
  },
}));
