import React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { API_TAG } from '../../utils/api';
import { LoadingButton } from '@mui/lab';

// Dialog to add/update tags
export default function TagDialog(props) {
  const {
    isTagDialogOpen,
    onTagDialogClose,
    pageNumber,
    refetchTagList,
    tagObject,
    setTagObject,
  } = props;

  //TODOs
  //overlapping status state, refactor after state management library is confirmed
  const [buttonStatus, setButtonStatus] = React.useState('');

  const onSave = () => {
    setButtonStatus('LOADING');

    const updateTag = async (id, t, callback) => {
      const responseUpdateTag = await API_TAG.updateTag(id, t);

      if (responseUpdateTag.status === 200) {
        setButtonStatus('SUCCESS');
        setTimeout(onTagDialogClose, 1000);
        callback && setTimeout(callback, 1000);
      }
    };

    const createTag = async (t, callback) => {
      const tagWithCreatedTime = { ...t, creation_datetime: new Date() };

      const resCreateTag = await API_TAG.createTag(tagWithCreatedTime);

      if (resCreateTag.status === 201) {
        setButtonStatus('SUCCESS');
        setTimeout(onTagDialogClose, 1000);
        callback && setTimeout(callback, 1000);
      }
    };

    //decide if the it's a update/create API call
    if (tagObject.id) {
      updateTag(tagObject.id, tagObject, () => refetchTagList(pageNumber));
    } else {
      createTag(tagObject, () => refetchTagList(pageNumber));
    }
  };

  return (
    <Dialog open={isTagDialogOpen} onClose={onTagDialogClose}>
      <DialogTitle>NEW</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin='dense'
          id='tag_name'
          label='tag name'
          fullWidth
          variant='standard'
          required
          onChange={(e) =>
            setTagObject((prevState) => ({ ...prevState, tag_name: e.target.value }))
          }
          defaultValue={tagObject.tag_name}
        />
        <TextField
          autoFocus
          margin='dense'
          id='tag_category'
          label='tag category'
          fullWidth
          variant='standard'
          required
          onChange={(e) =>
            setTagObject((prevState) => ({ ...prevState, tag_category: e.target.value }))
          }
          defaultValue={tagObject.tag_category}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onTagDialogClose}>Cancel</Button>
        <LoadingButton
          variant='text'
          loading={buttonStatus === 'LOADING'}
          onClick={onSave}
        >
          {buttonStatus === 'SUCCESS' ? 'Success!' : 'Save'}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
