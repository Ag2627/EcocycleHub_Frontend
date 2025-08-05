import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const API = import.meta.env.VITE_API_BASE_URL;
export const fetchUsers = createAsyncThunk("users/fetch", async () => {
  const res = await axios.get(`${API}/users`);
  return res.data;
});


const userSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
  },
});

export default userSlice.reducer;
