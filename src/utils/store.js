import { configureStore } from '@reduxjs/toolkit';
import tagDataReducer from '../hooks/tag/tagDataSlice';

export const store = configureStore({
  reducer: {
    tagData: tagDataReducer,
  },
});
