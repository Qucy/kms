import { createSlice } from '@reduxjs/toolkit';

const initalTagDataState = {
  tagList: [],
  tagObject: {},
};

export const tagDataSlice = createSlice({
  name: 'tagData',
  initialState: initalTagDataState,
  reducers: {
    setTagList: (state, action) => {
      state.tagList = action.payload;
    },
    setTagObject: (state, action) => {
      state.tagObject = action.payload;
    },
  },
});

export const { setTagList, setTagObject } = tagDataSlice.actions;

export default tagDataSlice.reducer;
