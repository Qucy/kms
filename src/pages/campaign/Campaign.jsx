import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActionArea,
  Stack,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
} from '@mui/material';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { tagSliceSelector } from '../../hooks/tag/tagSlice';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

import { API_CAMPAIGN } from '../../utils/api';
import CampaignDrawer from './CampaignDrawer';

export default function Campaign() {
  const allTagList = useSelector(tagSliceSelector.allTagList);
  const [campaigns, setCampaigns] = React.useState([]);
  const [campaignDetail, setCampaignDetail] = React.useState({});
  const [newCampaign, setNewCampaign] = React.useState({
    companyName: '',
    location: '',
    classification: '',
    messageType: '',
    responseRate: 0,
  });
  const [uploadedImages, setUploadedImages] = React.useState();
  const [imagePreview, setImagePreview] = React.useState();

  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = React.useState(false);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const [isLoading, setIsLoading] = React.useState(true);

  const toggleDrawerOpen = () => setIsDetailDrawerOpen((_prevState) => !_prevState);
  const updateCampaignDetail = (d) => setCampaignDetail(d);

  const toggleDialogOpen = () => setIsDialogOpen((_prevState) => !_prevState);

  React.useEffect(() => {
    if (!uploadedImages) {
      setImagePreview(undefined);
      return;
    }
    let preview_tmp = [];

    for (let i = 0; i < uploadedImages.length; i++) {
      let objectUrl = URL.createObjectURL(uploadedImages[i]);
      preview_tmp.push(objectUrl);
    }

    setImagePreview(preview_tmp);
    // free memory when ever this component is unmounted
    // return () => URL.revokeObjectURL(objectUrl) TODO
  }, [uploadedImages]);

  const onImagesUpload = (e) => {
    const { files } = e.target;

    if (!files || files.length === 0) {
      setUploadedImages(undefined);
      return;
    } else {
      setUploadedImages(files);
    }
  };

  React.useEffect(() => {
    uploadedImages && console.log(uploadedImages['0']);
  }, [uploadedImages]);

  const onSaveNewCampaign = async () => {
    const payload = {
      company: newCampaign.companyName,
      hsbc_vs_non_hsbc: newCampaign.classification,
      location: newCampaign.location,
      response_rate: newCampaign.responseRate,
      message_type: newCampaign.messageType,
      file: uploadedImages[0],
    };

    console.log(payload);

    const response = await API_CAMPAIGN.createCampaign(payload);

    console.log(response);
  };

  const onNewCampaignChange = (e, t) => {
    setNewCampaign((_prevState) => {
      _prevState[t] = t === 'responseRate' ? Number(e.target.value) : e.target.value;

      return {
        ..._prevState,
      };
    });
  };

  const onNewCampaign = () => {
    toggleDialogOpen();
  };

  const onSelect = (e, d) => {
    toggleDrawerOpen();
    updateCampaignDetail(d);
  };

  const onSearch = (e, t) => {
    console.log(t);
  };

  const onDrawerClose = React.useCallback(() => {
    toggleDrawerOpen();
    updateCampaignDetail({});
  }, []);

  React.useEffect(() => {
    const fetch = async () => {
      try {
        const response = await API_CAMPAIGN.getAllCampaigns();

        if (response.status === 200) {
          setCampaigns(response.data);
          setIsLoading(false);
        }
      } catch (e) {
        console.error(e);
      }
    };

    fetch();
  }, []);

  React.useEffect(() => console.log(newCampaign), [newCampaign]);

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
          Campaign
        </Typography>
        <Button
          variant='contained'
          startIcon={<AddOutlinedIcon />}
          onClick={onNewCampaign}
        >
          New Campaign
        </Button>
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
      <CampaignDrawer
        open={isDetailDrawerOpen}
        campaignDetail={campaignDetail}
        onClose={onDrawerClose}
      />
      <Dialog open={isDialogOpen} onClose={toggleDialogOpen}>
        <DialogTitle>New Campaign</DialogTitle>
        <DialogContent sx={{ width: 500 }}>
          <Stack>
            <Typography variant='button' sx={{ color: 'black' }}>
              Step 1
            </Typography>
            <Typography variant='body2'>Upload at least 1 image.</Typography>
            <Button
              variant='contained'
              component='label'
              startIcon={<PhotoCamera />}
              sx={{ mt: 1, width: 200 }}
              onChange={onImagesUpload}
            >
              Upload Image(s)
              <input hidden accept='image/*' multiple type='file' />
            </Button>
            {uploadedImages &&
              imagePreview &&
              imagePreview.map((preview, index) => (
                <img
                  key={index}
                  src={preview}
                  width='400'
                  height='400'
                  alt='new uploaded'
                  style={{ marginTop: '1em', marginBottom: '1em' }}
                  loading='lazy'
                />
              ))}
          </Stack>

          <Stack spacing={1} sx={{ mt: 2 }}>
            <Stack>
              <Typography variant='button' sx={{ color: 'black' }}>
                Step 2
              </Typography>
              <Typography variant='body2'>
                Fill in required information for the campaign.
              </Typography>
            </Stack>
            <TextField
              autoFocus
              required
              margin='dense'
              id='name'
              label='Company Name'
              type='text'
              fullWidth
              variant='standard'
              onChange={(evt) => onNewCampaignChange(evt, 'companyName')}
            />
            <FormControl variant='standard' fullWidth required>
              <InputLabel id='new-campaign-location'>Location</InputLabel>
              <Select
                labelId='new-campaign-location-label-id'
                id='new-campaign-location-id'
                value={newCampaign.location}
                onChange={(evt) => onNewCampaignChange(evt, 'location')}
                label='Location'
              >
                <MenuItem value={'Hong Kong'}>Hong Kong</MenuItem>
                <MenuItem value={'Global'}>Global</MenuItem>
              </Select>
            </FormControl>
            <FormControl variant='standard' fullWidth required>
              <InputLabel id='new-campaign-classification'>Classification</InputLabel>
              <Select
                labelId='new-campaign-classification-label-id'
                id='new-campaign-classification-id'
                value={newCampaign.classification}
                onChange={(evt) => onNewCampaignChange(evt, 'classification')}
                label='Classification'
              >
                <MenuItem value={'HSBC'}>HSBC</MenuItem>
                <MenuItem value={'Non-HSBC'}>Non-HSBC</MenuItem>
              </Select>
            </FormControl>
            <FormControl variant='standard' fullWidth required>
              <InputLabel id='new-campaign-messageType'>Message Type</InputLabel>
              <Select
                labelId='new-campaign-messageType-label-id'
                id='new-campaign-messageType-id'
                value={newCampaign.messageType}
                onChange={(evt) => onNewCampaignChange(evt, 'messageType')}
                label='Message Type'
              >
                <MenuItem value={'MBM Banner'}>MGM Banner</MenuItem>
                <MenuItem value={'Email Banner'}>Email Banner</MenuItem>
                <MenuItem value={'PWS Banner'}>PWS Banner</MenuItem>
                <MenuItem value={'FB Banner'}>FB Banner</MenuItem>
                <MenuItem value={'Campaign Landing Page'}>Campaign Landing Page</MenuItem>
                <MenuItem value={'PWS'}>PWS</MenuItem>
                <MenuItem value={'Mobile In-App'}>Mobile In-App</MenuItem>
              </Select>
            </FormControl>
            <TextField
              autoFocus
              margin='dense'
              id='name'
              label='Response Rate'
              type='number'
              fullWidth
              variant='standard'
              onChange={(evt) => onNewCampaignChange(evt, 'responseRate')}
            />
          </Stack>

          <Stack spacing={1} sx={{ mt: 2 }}>
            <Stack>
              <Typography variant='button' sx={{ color: 'black' }}>
                Step 3
              </Typography>
              <Typography variant='body2'>
                Select related tag(s) of the campaign.
              </Typography>
            </Stack>
            <Autocomplete
              multiple
              onChange={onSearch}
              id='tags-standard'
              options={allTagList}
              getOptionLabel={(option) => option['tag_name']}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant='standard'
                  label='Tags'
                  placeholder='Tags'
                />
              )}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={toggleDialogOpen}>Cancel</Button>
          <Button onClick={onSaveNewCampaign}>Save</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
