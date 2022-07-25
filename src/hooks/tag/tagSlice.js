import { createSlice } from '@reduxjs/toolkit';

const initalTagState = {
  tagList: [],
  tagObject: {},
  tableStatus: 'LOADING',
  buttonStatus: '',
};

export const tagSlice = createSlice({
  name: 'tag',
  initialState: initalTagState,
  reducers: {
    setTagList: (state, action) => {
      state.tagList = action.payload;
    },
    setTagObject: (state, action) => {
      state.tagObject = action.payload;
    },
    setTableStatus: (state, action) => {
      state.tableStatus = action.payload;
    },
    setButtonStatus: (state, action) => {
      state.buttonStatus = action.payload;
    },
  },
});

export const { setTagList, setTagObject, setTableStatus, setButtonStatus } =
  tagSlice.actions;

export const tagSliceSelector = {
  tagList: (state) => state.tag.tagList,
  tagObject: (state) => state.tag.tagObject,
  tableStatus: (state) => state.tag.tableStatus,
  buttonStatus: (state) => state.tag.buttonStatus,
};

export default tagSlice.reducer;
