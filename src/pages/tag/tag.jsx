import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setAllTagList, setTagList, tagSliceSelector } from '../../hooks/tag/tagSlice';
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

  const pageCount = React.useRef(0);

  React.useEffect(() => {
    //TODO
    //rewrite fetching mechanism with RTK Query

    const fetchPaginatedTags = async () => {
      try {
        const response = await API_TAG.getPaginatedTags();

        if (response.status === 200) {
          dispatch(setTagList(response.data.results));
          pageCount.current = Number(response.data.count);
        }
      } catch (error) {
        console.error(error);
      }
    };

    const fetchAllTags = async () => {
      try {
        const response = await API_TAG.getAllTags();

        if (response.status === 200) {
          dispatch(setAllTagList(response.data));
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchPaginatedTags();
    fetchAllTags();
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
              {buttonStatus === 'SUCCESS' ? 'Success!' : 'Confirm'}
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
          count={Math.ceil(pageCount.current / 13)}
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
