// redux/store/rewardSlice/index.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const BASE_URL =import.meta.env.VITE_API_BASE_URL;

// Fetch user, rewards, transactions, and balance
export const fetchRewardsData = createAsyncThunk(
  'rewards/fetchRewardsData',
  async (userId, thunkAPI) => {
    try {      
      const overviewRes = await axios.get(`${BASE_URL}/rewards/overview/${userId}`)
      
      const { balance, transactions, rewards } = overviewRes.data

      return {
        user: { _id: userId },
        balance,
        transactions,
        rewards
      }
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.error || 'Failed to fetch data')
    }
  }
)


// Redeem any reward (single/all/other logic handled in controller)
export const redeemReward = createAsyncThunk(
  'rewards/redeemReward',
  async ({ userId, rewardId, email }, thunkAPI) => {
    try {
      await axios.post(`${BASE_URL}/rewards/redeem`, { userId, rewardId })
      // ✅ Await the dispatch so Redux waits for it to finish
      await thunkAPI.dispatch(fetchRewardsData(email)).unwrap()
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.error || 'Redemption failed')
    }
  }
)

const rewardSlice = createSlice({
  name: 'rewards',
  initialState: {
    user: null,
    balance: 0,
    rewards: [],
    transactions: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRewardsData.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchRewardsData.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.balance = action.payload.balance
        state.transactions = action.payload.transactions
        state.rewards = action.payload.rewards
        state.error = null
      })
      .addCase(fetchRewardsData.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(redeemReward.rejected, (state, action) => {
        state.error = action.payload
      })
  }
})

export default rewardSlice.reducer
