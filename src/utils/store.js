import { configureStore } from '@reduxjs/toolkit';
import tagReducer from '../hooks/tag/tagSlice';
import imageReducer from '../hooks/image/imageSlice';
import campaignReducer from '../hooks/campaign/campaignSlice';
import campmanageReducer from '../hooks/campmanage/campmanageSlice';

export const store = configureStore({
  reducer: {
    tag: tagReducer,
    image: imageReducer,
    campaign: campaignReducer,
    campmanage: campmanageReducer,
  },
});
