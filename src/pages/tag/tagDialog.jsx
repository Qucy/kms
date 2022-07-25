import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  setTagObject,
  setButtonStatus,
  tagSliceSelector,
} from '../../hooks/tag/tagSlice';
import { LoadingButton } from '@mui/lab';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';

import { API_TAG } from '../../utils/api';

// Dialog to add/update tags
export default function TagDialog(props) {
  const { isTagDialogOpen, onTagDialogClose, pageNumber, refetchTagList } = props;
  const tagObject = useSelector(tagSliceSelector.tagObject);
  const buttonStatus = useSelector(tagSliceSelector.buttonStatus);
  const dispatch = useDispatch();

  const onSave = () => {
    dispatch(setButtonStatus('LOADING'));

    const updateTag = async (id, t, callback) => {
      const responseUpdateTag = await API_TAG.updateTag(id, t);

      if (responseUpdateTag.status === 200) {
        dispatch(setButtonStatus('SUCCESS'));
        setTimeout(onTagDialogClose, 1000);
        callback && setTimeout(callback, 1000);
      }
    };

    const createTag = async (t, callback) => {
      const tagWithCreatedTime = { ...t, creation_datetime: new Date() };

      const resCreateTag = await API_TAG.createTag(tagWithCreatedTime);

      if (resCreateTag.status === 201) {
        dispatch(setButtonStatus('SUCCESS'));
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
            dispatch(setTagObject({ ...tagObject, tag_name: e.target.value }))
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
            dispatch(setTagObject({ ...tagObject, tag_category: e.target.value }))
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
