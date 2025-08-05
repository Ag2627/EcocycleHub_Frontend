import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const API = import.meta.env.VITE_API_BASE_URL;

export const submitReport = createAsyncThunk(
  "report/submitReport",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API}/reports/create`,
        formData,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const fetchAllReports = createAsyncThunk(
  "report/fetchAllReports",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API}/reports/all`, {
        withCredentials: true,
      });
      console.log("Fetched reports:", response.data);
      
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const updateReportStatus = createAsyncThunk(
  "report/updateReportStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API}/reports/status/${id}`,
        { status },
        { withCredentials: true }
      );
      return response.data.report;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
const reportSlice = createSlice({
  name: "report",
  initialState: {
    isSubmitting: false,
    error: null,
    successMessage: null,
    reports:[]
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(fetchAllReports.pending, (state) => {
      state.loading = true;
    })
    .addCase(fetchAllReports.fulfilled, (state, action) => {
      state.loading = false;
      state.reports = action.payload;
    })
    .addCase(fetchAllReports.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    })

    // Update report status
    .addCase(updateReportStatus.fulfilled, (state, action) => {
      const index = state.reports.findIndex(r => r._id === action.payload._id);
      if (index !== -1) {
        state.reports[index] = action.payload;
      }
    })
      .addCase(submitReport.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(submitReport.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.successMessage = action.payload.message;
      })
      .addCase(submitReport.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload.message || "Submission failed";
      });
  },
});

export default reportSlice.reducer;
