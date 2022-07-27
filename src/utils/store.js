import { configureStore } from '@reduxjs/toolkit';
import tagReducer from '../hooks/tag/tagSlice';

export const store = configureStore({
  reducer: {
    tag: tagReducer,
  },
});
