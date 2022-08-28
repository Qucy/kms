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
  Button
} from '@mui/material';

import {
  setCampaignList,
  setCampaignDetail,
  setMessageFilter,
  setClassificationFilter,
  setCompanyFilter,
  setStatus,
  campaignSliceSelector,
} from '../../hooks/campaign/campaignSlice';
import { tagSliceSelector } from '../../hooks/tag/tagSlice';

import Title from '../main/title';

export default function CampaignManage() {

  const allTagList = useSelector(tagSliceSelector.allTagList);
  const campaignDetail = useSelector(campaignSliceSelector.campaignDetail);
  const campaignList = useSelector(campaignSliceSelector.campaignList);

  function onApprove() {

  }

  function onPaginate() {

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
              <Typography variant='subtitle1'>Created By</Typography>
            </TableCell>
            <TableCell>
              <Typography variant='subtitle1'>Creation Time</Typography>
            </TableCell>
            <TableCell>
              <Typography variant='subtitle1'>Operation</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        { /*<TableBody>
          {tagList.map((tag, index) => (
            <TableRow key={index}>
              <TableCell>#{tag.tag_name}</TableCell>
              <TableCell>{tag.tag_category}</TableCell>
              <TableCell>{tag.create_by}</TableCell>
              <TableCell>
                <Tooltip title='Edit'>
                  <IconButton onClick={(e) => onEditTag(e, tag)}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title='Delete'>
                  <IconButton onClick={(e) => onDeleteTag(e, tag)}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
          </TableBody> */ }
      </Table>
      <div style={{ padding: '0.5rem 0rem' }} />
      <Stack direction='row' spacing={2}>
        <Button variant='contained' onClick={onApprove}>
          APPROVE
        </Button>
        <Pagination
          onChange={onPaginate}
          count={1}
          page={1}
          showFirstButton
          showLastButton
        />
      </Stack>
    </React.Fragment>
  );
}
