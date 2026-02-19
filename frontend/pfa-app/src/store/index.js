import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice"; // Assure-toi que ce fichier existe bien

export const store = configureStore({
  reducer: {
    users: userReducer,
  },
});
