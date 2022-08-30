import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Typography,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Pagination,
  Button,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  setCampaignList,
  setCampaignDetail,
  setStatus,
  campaignManageSliceSelector,
} from '../../hooks/campmanage/campmanageSlice';
import PlaylistAddCheckOutlinedIcon from '@mui/icons-material/PlaylistAddCheckOutlined';
import PlaylistRemoveOutlinedIcon from '@mui/icons-material/PlaylistRemoveOutlined';
import { API_CAMPAIGN } from '../../utils/api';
import { asyncFuncHandlerWithParameter } from '../../utils/handler';
import Title from '../main/title';

export default function CampaignManage() {

  const campaignList = useSelector(campaignManageSliceSelector.campaignList);
  const status = useSelector(campaignManageSliceSelector.status);
  const dispatch = useDispatch();

  const [pageNumber, setPageNumber] = React.useState(1);
  const pageCount = React.useRef(0);

  // function to fetch paginated campaigns
  const fetchPaginatedCampaigns = async (pageNumber) => {
    // set status to loading when loading data
    dispatch(setStatus('LOADING'));
    // call api
    const [response, error] = await asyncFuncHandlerWithParameter(API_CAMPAIGN.getPaginatedCampaigns, pageNumber);
    // response successful
    if (response && response.statusText === 'OK') {
      // update campaign list and status
      dispatch(setCampaignList(response.data.results));
      dispatch(setStatus('SUCCESS'));
      pageCount.current = Number(response.data.count);
    }
    // response error
    if (error) {
      dispatch(setStatus('ERROR'));
      console.error(error);
    }
  };

  // function to approve campaign
  const onApprove = async (e, camp) => {
    // create payload
    const payload = {
      id: camp.id,
      status: 'APPROVED',
    };
    // call api
    try {
      const response = await API_CAMPAIGN.updateCampaignStatus(payload)
      if (response.status === 200) {
        // refresh data
        fetchPaginatedCampaigns();
      }
    } catch (e) {
      console.error("Error when call update campaign status API")
      console.error(e);
    }
  }

  // function to reject campaign
  const onReject = async (e, camp) => {
    // create payload
    const payload = {
      id: camp.id,
      status: 'NEW',
    };
    // call api
    try {
      const response = await API_CAMPAIGN.updateCampaignStatus(payload)
      if (response.status === 200) {
        // refresh data
        fetchPaginatedCampaigns();
      }
    } catch (e) {
      console.error("Error when call update campaign status API")
      console.error(e);
    }
  }

  // pagination function for campaign manage
  const onPaginate = async (e, v) => {
    setPageNumber(v ? v : 1);
    fetchPaginatedCampaigns(v ? v : 1)
  }

  // loading campaign list when page is loaded
  React.useEffect(() => {
    fetchPaginatedCampaigns();
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
      <Title>Campaign Manage</Title>
      <Table size='small' sx={{ maxHeight: 300 }}>
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography variant='subtitle1'>Company Name</Typography>
            </TableCell>
            <TableCell>
              <Typography variant='subtitle1'>Location</Typography>
            </TableCell>
            <TableCell>
              <Typography variant='subtitle1'>Message Type</Typography>
            </TableCell>
            <TableCell>
              <Typography variant='subtitle1'>HSBC_VS_NON_HSBC</Typography>
            </TableCell>
            <TableCell>
              <Typography variant='subtitle1'>Campaign Thumbnail</Typography>
            </TableCell>
            <TableCell>
              <Typography variant='subtitle1'>Created By</Typography>
            </TableCell>
            <TableCell>
              <Typography variant='subtitle1'>Creation Time</Typography>
            </TableCell>
            <TableCell>
              <Typography variant='subtitle1'>Status</Typography>
            </TableCell>
            <TableCell>
              <Typography variant='subtitle1'>Operation</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {campaignList.map((camp, index) => (
            <TableRow key={index}>
              <TableCell>{camp.company}</TableCell>
              <TableCell>{camp.location}</TableCell>
              <TableCell>{camp.message_type}</TableCell>
              <TableCell>{camp.hsbc_vs_non_hsbc}</TableCell>
              <TableCell><img src={`data:image/jpeg;base64,${camp.img}`} width={100} height={100}></img></TableCell>
              <TableCell>{camp.create_by}</TableCell>
              <TableCell>{camp.creation_datetime}</TableCell>
              <TableCell>{camp.status}</TableCell>
              <TableCell>
                {camp.status == 'PENDING' ?
                  <div>
                    <Tooltip title='APPROVE'>
                      <IconButton onClick={(e) => onApprove(e, camp)}>
                        <PlaylistAddCheckOutlinedIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title='REJECT'>
                      <IconButton onClick={(e) => onReject(e, camp)}>
                        <PlaylistRemoveOutlinedIcon />
                      </IconButton>
                    </Tooltip>
                  </div>
                  :
                  <div>----</div>
                }
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div style={{ padding: '0.5rem 0rem' }} />
      <Stack direction='row' spacing={2}>
        <Pagination
          onChange={onPaginate}
          count={Math.ceil(pageCount.current / 13)}
          page={pageNumber}
          showFirstButton
          showLastButton
        />
      </Stack>
    </React.Fragment>
  );
}
