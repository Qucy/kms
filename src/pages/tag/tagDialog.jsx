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
  // retrieve close dialog function
  const { openDialog, handleCloseDialog, pageNumber, setTagList, setTagListStatus } =
    props;
  // retrieve tag object from tag list page
  const { tagObject, setTagObject } = props;

  //TODOs
  //overlapping status state, refactor after state management library is confirmed
  const [tagObjectStatus, setTagObjectStatus] = React.useState('');

  const onSave = () => {
    //decide if the it's a update/create API call
    setTagObjectStatus('LOADING');
    if (tagObject.id) {
      const updateTag = async (id, t) => {
        const responseUpdateTag = await API_TAG.updateTag(id, t);

        if (responseUpdateTag.status === 200) {
          setTagObjectStatus('SUCCESS');
          setTimeout(handleCloseDialog, 1000);
        }

        setTagListStatus('LOADING');

        const responseTagList = await API_TAG.fetchTags(pageNumber);

        if (responseTagList.status === 200) {
          setTagList(responseTagList.data.results);
          setTagListStatus('SUCCESS');
        }
      };

      updateTag(tagObject.id, tagObject);
    } else {
    }
  };

  return (
    <Dialog open={openDialog} onClose={handleCloseDialog}>
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
        <Button onClick={handleCloseDialog}>Cancel</Button>
        <LoadingButton loading={tagObjectStatus === 'LOADING'} onClick={onSave}>
          Save
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
