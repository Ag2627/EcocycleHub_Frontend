import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const API = import.meta.env.VITE_API_BASE_URL;
const API_URL = '${API}/ngos';
export const fetchCenters = createAsyncThunk("centers/fetch", async () => {
  const res = await axios.get(API_URL);
  return res.data;
});

export const createCenter = createAsyncThunk("centers/create", async (data) => {
  const res = await axios.post(API_URL, data);
  return res.data;
});


export const updateCenter = createAsyncThunk("centers/update", async ({ id, data }) => {
  const res = await axios.put(`${API_URL}/${id}`, data);
  return res.data;
});

export const deleteCenter = createAsyncThunk("centers/delete", async (id) => {
  await axios.delete(`${API_URL}/${id}`);
  return id;
});

const recyclingCenterSlice = createSlice({
  name: "centers",
  initialState: {
    centers: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCenters.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCenters.fulfilled, (state, action) => {
        state.loading = false;
        state.centers = action.payload;
      }).addCase(createCenter.fulfilled, (state, action) => {
  state.centers.push(action.payload);
})
      .addCase(updateCenter.fulfilled, (state, action) => {
        const index = state.centers.findIndex((c) => c._id === action.payload._id);
        if (index !== -1) state.centers[index] = action.payload;
      })
      .addCase(deleteCenter.fulfilled, (state, action) => {
        state.centers = state.centers.filter((c) => c._id !== action.payload);
      });
  },
});

export default recyclingCenterSlice.reducer;
