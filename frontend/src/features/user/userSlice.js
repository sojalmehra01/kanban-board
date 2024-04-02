import { createSlice } from '@reduxjs/toolkit';

const initialState = {
 full_name:"", 
 email: "", 
 id: ""
};

const userSlice = createSlice({
 name: 'user',
 initialState,
 reducers: {
    setUserDetails: (state, action) => {
      state.full_name = action.payload.full_name;
      state.email = action.payload.email;
      state.id = action.payload.id;
    },
 },
});

export const { setUserDetails } = userSlice.actions;

export default userSlice.reducer;
