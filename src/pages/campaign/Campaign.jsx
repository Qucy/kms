import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  setCampaignList,
  setCampaignDetail,
  campaignSliceSelector,
} from '../../hooks/campaign/campaignSlice';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActionArea,
  Stack,
  CircularProgress,
  Button,
} from '@mui/material';

import Grid from '@mui/material/Grid';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

import { API_CAMPAIGN } from '../../utils/api';
import CampaignDetail from './CampaignDetail';
import NewCampaign from './NewCampaign';

export default function Campaign() {
  const campaignDetail = useSelector(campaignSliceSelector.campaignDetail);
  const dispatch = useDispatch();

  console.log(campaignDetail);

  const [campaigns, setCampaigns] = React.useState([]);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = React.useState(false);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const [isLoading, setIsLoading] = React.useState(true);

  const toggleDrawerOpen = () => setIsDetailDrawerOpen((_prevState) => !_prevState);

  const updateCampaignDetail = (d) => dispatch(setCampaignDetail(d));

  const toggleDialogOpen = () => setIsDialogOpen((_prevState) => !_prevState);

  const fetchCampaigns = async () => {
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
