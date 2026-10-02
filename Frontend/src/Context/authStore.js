import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_BACKEND_URL;


axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    error: null,
    isLoading: false,
    isCheckingAuth: true,
    message: null,

    signup: async (name,email,password) => {
        set({ isLoading: true, error: null });
        try {
            const { data } = await axios.post(`${API_URL}/api/auth/signup`, { name, email, password });
            if (data.success) { 
                toast.success(data.message || "User registered successfully!");
                localStorage.setItem("token", data.token);
                set({ user: data.user, isAuthenticated: true });
            } else {
                toast.warning(data.message || "Signup failed!");
                set({ error: data.message });
            }
            return data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Error signing up!";
            toast.error(errorMessage);
            set({ error: errorMessage });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const { data } = await axios.post(`${API_URL}/api/auth/login`, { email, password });
            if (data.success) {
                toast.success(data.message || "Login successful!");
                localStorage.setItem("token", data.token);
                set({ user: data.user, isAuthenticated: true });
            } else {
                toast.warning(data.message || "Login failed!");
                set({ error: data.message });
            }
            return data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Error logging in!";
            toast.error(errorMessage);
            set({ error: errorMessage });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    logout: async () => {
        set({ isLoading: true });
        try {
            await axios.post(`${API_URL}/api/auth/logout`);
            toast.success("Logged out successfully!");
            set({ user: null, isAuthenticated: false });
        } catch (error) {
            toast.error(error.response?.data?.message || "Error logging out!");
        } finally {
            set({ isLoading: false });
        }
    },

    checkAuth: async () => {
        set({ isCheckingAuth: true, error: null });
        try {
            const { data } = await axios.get(`${API_URL}/api/auth/check-auth`);
            set({ user: data.user, isAuthenticated: true });
        } catch (error) {
            toast.error("Authentication failed! Please login again.");
            set({ error: "Authentication failed", isAuthenticated: false });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    
    forgotPassword: async (email) => {
        set({ isLoading: true, error: null });
        try {
            const { data } = await axios.post(`${API_URL}/api/auth/forgot-password`, { email });
            if (data.success) {
                set({ message: data.message });
            } else {
                toast.warning(data.message || "Request failed!");
                set({ error: data.message });
            }
            return data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Error sending OTP!";
            toast.error(errorMessage);
            set({ error: errorMessage });
        } finally {
            set({ isLoading: false });
        }
    },

    verifyOtp: async (otp) => {
        set({ isLoading: true, error: null });
        try {
            const { data } = await axios.post(`${API_URL}/api/auth/verify-otp`, { otp });
            if (data.success) {
                
                return data;
            } else {
                toast.warning(data.message || "OTP verification failed!");
                set({ error: data.message });
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Error verifying OTP!";
            toast.error(errorMessage);
            set({ error: errorMessage });
        } finally {
            set({ isLoading: false });
        }
    },
    
    resetPassword: async (otp, password) => {
        set({ isLoading: true, error: null });
        try {
            const { data } = await axios.post(`${API_URL}/api/auth/reset-password/${otp}`, { password });
    
            if (data.success) {
                set({ message: data.message });
            } else {
                toast.warning(data.message || "Reset failed!");
                set({ error: data.message });
            }
            return data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Error resetting password!";
            toast.error(errorMessage);
            set({ error: errorMessage });
        } finally {
            set({ isLoading: false });
        }
    },
    
    
}));
