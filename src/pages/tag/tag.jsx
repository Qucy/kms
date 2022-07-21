import * as React from 'react';
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

import { LoadingButton } from '@mui/lab';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';

import Title from '../main/title';
import TagDialog from './tagDialog';
import { API_TAG } from '../../utils/api';

export default function Tags() {
  //TODOs
  //Clean up state with useReducer

  // add state to control dialog status
  const [openDialog, setOpenDialog] = React.useState(false);
  // add tag list to status
  const [tagList, setTagList] = React.useState([]);

  // TODOs
  // Prefetch the pageCount
  const [pageCount, setPageCount] = React.useState(1);
  const [pageNumber, setPageNumber] = React.useState(1);
  // add tag to status (for update)
  const [tagObject, setTagObject] = React.useState({});

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  const [status, setStatus] = React.useState('');
  const [tagListStatus, setTagListStatus] = React.useState('LOADING');

  React.useState(() => {
    const fetchData = async () => {
      try {
        const response = await API_TAG.fetchTags();

        if (response.status === 200) {
          setTagList(response.data.results);
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

  const onDeleteTag = (e, t) => {
    setIsDeleteDialogOpen(true);
    setTagObject(t);
  };

  const onSaveDelete = (e, t) => {
    setStatus('LOADING');

    const deleteTag = async (id) => {
      try {
        const response = await API_TAG.deleteTag(id);

        if (response.status === 200) {
          setStatus('SUCCESS');
          setTimeout(onDeleteDialogClose, 1000);
          setTimeout(() => setPageNumber(1), 2000);
        }

        //other status code handling
        //error handling
      } catch (error) {
        console.error(error);
      }
    };

    deleteTag(t.id);
  };

  const onDeleteDialogClose = () => {
    setTagObject({});
    setIsDeleteDialogOpen(false);
  };

  const onEditTag = (e, t) => {
    setTagObject(t);
    setOpenDialog(true);
  };

  React.useEffect(() => console.log(tagObject), [tagObject]);

  const onPaginate = (e, v) => setPageNumber(v ? v : 1);

  React.useEffect(() => {
    console.log(pageNumber);
    setTagListStatus('LOADING');

    const fetchTags = async (pageNumber) => {
      try {
        const response = await API_TAG.fetchTags(pageNumber);
        if (response.status === 200) {
          setTagList(response.data.results);
          setTagListStatus('SUCCESS');
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchTags(pageNumber);
  }, [pageNumber]);

  // open dialog
  const newTag = () => {
    setTagObject('');
    setOpenDialog(true);
  };
  // close dialog
  const handleCloseDialog = () => {
    setTagObject({});
    setOpenDialog(false);
  };

  if (tagListStatus === 'LOADING') {
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
            {/* <Button onClick={(e) => onSaveDelete(e, tagObject)}>Confirm</Button> */}
            <LoadingButton
              loading={status === 'LOADING'}
              onClick={(e) => onSaveDelete(e, tagObject)}
            >
              Confirm
            </LoadingButton>
          </DialogActions>
        </Dialog>
      </Table>
      <div style={{ padding: '0.5rem 0rem' }} />
      <Stack direction='row' spacing={2}>
        <Button variant='contained' onClick={newTag}>
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
          handleCloseDialog={handleCloseDialog}
          openDialog={openDialog}
          tagObject={tagObject}
          setTagObject={setTagObject}
          pageNumber={pageNumber}
          setTagList={setTagList}
          setTagListStatus={setTagListStatus}
        />
      </Stack>
    </React.Fragment>
  );
}
