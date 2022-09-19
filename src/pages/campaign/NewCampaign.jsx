import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Stack,
  Typography,
  Dialog,
  Button,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { PhotoCamera } from '@mui/icons-material';

import { tagSliceSelector } from '../../hooks/tag/tagSlice';

import { API_CAMPAIGN, API_CAMPAIGNTAGLINK, API_IMAGE, API_TAG } from '../../utils/api';
import { asyncFuncHandlerWithParameter } from '../../utils/handler';

export default function NewCampaign({
  open,
  onClose,
  onCancel,
  setIsLoading,
  fetchCampaigns,
}) {
  const allTagList = useSelector(tagSliceSelector.allTagList);

  const [uploadedImages, setUploadedImages] = React.useState();
  const [imagePreview, setImagePreview] = React.useState();
  const [newCampaign, setNewCampaign] = React.useState({
    companyName: '',
    location: '',
    classification: '',
    messageType: '',
    responseRate: 0,
  });
  const [selectedTags, setSelectedTags] = React.useState([]);

  const [isSaveButtonLoading, setIsSaveButtonLoading] = React.useState(false);

  const onSelectTags = (evt, newValue) => {
    if (typeof newValue[newValue.length - 1] === 'string') {
      newValue[newValue.length - 1] = {
        tag_name: evt.target.value,
        tag_category: 'default',
      };
    }
    setSelectedTags(newValue);
  };

  const onImagesUpload = (e) => {
    const { files } = e.target;

    if (!files || files.length === 0) {
      setUploadedImages(undefined);
      return;
    } else {
      setUploadedImages(files);
    }
  };

  const onNewCampaignChange = (e, t) => {
    setNewCampaign((_prevState) => {
      _prevState[t] = t === 'responseRate' ? Number(e.target.value) : e.target.value;

      return {
        ..._prevState,
      };
    });
  };

  const checkEmptyProperty = React.useMemo(() => {
    //check uploaded
    const isLackImages = uploadedImages ? false : true;

    //check required campaign information
    const { responseRate, ...requiredInfo } = newCampaign;
    const isLackCampaignInfo = !Object.values(requiredInfo).every((v) => v);

    return isLackImages || isLackCampaignInfo;
  }, [uploadedImages, newCampaign]);

  const onSaveNewCampaign = async () => {
    const createTags = async () => {
      let newTags = selectedTags.slice().filter((t) => !t.id);
      const response = Promise.all(
        newTags.map((tag) => {
          const tagObject = {
            create_by: 45072289,
            creation_datetime: new Date(),
            ...tag,
          };
          return asyncFuncHandlerWithParameter(API_TAG.createTag, tagObject);
        })
      );
      return response;
    };

    const createCampaign = async () => {
      const payload = {
        company: newCampaign.companyName,
        hsbc_vs_non_hsbc: newCampaign.classification,
        location: newCampaign.location,
        response_rate: newCampaign.responseRate,
        message_type: newCampaign.messageType,
        file: uploadedImages[0],
        create_by: 'Jason',
      };

      try {
        const response = await API_CAMPAIGN.createCampaign(payload);

        if (response.status === 200) {
          return response.data.campaign_id;
        }
      } catch (e) {
        console.error(e);
      }
    };

    const createImages = async (campaignId) => {
      let numOfSuccess = 0;

      for (let i = 0; i < uploadedImages.length; i++) {
        const { name } = uploadedImages[i];

        const imageObj = {
          file: uploadedImages[i],
          image_name: name.split('.')[0],
          campaign_id: campaignId,
          create_by: 'Jason',
        };

        try {
          const response = await API_IMAGE.createImage(imageObj);

          if (response.status === 200) {
            numOfSuccess++;
          }
        } catch (e) {
          console.error(e);
        }
      }

      return uploadedImages.length === numOfSuccess;
    };

    const createCampaignTagLink = async (campaignId) => {
      const payload = {
        campaign_id: campaignId,
        tag_names: selectedTags.map((t) => t.tag_name).join(','),
        creation_datetime: new Date(),
      };

      try {
        const response = await API_CAMPAIGNTAGLINK.createCampaignTagLink(payload);

        if (response.status === 200) {
          return response.status;
        }
      } catch (e) {
        console.error(e);
      }
    };

    setIsSaveButtonLoading(true);

    const createTagsRes = await createTags();
    const campaignId = await createCampaign();
    const isCreateImagesSuccess = await createImages(campaignId);
    const isCreateCampaignTagLinkSuccess = await createCampaignTagLink(campaignId);

    if (isCreateImagesSuccess && isCreateCampaignTagLinkSuccess && createTagsRes) {
      setIsSaveButtonLoading(false);
      setTimeout(() => onCancel(), 500);
      setTimeout(() => {
        setIsLoading(true);
        fetchCampaigns();
      }, 1000);
    }
  };

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

  React.useEffect(() => console.log(selectedTags), [selectedTags]);

  return (
    <Dialog open={open} onClose={onClose}>
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
              <MenuItem value={'HK'}>Hong Kong</MenuItem>
              <MenuItem value={'UK'}>United Kingdom</MenuItem>
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
              <MenuItem value={'MGM Banner'}>MGM Banner</MenuItem>
              <MenuItem value={'Email Banner'}>Email Banner</MenuItem>
              <MenuItem value={'PWS Banner'}>PWS Banner</MenuItem>
              <MenuItem value={'FB Banner'}>FB Banner</MenuItem>
              <MenuItem value={'Campaign Landing Page'}>Campaign Landing Page</MenuItem>
              <MenuItem value={'PWS'}>PWS</MenuItem>
              <MenuItem value={'Mobile In-App'}>Mobile In-App</MenuItem>
            </Select>
          </FormControl>
          <TextField
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
            value={selectedTags}
            multiple
            id='tags-standard'
            options={allTagList
              .slice()
              .sort((a, b) => a.tag_category.localeCompare(b.tag_category))}
            onChange={onSelectTags}
            groupBy={(option) => option.tag_category}
            getOptionLabel={(option) => option.tag_name}
            freeSolo
            renderInput={(params) => (
              <TextField {...params} variant='standard' label='Tags' placeholder='Tags' />
            )}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <LoadingButton
          loading={isSaveButtonLoading}
          onClick={onSaveNewCampaign}
          disabled={checkEmptyProperty}
        >
          Save
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
