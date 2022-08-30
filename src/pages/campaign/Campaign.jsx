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
  Divider,
  Alert,
  Grid,
} from '@mui/material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

import { asyncFuncHandler } from '../../utils/handler';
import { API_CAMPAIGN } from '../../utils/api';
import {
  setCampaignList,
  setCampaignDetail,
  setMessageFilter,
  setClassificationFilter,
  setCompanyFilter,
  setStatus,
  campaignSliceSelector,
} from '../../hooks/campaign/campaignSlice';
import { tagSliceSelector } from '../../hooks/tag/tagSlice';
import CampaignDetail from './CampaignDetail';
import NewCampaign from './NewCampaign';

export default function Campaign() {
  const allTagList = useSelector(tagSliceSelector.allTagList);
  const campaignDetail = useSelector(campaignSliceSelector.campaignDetail);
  const campaignList = useSelector(campaignSliceSelector.campaignList);
  const filter = useSelector(campaignSliceSelector.filter);
  const status = useSelector(campaignSliceSelector.status);
  const dispatch = useDispatch();

  const dropDownOption = React.useRef(0);
  const [tagNames, setTagNames] = React.useState('');

  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = React.useState(false);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const toggleDrawerOpen = () => setIsDetailDrawerOpen((_prevState) => !_prevState);
  const toggleDialogOpen = () => setIsDialogOpen((_prevState) => !_prevState);

  const [imageSource, setImageSource] = React.useState('DEFAULT');

  const fetchCampaigns = async () => {
    dispatch(setStatus('LOADING'));

    const [response, error] = await asyncFuncHandler(API_CAMPAIGN.getAllCampaigns);

    if (response && response.statusText === 'OK') {
      dispatch(setCampaignList(response.data));
      dropDownOption.messageType = [...new Set(response.data.map((a) => a.message_type))];
      dropDownOption.companyName = [...new Set(response.data.map((a) => a.company))];
      dispatch(setStatus('SUCCESS'));
    }

    if (error) {
      dispatch(setStatus('ERROR'));
      console.error(error);
    }
  };

  //function to retrieve all the images
  const fetchFilteredCampaigns = async (tag_names) => {
    setTagNames(tag_names);

    const [response, error] = await asyncFuncHandler(() =>
      API_CAMPAIGN.getFilteredCampaignsbyTagNames(tag_names)
    );

    if (response && response.statusText === 'OK') {
      dispatch(setCampaignList(response.data));
      dropDownOption.messageType = [...new Set(response.data.map((a) => a.message_type))];
      dropDownOption.companyName = [...new Set(response.data.map((a) => a.company))];
    }

    if (error) {
      dispatch(setStatus('ERROR'));
      console.error(error);
    }
  };

  const handleFilterChange = async (event, target) => {
    let payload = {
      tag_names: tagNames,
      message_type: filter.messageType,
      hsbc_vs_non_hsbc: filter.hsbcvsNonHSBC,
      companyName: filter.companyName,
    };

    switch (target) {
      case 'messageType':
        dispatch(setMessageFilter(event.target.value));
        const _messageType =
          event.target.value === 'All Message Type' ? '' : event.target.value;
        payload['message_type'] = _messageType;
        break;
      case 'companyName':
        dispatch(setCompanyFilter(event.target.value));
        const _companyName =
          event.target.value === 'All Companies' ? '' : event.target.value;
        payload['companyName'] = _companyName;
        break;
      case 'classification':
        dispatch(setClassificationFilter(event.target.value));
        const _classification =
          event.target.value === 'All Campaign' ? '' : event.target.value;
        payload['hsbc_vs_non_hsbc'] = _classification;
        break;
      default:
        break;
    }

    const [response, error] = await asyncFuncHandler(() =>
      API_CAMPAIGN.getFilteredCampaigns(payload)
    );

    if (response && response.statusText === 'OK') {
      dispatch(setCampaignList(response.data));
    }

    if (error) {
      dispatch(setStatus('ERROR'));
      console.error(error);
    }
  };

  // search function for image list
  const onSearch = async (event, value) => {
    if ((Array.isArray(value) && value.length) === 0) {
      fetchCampaigns();
    } else {
      value = Object.keys(value).map((key) => value[key].tag_name);
      fetchFilteredCampaigns(value);
    }
  };

  const onSelect = (d) => {
    dispatch(setCampaignDetail(d));
    toggleDrawerOpen();
  };

  const onDrawerClose = React.useCallback(() => {
    toggleDrawerOpen();
    dispatch(setCampaignDetail({}));
  }, []);

  React.useEffect(() => {
    fetchCampaigns();
  }, []);

  React.useEffect(() => {
    return () => dispatch(setStatus('IDLE'));
  }, []);

  if (status === 'LOADING') {
    return (
      <Stack alignItems='center' justifyContent='center'>
        <CircularProgress />
      </Stack>
    );
  }

  if (status === 'ERROR') {
    return (
      <Stack alignItems='center' justifyContent='center'>
        <Alert sx={{ width: '100%' }} severity='error'>
          Something went wrong.
        </Alert>
      </Stack>
    );
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
          onClick={toggleDialogOpen}
        >
          New Campaign
        </Button>
      </Stack>

      <Stack
        direction='row'
        justifyContent='space-evenly'
        alignItems='center'
        sx={{ mb: 5, mt: 4 }}
        divider={<Divider orientation='vertical' flexItem />}
      >
        <Autocomplete
          onChange={onSearch}
          sx={{ width: 300 }}
          multiple
          id='tags-standard'
          options={allTagList
            .slice()
            .sort((a, b) => a.tag_category.localeCompare(b.tag_category))}
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

        <FormControl>
          <InputLabel id='company_label'>Company</InputLabel>
          <Select
            labelId='company_label'
            id='demo-compnay-select'
            label='Company'
            value={filter.companyName}
            sx={{ width: 200 }}
            // onChange={handleCompanyNameChange}
            onChange={(evt) => handleFilterChange(evt, 'companyName')}
          >
            {dropDownOption.companyName?.map((d, i) => (
              <MenuItem key={i} value={d}>
                {d}
              </MenuItem>
            ))}
            <MenuItem key={999} value={''}>
              {'All Companies'}
            </MenuItem>
          </Select>
        </FormControl>

        <FormControl>
          <InputLabel id='message_type_label'>Message Type</InputLabel>
          <Select
            labelId='message_type_label'
            id='demo-message-type-select'
            label='Message Type'
            value={filter.messageType}
            sx={{ width: 200 }}
            // onChange={handleMessageTypeChange}
            onChange={(evt) => handleFilterChange(evt, 'messageType')}
          >
            {dropDownOption.messageType?.map((d, i) => (
              <MenuItem key={i} value={d}>
                {d}
              </MenuItem>
            ))}
            <MenuItem key={999} value={''}>
              {'All Message Type'}
            </MenuItem>
          </Select>
        </FormControl>

        <FormControl>
          <InputLabel id='hsbc_vs_non_hsbc_label'>HSBC vs Non-HSBC</InputLabel>
          <Select
            labelId='hsbc_vs_non_hsbc_label'
            id='demo-hsbc_vs_non_hsbc_label-select'
            label='HSBC vs Non HSBC'
            value={filter.hsbcvsNonHSBC}
            sx={{ width: 200 }}
            //onChange={handleHSBCvsNonHSBCChange}
            onChange={(evt) => handleFilterChange(evt, 'classification')}
          >
            <MenuItem key={1} value={''}>
              {'All Campaign'}
            </MenuItem>
            <MenuItem key={2} value={'HSBC'}>
              {'HSBC Campaign'}
            </MenuItem>
            <MenuItem key={3} value={'Non-HSBC'}>
              {'Non-HSBC Campaign'}
            </MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <Stack>
        <Grid container spacing={2} columns={{ sm: 4, md: 8, lg: 10 }}>
          {campaignList.map((d, i) => (
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
                  onClick={() =>
                    onSelect({
                      campaignId: d.id,
                      companyName: d.company,
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
                        {/* <Typography
                          variant='subtitle2'
                          component='div'
                          sx={{ color: '#2196f3' }}
                        >
                          {`Response Rate: ${
                            i % 2 === 0
                              ? Math.round(Math.random() * 1000) / 100
                              : d.response_rate
                          }%`}
                        </Typography> */}
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
        campaignDetail={campaignDetail}
        open={isDetailDrawerOpen}
        onClose={onDrawerClose}
        fetchCampaigns={fetchCampaigns}
      />
      <NewCampaign
        open={isDialogOpen}
        onClose={toggleDialogOpen}
        onCancel={toggleDialogOpen}
        setIsLoading={() => dispatch(setStatus('LOADING'))}
        fetchCampaigns={fetchCampaigns}
      />
    </React.Fragment>
  );
}
