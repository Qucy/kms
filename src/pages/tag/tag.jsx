import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  setTagList,
  setTagObject,
  updateTagObjName,
  updateTagObjCategory,
} from '../../hooks/tag/tagDataSlice';
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

export default function Tags() {
  const tagList = useSelector((state) => state.tagData.tagList);
  const tagObject = useSelector((state) => state.tagData.tagObject);
  const dispatch = useDispatch();

  // add state to control dialog status
  const [isTagDialogOpen, setIsTagDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  // TODOs
  // Prefetch the pageCount
  const [pageCount, setPageCount] = React.useState(1);
  const [pageNumber, setPageNumber] = React.useState(1);

  const [buttonStatus, setButtonStatus] = React.useState('');
  const [tableStatus, setTableStatus] = React.useState('LOADING');

  React.useState(() => {
    const fetchData = async () => {
      try {
        const response = await API_TAG.fetchTags();

        if (response.status === 200) {
          dispatch(setTagList(response.data.results));
          setPageCount(response.data.count);
        }

        //other status code handling
        //error handling
      } catch (error) {
        console.error(error);
        //error handling
      }
    };

    fetchData();
  }, []);

  React.useEffect(() => {
    setTableStatus('LOADING');

    const fetchTags = async (pageNumber) => {
      try {
        const response = await API_TAG.fetchTags(pageNumber);
        if (response.status === 200) {
          dispatch(setTagList(response.data.results));
          setTableStatus('SUCCESS');
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchTags(pageNumber);
  }, [pageNumber]);

  React.useEffect(() => console.log(tagObject), [tagObject]);

  const onPaginate = (e, v) => setPageNumber(v ? v : 1);

  //TODOs
  //Clear all the handler function with dispatch
  const onNewTag = () => {
    dispatch(
      setTagObject({
        tag_name: '',
        tag_category: '',
        //refactor to staff if after authorisation implemented
        create_by: '34973152',
        creation_datetime: '',
      })
    );
    setIsTagDialogOpen(true);
  };

  const onEditTag = (e, t) => {
    dispatch(setTagObject(t));
    setIsTagDialogOpen(true);
  };

  const onDeleteTag = (e, t) => {
    setIsDeleteDialogOpen(true);
    dispatch(setTagObject(t));
  };

  const onTagDialogClose = () => {
    dispatch(setTagObject({}));
    setIsTagDialogOpen(false);
  };

  const onDeleteDialogClose = () => {
    dispatch(setTagObject({}));
    setIsDeleteDialogOpen(false);
  };

  const onSaveDelete = (e, t) => {
    setButtonStatus('LOADING');

    const deleteTag = async (id, callback) => {
      try {
        const response = await API_TAG.deleteTag(id);

        if (response.status === 200) {
          setButtonStatus('SUCCESS');
          setTimeout(onDeleteDialogClose, 1000);
          callback && setTimeout(callback, 1000);
        }

        //other status code handling
        //error handling
      } catch (error) {
        console.error(error);
      }
    };

    deleteTag(t.id, refetchTagList);
  };

  const refetchTagList = React.useCallback(async () => {
    setTableStatus('LOADING');
    const resTagList = await API_TAG.fetchTags(pageNumber);

    if (resTagList.status === 200) {
      dispatch(setTagList(resTagList.data.results));
      setTableStatus('SUCCESS');
    }
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
          refetchTagList={refetchTagList}
        />
      </Stack>
    </React.Fragment>
  );
}
