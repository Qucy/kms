import * as React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActionArea,
  Stack,
  Drawer,
  Box,
  IconButton,
  Chip,
  CircularProgress,
} from '@mui/material';
import Grid from '@mui/material/Grid';

import { API_CAMPAIGN } from '../../utils/api';
import Title from '../main/title';
import { IconLabel, CampaignCard } from '../../components/common/index';
import CampaignDrawer from './CampaignDrawer';

const dummyData = [
  {
    company: 'ZA Bank',
    classification: 'Non-HSBC',
    location: 'Hong Kong',
    messageType: 'MGM Banner',
    tag: ['account', 'acquisition', 'english', 'ZABank', 'MGM', 'Email'],
    image:
      'https://images.unsplash.com/photo-1542773998-9325f0a098d7?crop=entropy&auto=format&fit=crop&w=3271',
  },
  {
    company: 'Revolut',
    classification: 'Non-HSBC',
    location: 'Hong Kong',
    messageType: 'Email Banner',
    tag: ['account', 'Email', 'english', 'Relationship', 'Revolut', 'feature'],
    image:
      'https://images.unsplash.com/photo-1542773998-9325f0a098d7?crop=entropy&auto=format&fit=crop&w=3271',
  },
  {
    company: 'Stashway',
    classification: 'Non-HSBC',
    location: 'Hong Kong',
    messageType: 'PWS Banner',
    tag: ['investment', 'PWS', 'english', 'Stashway', 'activation'],
    image:
      'https://images.unsplash.com/photo-1542773998-9325f0a098d7?crop=entropy&auto=format&fit=crop&w=3271',
  },
  {
    company: 'Citi Bank',
    classification: 'Non-HSBC',
    location: 'Hong Kong',
    messageType: 'FB Banner',
    tag: ['chinese', 'investment', 'activation', 'citibank', 'facebook'],
    image:
      'https://images.unsplash.com/photo-1542773998-9325f0a098d7?crop=entropy&auto=format&fit=crop&w=3271',
  },
  {
    company: 'MoneyHero',
    classification: 'Non-HSBC',
    location: 'Hong Kong',
    messageType: 'FB Banner',
    tag: ['chinese', 'moneyhero', 'facebook', 'activation', 'investment'],
    image:
      'https://images.unsplash.com/photo-1542773998-9325f0a098d7?crop=entropy&auto=format&fit=crop&w=3271',
  },
  {
    company: 'MoneyHero',
    classification: 'Non-HSBC',
    location: 'Hong Kong',
    messageType: 'FB Banner',
    tag: ['chinese', 'moneyhero', 'facebook', 'activation', 'investment'],
    image:
      'https://images.unsplash.com/photo-1542773998-9325f0a098d7?crop=entropy&auto=format&fit=crop&w=3271',
  },
  {
    company: 'MoneyHero',
    classification: 'Non-HSBC',
    location: 'Hong Kong',
    messageType: 'FB Banner',
    tag: ['chinese', 'moneyhero', 'facebook', 'activation', 'investment'],
    image:
      'https://images.unsplash.com/photo-1542773998-9325f0a098d7?crop=entropy&auto=format&fit=crop&w=3271',
  },
  {
    company: 'MoneyHero',
    classification: 'Non-HSBC',
    location: 'Hong Kong',
    messageType: 'FB Banner',
    tag: ['chinese', 'moneyhero', 'facebook', 'activation', 'investment'],
    image:
      'https://images.unsplash.com/photo-1542773998-9325f0a098d7?crop=entropy&auto=format&fit=crop&w=3271',
  },
  {
    company: 'MoneyHero',
    classification: 'Non-HSBC',
    location: 'Hong Kong',
    messageType: 'FB Banner',
    tag: ['chinese', 'moneyhero', 'facebook', 'activation', 'investment'],
    image:
      'https://images.unsplash.com/photo-1542773998-9325f0a098d7?crop=entropy&auto=format&fit=crop&w=3271',
  },
];

export default function Campaign() {
  const [campaigns, setCampaigns] = React.useState([]);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = React.useState(false);
  const [campaignDetail, setCampaignDetail] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(true);

  const toggleDrawerOpen = () => setIsDetailDrawerOpen((_prevState) => !_prevState);
  const updateCampaignDetail = (d) => setCampaignDetail(d);

  const onSelect = (e, d) => {
    toggleDrawerOpen();
    updateCampaignDetail(d);
  };

  const onDrawerClose = React.useCallback(() => {
    toggleDrawerOpen();
    updateCampaignDetail({});
  }, []);

  React.useEffect(() => console.log(campaignDetail), [campaignDetail]);

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

  React.useEffect(() => console.log(campaigns), [campaigns]);

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <React.Fragment>
      <Stack spacing={3} direction='row' justifyContent='space-between'>
        <Title>Campaign</Title>
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
                    // image={`../../../kms_backend/${d.campaign_thumbnail_url}`}
                    src={`data:image/jpeg;base64,${d.img}`}
                    alt='green iguana'
                  />
                  <Box
                    sx={{ width: '100%', height: '100%', backgroundColor: 'black' }}
                  ></Box>
                  <Typography
                    variant='h6'
                    component='div'
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      p: 1,
                    }}
                  >
                    {d.company}
                  </Typography>
                  <Typography
                    variant='overline'
                    color='text.secondary'
                    component='div'
                    sx={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      p: 1,
                    }}
                  >
                    {d.message_type}
                  </Typography>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
          {/* {dummyData.map((d, i) => (
            <Grid item xs={1} md={2} lg={2} key={i}>
              <CampaignCard />
            </Grid>
          ))} */}
        </Grid>
      </Stack>
      <CampaignDrawer
        open={isDetailDrawerOpen}
        campaignDetail={campaignDetail}
        onClose={onDrawerClose}
      />
    </React.Fragment>
  );
}
