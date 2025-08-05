import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Axios instance
const API = import.meta.env.VITE_API_BASE_URL;
const apiClient = axios.create({
  baseURL: API,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
  token: localStorage.getItem("token") || null,
  error: null,
};

// Thunks
export const registerUser = createAsyncThunk("auth/register", async (formData, { rejectWithValue }) => {
  try {
    const response = await apiClient.post("/auth/signup", formData);
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("name", response.data.data.name);
    localStorage.setItem("role", response.data.data.role);
    localStorage.setItem("id", response.data.data._id);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: "Registration failed." });
  }
});

export const loginUser = createAsyncThunk("auth/login", async (formData, { rejectWithValue }) => {
  try {
    const response = await apiClient.post("/auth/login", formData);
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("name", response.data.data.name);
    localStorage.setItem("role", response.data.data.role);
    localStorage.setItem("id", response.data.data._id);

    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: "Login failed." });
  }
});

export const googleLogin = createAsyncThunk("auth/googleLogin", async (emailData, { rejectWithValue }) => {
  try {
    const response = await apiClient.post("/auth/google-login", emailData);
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("name", response.data.data.name);
    localStorage.setItem("role", response.data.data.role);
    localStorage.setItem("id", response.data.data._id);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: "Google login failed." });
  }
});

export const logoutUser = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
  try {
    await apiClient.post("/auth/logout");
    localStorage.clear();
    return { success: true, message: "Logout successful" };
  } catch (error) {
    localStorage.clear();
    return rejectWithValue(error.response?.data || { message: "Logout failed but client session cleared." });
  }
});

export const checkAuth = createAsyncThunk("auth/checkAuth", async (_, { getState, rejectWithValue }) => {
  const token = getState().auth.token;
  if (!token) {
    return rejectWithValue({ success: false, message: "No token found." });
  }
  try {
    const response = await apiClient.get("/auth/check-auth");    
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    return response.data;
  } catch (error) {
    localStorage.removeItem("token");
    return rejectWithValue(error.response?.data || { success: false, message: "Session validation failed." });
  }
});

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const handlePending = (state) => {
      state.isLoading = true;
      state.error = null;
    };

    const handleAuthSuccess = (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = action.payload.success;
     state.user = action.payload?.data ?? null;
      state.token = action.payload.token || state.token;
      state.error = action.payload.success ? null : (action.payload.message || "Operation failed.");
    };

    const handleError = (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.error = action.payload?.message || "An unexpected error occurred.";
      if (action.type.includes("rejected") && !action.type.includes("checkAuth")) {
        state.token = null;
      }
    };

    builder
      // Check Auth
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = action.payload.success;
        state.user = action.payload.data || action.payload.user|| null;
        state.token = action.payload.token || null;
        state.error = action.payload.success ? null : action.payload.message || "Authentication check failed.";
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload?.message || "Session is invalid or expired.";
      })

      // Logout
      .addCase(logoutUser.pending, handlePending)
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload?.message || "Logout encountered an issue.";
      })

      // Register/Login/Google Login
      .addCase(registerUser.pending, handlePending)
      .addCase(registerUser.fulfilled, handleAuthSuccess)
      .addCase(registerUser.rejected, handleError)

      .addCase(loginUser.pending, handlePending)
      .addCase(loginUser.fulfilled, handleAuthSuccess)
      .addCase(loginUser.rejected, handleError)

      .addCase(googleLogin.pending, handlePending)
      .addCase(googleLogin.fulfilled, handleAuthSuccess)
      .addCase(googleLogin.rejected, handleError);
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;
