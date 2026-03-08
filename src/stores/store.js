// src/stores/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import menuReducer from "./menuSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    menu: menuReducer,
  },
});