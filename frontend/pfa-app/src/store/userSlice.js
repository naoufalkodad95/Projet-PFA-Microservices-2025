import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUsers } from "../services/userService"; 

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  return await getUsers();
});

const userSlice = createSlice({
  name: "users",
  initialState: { list: [], status: "idle" },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      });
  },
});

export default userSlice.reducer;
