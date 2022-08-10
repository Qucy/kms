import { createSlice } from '@reduxjs/toolkit';

const initalImageState = {
  imageSource: 'DEFAULT',
  paginatedImageList: [],
  imageObject: {},
  scrollPageNumber: 1,
  tableStatus: 'LOADING',
  buttonStatus: '',
};

export const imageSlice = createSlice({
  name: 'image',
  initialState: initalImageState,
  reducers: {
    setImageSource: (state, action) => {
      state.imageSource = action.payload;
    },
    setPaginatedImageList: (state, action) => {
      state.paginatedImageList = action.payload;
    },
    setImageObject: (state, action) => {
      state.imageObject = action.payload;
    },
    setScrollPageNumber: (state, action) => {
      state.scrollPageNumber = action.payload;
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
  setImageSource,
  setPaginatedImageList,
  setImageObject,
  setScrollPageNumber,
  setTableStatus,
  setButtonStatus,
} = imageSlice.actions;

export const imageSliceSelector = {
  imageSource: (state) => state.image.imageSource,
  paginatedImageList: (state) => state.image.paginatedImageList,
  imageObject: (state) => state.image.imageObject,
  scrollPageNumber: (state) => state.image.scrollPageNumber,
  tableStatus: (state) => state.image.tableStatus,
  buttonStatus: (state) => state.image.buttonStatus,
};

export default imageSlice.reducer;
