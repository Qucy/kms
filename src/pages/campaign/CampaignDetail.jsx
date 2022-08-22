import * as React from 'react';
import {
  Drawer,
  Box,
  Stack,
  Typography,
  IconButton,
  Grid,
  Chip,
  Skeleton,
  Button,
  ImageList,
  ImageListItem,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';

import { IconLabel } from '../../components/common';
import { API_IMAGE, API_CAMPAIGNTAGLINK } from '../../utils/api';

function CampaignDetail({ campaignDetail, open, onClose }) {
  const [isEditing, setIsEditing] = React.useState(false);

  const [images, setImages] = React.useState([]);
  const [tags, setTags] = React.useState([]);

  const [isTagLoading, setIsTagLoading] = React.useState(false);
  const [isImageLoading, setIsImageLoading] = React.useState(false);

  const [editingDetail, setEditingDetail] = React.useState(null);

  const toggleEditingState = () => setIsEditing((_prevState) => !_prevState);

  const onCancel = () => {
    //TODO: replace the following logic with Reference
    setEditingDetail(Object.assign({}, campaignDetail));

    toggleEditingState();
  };

  React.useEffect(() => {
    if (campaignDetail.campaignId && !editingDetail) {
      console.log('enter');
      setEditingDetail(Object.assign({}, campaignDetail));
    }
  }, [campaignDetail, editingDetail]);

  React.useEffect(() => console.log(editingDetail), [editingDetail]);

  React.useEffect(() => {
    const fetchTags = async (id) => {
      try {
        const response = await API_CAMPAIGNTAGLINK.getTagsByCampaignId(id);
        if (response.status === 200) {
          setTags(response.data);
          setIsTagLoading(false);
        }
      } catch (e) {
        console.error(e);
      }
    };

    const fetchImages = async (id) => {
      try {
        const response = await API_IMAGE.getImageByCampaignId(id);
        if (response.status === 200) {
          setImages(response.data.results);
          setIsImageLoading(false);
        }
      } catch (e) {
        console.error(e);
      }
    };

    setIsTagLoading(true);
    setIsTagLoading(false);

    fetchImages(campaignDetail.campaignId);
    fetchTags(campaignDetail.campaignId);
  }, [campaignDetail.campaignId]);

  const onEdit = (e, t) => {
    setEditingDetail((_prevState) => {
      _prevState[t] = t === 'responseRate' ? Number(e.target.value) : e.target.value;

      return {
        ..._prevState,
      };
    });
  };

  return (
    <Drawer anchor='right' open={open} sx={{ zIndex: 2 }}>
      <Box sx={{ width: 750, pt: 12, px: 3 }}>
        {isEditing ? (
          <Stack spacing={1}>
            <TextField
              required
              margin='dense'
              id='name'
              label='Company Name'
              type='text'
              fullWidth
              variant='standard'
              value={editingDetail.companyName}
              onChange={(evt) => onEdit(evt, 'companyName')}
            />
            <FormControl variant='standard' fullWidth required>
              <InputLabel id='new-campaign-location'>Location</InputLabel>
              <Select
                labelId='new-campaign-location-label-id'
                id='new-campaign-location-id'
                value={editingDetail.location}
                label='Location'
                onChange={(evt) => onEdit(evt, 'location')}
              >
                <MenuItem value={'HK'}>HK</MenuItem>
                <MenuItem value={'UK'}>UK</MenuItem>
              </Select>
            </FormControl>
            <FormControl variant='standard' fullWidth required>
              <InputLabel id='new-campaign-classification'>Classification</InputLabel>
              <Select
                labelId='new-campaign-classification-label-id'
                id='new-campaign-classification-id'
                value={editingDetail.classification}
                label='Classification'
                onChange={(evt) => onEdit(evt, 'classification')}
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
                value={editingDetail.messageType}
                label='Message Type'
                onChange={(evt) => onEdit(evt, 'messageType')}
              >
                <MenuItem value={'MGM Banner'}>MGM Banner</MenuItem>
                <MenuItem value={'Email Banner'}>Email Banner</MenuItem>
                <MenuItem value={'PWS Banner'}>PWS Banner</MenuItem>
                <MenuItem value={'FB Banner'}>FB Banner</MenuItem>
                <MenuItem value={'Campaign Landing Page'}>Campaign Landing Page</MenuItem>
                <MenuItem value={'PWS'}>PWS</MenuItem>
                <MenuItem value={'Mobile In-app'}>Mobile In-app</MenuItem>
              </Select>
            </FormControl>
            <TextField
              margin='dense'
              id='name'
              label='Response Rate'
              type='number'
              fullWidth
              variant='standard'
              onChange={(evt) => onEdit(evt, 'responseRate')}
            />
            <Stack direction='row' sx={{ py: 1 }} spacing={1}>
              <Button variant='contained' size='small'>
                Save
              </Button>
              <Button variant='contained' size='small' onClick={onCancel}>
                Cancel
              </Button>
            </Stack>
          </Stack>
        ) : (
          <Stack direction='column' justifyContent='space-between'>
            <Stack sx={{ mb: 2 }}>
              <Stack direction='row' justifyContent='space-between' alignItems='center'>
                <Typography variant='h4'>{campaignDetail.companyName}</Typography>
                <IconButton aria-label='close' color='primary' onClick={onClose}>
                  <CloseIcon />
                </IconButton>
              </Stack>

              <Grid container sx={{ py: 1 }}>
                <Grid item xs={2}>
                  <IconLabel
                    icon={<PlaceOutlinedIcon fontSize='small' />}
                    label={campaignDetail.location}
                  />
                </Grid>
                <Grid item xs={2}>
                  <IconLabel
                    icon={<AccountBalanceOutlinedIcon fontSize='small' />}
                    label={campaignDetail.classification}
                  />
                </Grid>
                <Grid item xs={2}>
                  <IconLabel
                    icon={<InfoOutlinedIcon fontSize='small' />}
                    label={campaignDetail.messageType}
                  />
                </Grid>
                <Grid item xs={6}>
                  <IconLabel
                    icon={<CalendarMonthOutlinedIcon fontSize='small' />}
                    label={`Last Updated: August 17, 2022`}
                  />
                </Grid>
              </Grid>
              <Stack
                direction='row'
                justifyContent='flex-start'
                alignItems='items-center'
              >
                {isTagLoading && (
                  <Skeleton
                    variant='rounded'
                    width='100%'
                    height={50}
                    sx={{ borderRadius: 1 }}
                  />
                )}
                {!isTagLoading &&
                  tags.map((t, i) => (
                    <Chip
                      key={i}
                      label={`#${t.tag_name.toLowerCase()}`}
                      size='small'
                      sx={{ px: 0.5, mr: 0.5 }}
                    />
                  ))}
              </Stack>
            </Stack>

            <ImageList sx={{ maxHeight: 900 }} cols={1}>
              {isImageLoading && (
                <Skeleton
                  variant='rounded'
                  width='100%'
                  height={400}
                  sx={{ borderRadius: 1 }}
                />
              )}

              {!isImageLoading &&
                images?.map((image, i) => (
                  <ImageListItem key={i}>
                    <img
                      src={`data:image/jpeg;base64,${image.img}`}
                      alt={image.image_name}
                      loading='lazy'
                    />
                  </ImageListItem>
                ))}
            </ImageList>

            <Stack direction='row'>
              <Button onClick={() => setIsEditing(true)}>Edit</Button>
              <Button>Delete</Button>
            </Stack>
          </Stack>
        )}
      </Box>
    </Drawer>
  );
}

export default CampaignDetail;
