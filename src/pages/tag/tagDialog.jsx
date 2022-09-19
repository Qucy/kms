import * as React from 'react';
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

import { API_CAMPAIGNTAGLINK, API_TAG } from '../../utils/api';
import useTag from '../../hooks/tag/useTag';
import useDebounce from '../../hooks/common/useDebounce';

export default function TagDialog(props) {
  const tagObject = useSelector(tagSliceSelector.tagObject);
  const buttonStatus = useSelector(tagSliceSelector.buttonStatus);
  const allTagList = useSelector(tagSliceSelector.allTagList);

  const dispatch = useDispatch();

  const { isTagDialogOpen, onTagDialogClose, pageNumber } = props;
  const { refetchTagList } = useTag();
  const debouncedTagName = useDebounce(tagObject.tag_name, 400);

  const onSave = () => {
    dispatch(setButtonStatus('LOADING'));

    const updateTag = async (id, t, callback) => {
      const resUpdateTag = await API_TAG.updateTag(id, t);
      const { original_tag_name: oldTagName } = resUpdateTag.data;

      if (resUpdateTag.status === 200) {
        // const resPatchTagName = await API_IMAGETAGLINK.updateTagNames({
        //   tag_name: oldTagName,
        //   new_tag_name: t.tag_name,
        // });

        const resUpdateCampaignTags = await API_CAMPAIGNTAGLINK.updateTagNames({
          tag_name: oldTagName,
          new_tag_name: t.tag_name,
        });

        if (resUpdateCampaignTags.status === 200) {
          dispatch(setButtonStatus('SUCCESS'));
          setTimeout(onTagDialogClose, 1000);
          callback && setTimeout(callback, 1000);
          setTimeout(dispatch(setButtonStatus('')), 1000);
        }
      }
    };

    const createTag = async (t, callback) => {
      const tagWithCreatedTime = { ...t, creation_datetime: new Date() };

      const resCreateTag = await API_TAG.createTag(tagWithCreatedTime);

      if (resCreateTag.status === 201) {
        dispatch(setButtonStatus('SUCCESS'));
        setTimeout(onTagDialogClose, 1000);
        callback && setTimeout(callback, 1000);
        setTimeout(dispatch(setButtonStatus('')), 1000);
      }
    };

    //decide if the it's a update/create API call
    if (tagObject.id) {
      updateTag(tagObject.id, tagObject, () => refetchTagList(pageNumber));
    } else {
      createTag(tagObject, () => refetchTagList(pageNumber));
    }
  };

  React.useEffect(() => {
    if (tagObject.id) {
      let _tagList = [...allTagList];
      const _index = allTagList.findIndex((tag) => tag.id === tagObject.id);

      _tagList.splice(_index, 1);
      _tagList.filter((tag) => tag.tag_name === debouncedTagName).length >= 1
        ? dispatch(setButtonStatus('ERROR'))
        : dispatch(setButtonStatus(''));
    } else {
      allTagList.filter((tag) => tag.tag_name === debouncedTagName).length >= 1
        ? dispatch(setButtonStatus('ERROR'))
        : dispatch(setButtonStatus(''));
    }
    return;
  }, [debouncedTagName]);

  return (
    <Dialog open={isTagDialogOpen} onClose={onTagDialogClose}>
      <DialogTitle>NEW</DialogTitle>
      <DialogContent>
        <TextField
          error={buttonStatus === 'ERROR'}
          helperText={buttonStatus === 'ERROR' ? 'Duplicate Hashtag Name' : ''}
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
          disabled={buttonStatus === 'ERROR'}
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
