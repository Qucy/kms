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
import {
  ConnectingAirportsOutlined,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';

import Title from '../main/title';
import TagDialog from './TagDialog';
import { API_TAG } from '../../utils/api';

// Generate Order Data
function createData(id, name, category, linkedImages, createdBy) {
  return { id, name, category, linkedImages, createdBy };
}

export default function Tags() {
  //TODOs
  //Clean up state with useReducer

  // add state to control dialog status
  const [openDialog, setOpenDialog] = React.useState(false);
  // add tag list to status
  const [tagList, setTagList] = React.useState([]);
  // add tag to status (for update)
  const [tagObject, setTagObject] = React.useState({});

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  const [status, setStatus] = React.useState('');
  const [tagListStatus, setTagListStatus] = React.useState('LOADING');

  React.useState(() => {
    const fetchData = async () => {
      try {
        const response = await API_TAG.fetchAllTags();

        if (response.status === 200) {
          setTagList(response.data.results);
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
    tagList.length > 0 && setTagListStatus('SUCCESS');
  }, [tagList]);

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
          setTagListStatus('LOADING');
          setTimeout(
            () =>
              setTagList((prevState) =>
                [...prevState].filter((t) => (t.id !== tagObject.id ? t : false))
              ),
            2000
          );
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

  const onEditTag = React.useCallback(
    (t) => (e) => {
      setTagObject(t);
      setOpenDialog(true);
    },
    []
  );

  // open dialog
  const newTag = () => {
    setTagObject('');
    setOpenDialog(true);
  };
  // close dialog
  const handleCloseDialog = () => {
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
                  <IconButton onClick={onEditTag}>
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
        <Stack direction='row' spacing={2}>
          <Button variant='contained' onClick={newTag}>
            NEW
          </Button>
          <Pagination count={10} showFirstButton showLastButton />
          <TagDialog
            handleCloseDialog={handleCloseDialog}
            openDialog={openDialog}
            tagList={tagList}
            setTagList={setTagList}
            tagObject={tagObject}
            setTagObject={setTagObject}
          />
        </Stack>
      </Table>
    </React.Fragment>
  );
}

const [] = [
  createData(0, 'CustomerExperience', 'CLCM', 22, 'Qucy'),
  createData(1, 'CustomerRelationship', 'CLCM', 13, 'Aelx'),
  createData(2, 'CITIBank', 'Competitor', 5, 'Fung'),
  createData(3, 'RewardPlus', 'APP', 12, 'Martin'),
  createData(4, 'PaymentFraud1', 'Fraud1', 22, 'John'),
  createData(5, 'PaymentFraud2', 'Fraud2', 22, 'John'),
  createData(6, 'PaymentFraud3', 'Fraud3', 22, 'John'),
  createData(7, 'PaymentFraud4', 'Fraud4', 22, 'John'),
  createData(8, 'PaymentFraud5', 'Fraud5', 22, 'John'),
  createData(9, 'PaymentFraud6', 'Fraud6', 22, 'John'),
  createData(10, 'PaymentFraud7', 'Fraud7', 22, 'John'),
  createData(11, 'PaymentFraud8', 'Fraud8', 22, 'John'),
  createData(12, 'PaymentFraud9', 'Fraud9', 22, 'John'),
];
