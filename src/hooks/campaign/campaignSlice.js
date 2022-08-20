import { createSlice } from '@reduxjs/toolkit';

const initalCampaignState = {
  campaignList: [],
  campaignDetail: {},
  status: 'LOADING',
};

export const campaignSlice = createSlice({
  name: 'campaign',
  initalState: initalCampaignState,
  reducers: {
    setCampaignList: (state, action) => {
      state.campaignList = action.payload;
    },
    setCampaignDetail: (state, action) => {
      state.campaignDetail = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
  },
});

export const { setCampaignList, setCampaignDetail, setStatus } = campaignSlice.actions;

export const campaignSliceSelector = {
  campaignList: (state) => state.campaign.campaignList,
  campaignDetail: (state) => state.campaign.campaignDetail,
  status: (state) => state.campaign.status,
};

export default campaignSlice.reducer;
