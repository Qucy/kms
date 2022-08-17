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
  styled,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import CloseIcon from '@mui/icons-material/Close';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';

import Title from '../main/title';
import { IconLabel, CampaignCard } from '../../components/common/index';

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
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = React.useState(false);
  const [campaignDetail, setCampaignDetail] = React.useState({});

  const toggleDrawerOpen = () => setIsDetailDrawerOpen((_prevState) => !_prevState);
  const updateCampaignDetail = (d) => setCampaignDetail(d);

  const onSelect = (e, d) => {
    toggleDrawerOpen();
    updateCampaignDetail(d);
  };

  const onDrawerClose = () => {
    toggleDrawerOpen();
    updateCampaignDetail({});
  };

  React.useEffect(() => console.log(campaignDetail), [campaignDetail]);

  return (
    <React.Fragment>
      <Stack spacing={3} direction='row' justifyContent='space-between'>
        <Title>Campaign</Title>
      </Stack>

      <Stack>
        <Grid container spacing={2} columns={{ sm: 4, md: 8, lg: 10 }}>
          {dummyData.map((d, i) => (
            <Grid item xs={1} md={2} lg={2} key={i}>
              <Card key={i}>
                <CardActionArea
                  onClick={(evt) =>
                    onSelect(evt, {
                      company: d.company,
                      classification: d.classification,
                      location: d.location,
                      messageType: d.messageType,
                      tag: d.tag,
                    })
                  }
                >
                  <CardMedia component='img' src={d.image} alt='green iguana' />
                  <CardContent>
                    <Typography gutterBottom variant='h6' component='div'>
                      {d.company}
                    </Typography>
                    <Typography variant='overline' color='text.secondary'>
                      {d.messageType}
                    </Typography>
                  </CardContent>
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
      <Drawer anchor='right' open={isDetailDrawerOpen} sx={{ zIndex: 2 }}>
        <Box sx={{ width: 700, py: 12, px: 3 }}>
          <Stack direction='row' justifyContent='space-between' alignItems='items-center'>
            <Typography variant='h4'>{campaignDetail.company}</Typography>
            <IconButton aria-label='close' color='primary' onClick={onDrawerClose}>
              <CloseIcon />
            </IconButton>
          </Stack>
          <Grid container sx={{ py: 0.5 }}>
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
            <Grid item xs={2.25}>
              <IconLabel
                icon={<InfoOutlinedIcon fontSize='small' />}
                label={campaignDetail.messageType}
              />
            </Grid>
            <Grid item xs={5.75}>
              <IconLabel
                icon={<CalendarMonthOutlinedIcon fontSize='small' />}
                label={`Last Updated: August 17, 2022`}
              />
            </Grid>
          </Grid>
          <Stack direction='row' justifyContent='flex-start' alignItems='items-center'>
            {campaignDetail?.tag?.map((t, i) => (
              <Chip
                label={`#${t.toLowerCase()}`}
                size='small'
                sx={{ px: 0.5, mr: 0.5 }}
              />
            ))}
          </Stack>
        </Box>
      </Drawer>
    </React.Fragment>
  );
}
