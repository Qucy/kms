import { configureStore } from '@reduxjs/toolkit';
import tagReducer from '../hooks/tag/tagSlice';
import imageReducer from '../hooks/image/imageSlice';

export const store = configureStore({
  reducer: {
    tag: tagReducer,
    image: imageReducer,
  },
});
