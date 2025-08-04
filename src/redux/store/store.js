import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice/index";
import reportReducer from "./reportSlice/index";
import userReducer from "./userSlice/index"
import recyclingCenterReducer from "./recyclingCenterSlice/index"
import rewardReducer from './rewardSlice/index'

const store = configureStore({
  reducer: {
    auth: authReducer,
    report: reportReducer,
    users: userReducer,
    centers:recyclingCenterReducer,
    rewards: rewardReducer,
  },
});

export default store;