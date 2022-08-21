import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActionArea,
  Stack,
  CircularProgress,
  MenuItem,
  Button,
  Select,
  InputLabel,
  FormControl,
  Autocomplete,
  TextField,
  Divider
} from '@mui/material';

import Grid from '@mui/material/Grid';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

import { API_CAMPAIGN } from '../../utils/api';
import CampaignDetail from './CampaignDetail';
import NewCampaign from './NewCampaign';
import { tagSliceSelector } from '../../hooks/tag/tagSlice';

import {
  setCampaignList,
  setCampaignDetail,
  campaignSliceSelector,
} from '../../hooks/campaign/campaignSlice';

export default function Campaign() {
  const campaignDetail = useSelector(campaignSliceSelector.campaignDetail);

  const dropDownOption = React.useRef(0)
  const [messageType, setMessageType] = React.useState("All Message Type");
  const [companyName, setCompanyName] = React.useState("All Companies");
  const [hsbcvsNonHSBC, sethsbcvsNonHSBC] = React.useState("All Campaign")

  const [campaigns, setCampaigns] = React.useState([]);

  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = React.useState(false);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const [isLoading, setIsLoading] = React.useState(true);

  const [imageSource, setImageSource] = React.useState('DEFAULT')

  const toggleDrawerOpen = () => setIsDetailDrawerOpen((_prevState) => !_prevState);

  const updateCampaignDetail = (d) => dispatch(setCampaignDetail(d));

  const toggleDialogOpen = () => setIsDialogOpen((_prevState) => !_prevState);

  const allTagList = useSelector(tagSliceSelector.allTagList);

  const dispatch = useDispatch();

  const fetchCampaigns = async () => {
    setIsLoading(true);
    try {
      const response = await API_CAMPAIGN.getAllCampaigns();

      if (response.status === 200) {
        setCampaigns(response.data);
        dropDownOption.messageType = [...new Set(response.data.map(a => a.message_type))]
        dropDownOption.companyName = [...new Set(response.data.map(a => a.company))]
        setIsLoading(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  //function to retrieve all the images
  const fetchFilteredCampaigns = async (tag_names) => {
    try {
      const response = await API_CAMPAIGN.getFilteredCampaigns(tag_names);
      if (response.status === 200) {
        setCampaigns(response.data);
        dropDownOption.messageType = [...new Set(response.data.map(a => a.message_type))]
        dropDownOption.companyName = [...new Set(response.data.map(a => a.company))]
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // search function for image list
  const onSearch = async (event, value) => {
     if ((Array.isArray(value) && value.length) === 0) {
      fetchCampaigns()
     }
     else {
      fetchFilteredCampaigns(value);
    }
    };

  React.useEffect(() => {
    fetchCampaigns();
  }, []);

  const onNewCampaign = () => {
    toggleDialogOpen();
  };

  const onSelect = (e, d) => {
    toggleDrawerOpen();
    updateCampaignDetail(d);
  };

  const handleCompanyNameChange = async (event) => {
    try {
      // Display the loading page
      setIsLoading(true);

      // Extract the value selcted by the user
      var companyName = event.target.value

      // Display the selected value
      setCompanyName(companyName)

      // Special handling for default value
      if (companyName === "All Companies") {
        companyName = ""
      }
      
      // Get data by calling the API endpoint
      const response = await API_CAMPAIGN.getCampaignsByCompanyName(companyName);
      if (response.status === 200) {
        setCampaigns(response.data);
        setIsLoading(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleMessageTypeChange = async (event) => {
    try {
      // Display the loading page
      setIsLoading(true);

      // Extract the value selcted by the user
      var messageType = event.target.value;

      // Display the selected value
      setMessageType(messageType);

      // Special handling for default value
      if (messageType === "All Message Type") {
        messageType = ""
      }

      // Get data by calling the API endpoint
      const response = await API_CAMPAIGN.getCampaignsByMessageType(messageType);
      if (response.status === 200) {
        setCampaigns(response.data);
        setIsLoading(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleHSBCvsNonHSBCChange = async (event) => {
    try {
      // Display the loading page
      setIsLoading(true);

      // Extract the value selcted by the user
      var hsbcvsNonHSBC = event.target.value;

      // Display the selected value
      sethsbcvsNonHSBC(hsbcvsNonHSBC);

      // Special handling for default value
      if (hsbcvsNonHSBC === "All Campaign") {
        hsbcvsNonHSBC = ""
      }

      // Get data by calling the API endpoint
      const response = await API_CAMPAIGN.getCampaignsByHSBCvsNonHSBC(hsbcvsNonHSBC);
      if (response.status === 200) {
        setCampaigns(response.data);
        setIsLoading(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const onDrawerClose = React.useCallback(() => {
    toggleDrawerOpen();
    updateCampaignDetail({});
  }, []);

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <React.Fragment>
      <Stack
        direction='row'
        justifyContent='space-between'
        alignItems='center'
        sx={{ mb: 2 }}
      >
        <Typography variant='h5' sx={{ fontColor: 'blue' }}>
          Campaign Repository
        </Typography>

        <Button
          variant='contained'
          startIcon={<AddOutlinedIcon />}
          onClick={onNewCampaign}
        >
          New Campaign
        </Button>
      </Stack>

      <Stack
          direction='row'
          justifyContent='space-evenly'
          alignItems='center'
          sx={{ mb: 5, mt: 4 }}
          divider={<Divider orientation="vertical" flexItem />}
      >
        <Autocomplete
          onChange={onSearch}
          sx={{ width: 300 }}
          multiple
          id='tags-standard'
          options={allTagList.slice().sort((a, b) => a.tag_category.localeCompare(b.tag_category))}
          groupBy={(option) => option.tag_category}
          getOptionLabel={(option) => option.tag_name}
          renderInput={(params) => (
            <TextField
              {...params}
              variant='standard'
              label='Search by hash tag'
              placeholder='Hash tag'
            />
          )}
        />

        <FormControl >
            <InputLabel id="company_label">Company</InputLabel>
            <Select
              labelId="company_label"
              id="demo-compnay-select"
              label="Company"
              value={companyName}
              onChange={handleCompanyNameChange}
            >
              {dropDownOption.companyName.map((d, i) =>
              (
                    <MenuItem key={i} value={d}>{d}</MenuItem>
              )
              )
              }
              <MenuItem key={999} value={"All Companies"}>{"All Companies"}</MenuItem>
            </Select>
          </FormControl>

          <FormControl>
            <InputLabel id="message_type_label">Message Type</InputLabel>
            <Select
              labelId="message_type_label"
              id="demo-message-type-select"
              label="HSBC vs Non HSBC"
              value={messageType}
              onChange={handleMessageTypeChange}
            >
              {dropDownOption.messageType.map((d, i) =>
              (
                    <MenuItem key={i} value={d}>{d}</MenuItem>
              )
              )
              }
              <MenuItem key={999} value={"All Message Type"}>{"All Message Type"}</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl>
            <InputLabel id="hsbc_vs_non_hsbc_label">HSBC vs Non-HSBC</InputLabel>
            <Select
              labelId="hsbc_vs_non_hsbc_label"
              id="demo-hsbc_vs_non_hsbc_label-select"
              label="HSBC vs Non HSBC"
              value={hsbcvsNonHSBC}
              onChange={handleHSBCvsNonHSBCChange}
            >
              <MenuItem key={1} value={"All Campaign"}>{"All Campaign"}</MenuItem>
              <MenuItem key={2} value={"HSBC"}>{"HSBC Campaign"}</MenuItem>
              <MenuItem key={3} value={"Non-HSBC"}>{"Non-HSBC Campaign"}</MenuItem>
            </Select>
          </FormControl>


      </Stack>

      <Stack>
        <Grid container spacing={2} columns={{ sm: 4, md: 8, lg: 10 }}>
          {campaigns.map((d, i) => (
            <Grid item xs={1} md={2} lg={2} key={i}>
              <Card
                key={i}
                variant='outlined'
                sx={{
                  position: 'relative',
                  borderRadius: 2,
                  overflow: 'visible',
                }}
              >
                <CardActionArea
                  onClick={(evt) =>
                    onSelect(evt, {
                      campaignId: d.id,
                      company: d.company,
                      classification: d.hsbc_vs_non_hsbc,
                      location: d.location,
                      messageType: d.message_type,
                      responseRate: d.response_rate,
                      tag: d.tag,
                    })
                  }
                >
                  <CardMedia
                    component='img'
                    src={`data:image/jpeg;base64,${d.img}`}
                    alt='green iguana'
                  />
                  <CardContent>
                    <Stack direction='row' justifyContent='space-between'>
                      <div>
                        <Typography
                          variant='subtitle2'
                          component='div'
                          sx={{ color: '#2196f3' }}
                        >
                          {`Response Rate: ${
                            i % 2 === 0
                              ? Math.round(Math.random() * 1000) / 100
                              : d.response_rate
                          }%`}
                        </Typography>
                        <Typography variant='h6' component='div' noWrap>
                          {d.company}
                        </Typography>
                        <Typography variant='caption' color='text.secondary'>
                          {d.message_type}
                        </Typography>
                      </div>
                    </Stack>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Stack>
      <CampaignDetail
        open={isDetailDrawerOpen}
        onClose={onDrawerClose}
        campaignDetail={campaignDetail}
      />
      <NewCampaign
        open={isDialogOpen}
        onClose={toggleDialogOpen}
        onCancel={toggleDialogOpen}
        setIsLoading={setIsLoading}
        fetchCampaigns={fetchCampaigns}
      />
    </React.Fragment>
  );
}
