import { createSlice } from '@reduxjs/toolkit';

const initalCampaignManageState = {
  campaignList: [],
  campaignDetail: {
    campaignId: null,
    companyName: '',
    classification: '',
    location: '',
    messageType: '',
    responseRate: null,
    tag: [],
    image: [],
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

export const campaignManageSlice = createSlice({
  name: 'campmanage',
  initialState: initalCampaignManageState,
  reducers: {
    default: () => initalCampaignManageState,
    setCampaignList: (state, action) => {
      state.campaignList = action.payload;
    },
    setCampaignDetail: (state, action) => {
      state.campaignDetail = action.payload;
    },
    setCampaignDetailImage: (state, action) => {
      state.campaignDetail.image = action.payload;
    },
    setCampaignDetailTag: (state, action) => {
      state.campaignDetail.tag = action.payload;
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
  setCampaignDetailImage,
  setCampaignDetailTag,
  setMessageFilter,
  setClassificationFilter,
  setCompanyFilter,
  setStatus,
} = campaignManageSlice.actions;

export const campaignManageSliceSelector = {
  campaignList: (state) => state.campmanage.campaignList,
  campaignDetail: (state) => state.campmanage.campaignDetail,
  filter: (state) => state.campmanage.filter,
  status: (state) => state.campmanage.status,
};

export default campaignManageSlice.reducer;
