import { createSlice } from '@reduxjs/toolkit';

const initalImageState = {
  imageList: [],
  imageObject: {},
  tableStatus: 'LOADING',
  buttonStatus: '',
};

export const imageSlice = createSlice({
  name: 'image',
  initialState: initalImageState,
  reducers: {
    setAllImageList: (state, action) => {
      state.allImageList = action.payload;
    },
    setImageObject: (state, action) => {
      state.imageObject = action.payload;
    },
    setTableStatus: (state, action) => {
      state.tableStatus = action.payload;
    },
    setButtonStatus: (state, action) => {
      state.buttonStatus = action.payload;
    },
  },
});

export const {
  setAllImageList,
  setImageObject,
  setTableStatus,
  setButtonStatus,
} = imageSlice.actions;

export const imageSliceSelector = {
  allImageList: (state) => state.image.allImageList,
  imageObject: (state) => state.image.imageObject,
  tableStatus: (state) => state.image.tableStatus,
  buttonStatus: (state) => state.image.buttonStatus,
};

export default imageSlice.reducer;
