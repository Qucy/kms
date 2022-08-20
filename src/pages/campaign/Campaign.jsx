import * as React from 'react';
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
  FormControl
} from '@mui/material';

import Grid from '@mui/material/Grid';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

import { API_CAMPAIGN } from '../../utils/api';
import CampaignDetail from './CampaignDetail';
import NewCampaign from './NewCampaign';

export default function Campaign() {
  const [campaigns, setCampaigns] = React.useState([]);
  const [campaignDetail, setCampaignDetail] = React.useState({});

  const dropDownOption = React.useRef(0)
  const [messageType, setMessageType] = React.useState("All Message Type");
  const [hsbcvsNonHSBC, sethsbcvsNonHSBC] = React.useState("All Campaign")

  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = React.useState(false);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const [isLoading, setIsLoading] = React.useState(true);

  const toggleDrawerOpen = () => setIsDetailDrawerOpen((_prevState) => !_prevState);
  const updateCampaignDetail = (d) => setCampaignDetail(d);

  const toggleDialogOpen = () => setIsDialogOpen((_prevState) => !_prevState);

  const fetchCampaigns = async () => {
    try {
      const response = await API_CAMPAIGN.getAllCampaigns();

      if (response.status === 200) {
        setCampaigns(response.data);
        dropDownOption.messageType = [... new Set(response.data.map(a => a.message_type))]
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

  const handleMessageTypeChange = async (event) => {
    try {
      // Display the loading page
      setIsLoading(true);

      // Extract the value selcted by the user
      var messageType = event.target.value

      // Display the selected value
      setMessageType(messageType)

      // Special handling for default value
      if (messageType === "All Message Type") {
        var messageType = ""
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
      var hsbcvsNonHSBC = event.target.value

      // Display the selected value
      sethsbcvsNonHSBC(hsbcvsNonHSBC)

      // Special handling for default value
      if (hsbcvsNonHSBC === "All Campaign") {
        var hsbcvsNonHSBC = ""
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

        <FormControl size='20px'>
          <InputLabel id="message_type_label">Message Type</InputLabel>
          <Select
            labelId="message_type_label"
            id="demo-simple-select"
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
        
        <FormControl size='20px'>
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
