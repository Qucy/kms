import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setTagList, tagSliceSelector } from '../../hooks/tag/tagSlice';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Pagination,
  Button,
  Stack,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
} from '@mui/material';

import Title from '../main/title';
import TagDialog from './tagDialog';
import { API_TAG } from '../../utils/api';
import useTag from '../../hooks/tag/useTag';

export default function Tags() {
  const tagList = useSelector(tagSliceSelector.tagList);
  const tagObject = useSelector(tagSliceSelector.tagObject);
  const tableStatus = useSelector(tagSliceSelector.tableStatus);
  const buttonStatus = useSelector(tagSliceSelector.buttonStatus);

  const dispatch = useDispatch();

  const {
    isTagDialogOpen,
    isDeleteDialogOpen,
    pageCount,
    setPageCount,
    pageNumber,
    onPaginate,
    onNewTag,
    onEditTag,
    onDeleteTag,
    onTagDialogClose,
    onDeleteDialogClose,
    onSaveDelete,
    refetchTagList,
  } = useTag();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API_TAG.fetchTags();

        if (response.status === 200) {
          dispatch(setTagList(response.data.results));
          setPageCount(response.data.count);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  React.useEffect(() => {
    refetchTagList(pageNumber);
  }, [pageNumber]);

  if (tableStatus === 'LOADING') {
    return (
      <React.Fragment>
        <CircularProgress />
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <Title>Tags</Title>
      <Table size='small' sx={{ maxHeight: 300 }}>
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography variant='subtitle1'>Tag</Typography>
            </TableCell>
            <TableCell>
              <Typography variant='subtitle1'>Category</Typography>
            </TableCell>
            <TableCell>
              <Typography variant='subtitle1' align='right'>
                Linked Images
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant='subtitle1'>Created By</Typography>
            </TableCell>
            <TableCell>
              <Typography variant='subtitle1'>Operation</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tagList.map((tag, index) => (
            <TableRow key={index}>
              <TableCell>#{tag.tag_name}</TableCell>
              <TableCell>{tag.tag_category}</TableCell>
              <TableCell align='right'>{tag.linkedImages}</TableCell>
              <TableCell>{tag.create_by}</TableCell>
              <TableCell>
                <Tooltip title='Delete'>
                  <IconButton onClick={(e) => onDeleteTag(e, tag)}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title='Edit'>
                  <IconButton onClick={(e) => onEditTag(e, tag)}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <Dialog
          open={isDeleteDialogOpen}
          onClose={onDeleteDialogClose}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogTitle id='alert-dialog-title'>{'Confirm Deletion of Tag'}</DialogTitle>
          <DialogContent>
            <DialogContentText id='alert-dialog-description'>
              Deletion of tag cannot be redo. Click "Confirm" to proceed.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={onDeleteDialogClose}>Close</Button>
            <LoadingButton
              loading={buttonStatus === 'LOADING'}
              onClick={(e) => onSaveDelete(e, tagObject)}
            >
              {buttonStatus === 'SUCCESS' ? 'Success!' : 'Save'}
            </LoadingButton>
          </DialogActions>
        </Dialog>
      </Table>
      <div style={{ padding: '0.5rem 0rem' }} />
      <Stack direction='row' spacing={2}>
        <Button variant='contained' onClick={onNewTag}>
          NEW
        </Button>
        <Pagination
          onChange={onPaginate}
          count={Math.ceil(pageCount / 10)}
          page={pageNumber}
          showFirstButton
          showLastButton
        />
        <TagDialog
          onTagDialogClose={onTagDialogClose}
          isTagDialogOpen={isTagDialogOpen}
          pageNumber={pageNumber}
        />
      </Stack>
    </React.Fragment>
  );
}
