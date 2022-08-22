import { createSlice } from '@reduxjs/toolkit';

const initalCampaignState = {
  campaignList: [],
  campaignDetail: {
    campaignId: null,
    companyName: '',
    classification: '',
    location: '',
    messageType: '',
    responseRate: null,
    tag: [],
  },
  status: 'LOADING',
};

export const campaignSlice = createSlice({
  name: 'campaign',
  initialState: initalCampaignState,
  reducers: {
    default: () => initalCampaignState,
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
