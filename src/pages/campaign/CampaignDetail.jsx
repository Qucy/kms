import * as React from 'react';
import { useSelector } from 'react-redux';
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
  Popover,
  Autocomplete,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import CloseIcon from '@mui/icons-material/Close';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';

import { API_IMAGE, API_CAMPAIGNTAGLINK, API_CAMPAIGN } from '../../utils/api';
import { tagSliceSelector } from '../../hooks/tag/tagSlice';
import { IconLabel } from '../../components/common';

function CampaignDetail({ campaignDetail, open, onClose, fetchCampaigns }) {
  const allTagList = useSelector(tagSliceSelector.allTagList);

  const [isEditing, setIsEditing] = React.useState(false);
  const [loadingEl, setLoadingEl] = React.useState(false);

  const [images, setImages] = React.useState([]);
  const [tags, setTags] = React.useState([]);

  const [isTagLoading, setIsTagLoading] = React.useState(false);
  const [isImageLoading, setIsImageLoading] = React.useState(false);

  const [editingDetail, setEditingDetail] = React.useState(null);

  const [popoverEl, setPopoverEl] = React.useState(null);

  const toggleEditingState = () => setIsEditing((_prevState) => !_prevState);

  const onCancel = () => {
    //TODO: replace the following logic with Reference
    setEditingDetail(Object.assign({}, campaignDetail));

    toggleEditingState();
  };

  const onSave = async () => {
    setLoadingEl('EDIT');

    const payload = {
      id: editingDetail.campaignId,
      company: editingDetail.companyName,
      hsbc_vs_non_hsbc: editingDetail.classification,
      location: editingDetail.location,
      message_type: editingDetail.messageType,
      response_rate: editingDetail.responseRate ? editingDetail.responseRate : null,
      tag_names: tags.map((t) => t.tag_name).join(','),
    };

    const editCampaign = async () => {
      try {
        const response = await API_CAMPAIGN.editCampaign(
          editingDetail.campaignId,
          payload
        );

        return response.status;
      } catch (e) {
        console.error(e);
      }
    };

    const resStatus = await editCampaign();

    if (resStatus === 200) {
      setLoadingEl('');
      setTimeout(() => setIsEditing(false), 500);
      setTimeout(onClose, 1000);
      setTimeout(fetchCampaigns, 2000);
    }
  };

  const onDelete = (e) => {
    //open confirmation dialog
    setPopoverEl(e.currentTarget);
  };

  const onDeleteConfirm = async () => {
    setLoadingEl('DELETE');

    const deleteCampaign = async () => {
      try {
        const response = await API_CAMPAIGN.deleteCampaign(campaignDetail.campaignId);
        return response.status;
      } catch (e) {
        console.error(e);
      }
    };
    const resStatus = await deleteCampaign();

    if (resStatus === 204) {
      setLoadingEl('');
      setTimeout(() => setPopoverEl(null), 500);
      setTimeout(() => setIsEditing(false), 1000);
      setTimeout(onClose, 1500);
      setTimeout(fetchCampaigns, 2000);
    }
  };

  const onEditDetail = (e, t) => {
    setEditingDetail((_prevState) => {
      _prevState[t] = t === 'responseRate' ? Number(e.target.value) : e.target.value;

      return {
        ..._prevState,
      };
    });
  };

  const onEditTag = (e, t) => {
    //TODOs
    //revise options for tags and only retrive the tag_name
    setTags(t);
  };

  const onEditImage = (e) => {};

  React.useEffect(() => {
    if (campaignDetail.campaignId && !editingDetail) {
      setEditingDetail(Object.assign({}, campaignDetail));
    }
  }, [campaignDetail, editingDetail]);

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

  React.useEffect(() => console.log(tags), [tags]);

  return (
    <Drawer anchor='right' open={open} sx={{ zIndex: 2 }}>
      <Box sx={{ width: 750, pt: 12, px: 3 }}>
        {isEditing ? (
          <Stack spacing={1.25}>
            <TextField
              required
              margin='dense'
              id='name'
              label='Company Name'
              type='text'
              fullWidth
              variant='standard'
              value={editingDetail.companyName}
              onChange={(evt) => onEditDetail(evt, 'companyName')}
            />
            <FormControl variant='standard' fullWidth required>
              <InputLabel id='new-campaign-location'>Location</InputLabel>
              <Select
                labelId='new-campaign-location-label-id'
                id='new-campaign-location-id'
                value={editingDetail.location}
                label='Location'
                onChange={(evt) => onEditDetail(evt, 'location')}
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
                onChange={(evt) => onEditDetail(evt, 'classification')}
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
                onChange={(evt) => onEditDetail(evt, 'messageType')}
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
            <Autocomplete
              onChange={onEditTag}
              multiple
              id='tags-standard'
              options={allTagList
                .slice()
                .sort((a, b) => a.tag_category.localeCompare(b.tag_category))}
              groupBy={(option) => option.tag_category}
              getOptionLabel={(option) => option.tag_name}
              defaultValue={tags}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant='standard'
                  label='Update hash tag'
                  placeholder='Hash tag'
                />
              )}
            />
            <Stack direction='row' sx={{ py: 1 }} spacing={1}>
              <LoadingButton
                loading={loadingEl === 'EDIT'}
                variant='contained'
                size='small'
                onClick={onSave}
              >
                Save
              </LoadingButton>
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
              <Button onClick={onDelete}>Delete</Button>
            </Stack>
            <Popover
              open={Boolean(popoverEl)}
              anchorEl={popoverEl}
              onClose={() => setPopoverEl(null)}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
            >
              <Stack sx={{ p: 2 }} direction='row' alignItems='center'>
                <Typography variant='body1' sx={{ mr: 2 }}>
                  Deletion of tag cannot be redo. Click "Confirm" to proceed.
                </Typography>
                <Stack direction='row' spacing={1} size='small'>
                  <LoadingButton
                    loading={loadingEl === 'DELETE'}
                    variant='contained'
                    size='small'
                    onClick={onDeleteConfirm}
                  >
                    Confirm
                  </LoadingButton>
                  <Button
                    variant='contained'
                    size='small'
                    onClick={() => setPopoverEl(null)}
                  >
                    Cancel
                  </Button>
                </Stack>
              </Stack>
            </Popover>
          </Stack>
        )}
      </Box>
    </Drawer>
  );
}

export default CampaignDetail;
