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
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';

import { IconLabel } from '../../components/common';
import { OpenInBrowserOutlined } from '@mui/icons-material';
import { API_IMAGE, API_CAMPAIGNTAGLINK } from '../../utils/api';

export default function CampaignDetail({ campaignDetail, open, onClose }) {
  const { campaignId, company, classification, location, messageType, responseRate } =
    campaignDetail;

  const [isTagLoading, setIsTagLoading] = React.useState(true);
  const [isImageLoading, setIsImageLoading] = React.useState(true);

  const [images, setImages] = React.useState([]);
  const [tags, setTags] = React.useState([]);

  React.useEffect(() => {
    const fetchTag = async (id) => {
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

    fetchImages(campaignId);
    fetchTag(campaignId);
  }, [campaignId]);

  return (
    <Drawer anchor='right' open={open} sx={{ zIndex: 2 }}>
      <Box sx={{ width: 750, py: 12, px: 3 }}>
        <Stack direction='row' justifyContent='space-between' alignItems='items-center'>
          <Typography variant='h4'>{campaignDetail.company}</Typography>
          <IconButton aria-label='close' color='primary' onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
        <Grid container sx={{ pb: 1 }}>
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
          sx={{ pb: 1 }}
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

        <Stack direction='column' spacing={2} sx={{ py: 2 }}>
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
              <img
                src={`data:image/jpeg;base64,${image.img}`}
                alt={image.image_name}
                loading='lazy'
                key={i}
              />
            ))}
        </Stack>
      </Box>
    </Drawer>
  );
}
