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
    tags: [],
    images: [],
    imagePreview: [],
  },
  filter: {
    tagNames: [],
    messageType: '',
    hsbcvsNonHSBC: '',
    companyName: '',
  },
  status: 'LOADING', // LOADING, SUCCESS, ERROR, IDLE
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
    setCampaignDetailImages: (state, action) => {
      state.campaignDetail.images = action.payload;
    },
    setCampaignDetailTags: (state, action) => {
      state.campaignDetail.tags = action.payload;
    },
    setMessageFilter: (state, action) => {
      state.filter.messageType = action.payload;
    },
    setClassificationFilter: (state, action) => {
      state.filter.hsbcvsNonHSBC = action.payload;
    },
    setCompanyFilter: (state, action) => {
      state.filter.companyName = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
  },
});

export const {
  setCampaignList,
  setCampaignDetail,
  setCampaignDetailImages,
  setCampaignDetailTags,
  setMessageFilter,
  setClassificationFilter,
  setCompanyFilter,
  setStatus,
} = campaignSlice.actions;

export const campaignSliceSelector = {
  campaignList: (state) => state.campaign.campaignList,
  campaignDetail: (state) => state.campaign.campaignDetail,
  filter: (state) => state.campaign.filter,
  status: (state) => state.campaign.status,
};

export default campaignSlice.reducer;
