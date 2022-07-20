import React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

// Dialog to add/update tags
export default function TagDialog(props) {
  // retrieve close dialog function
  const { openDialog, handleCloseDialog } = props;
  // retrieve tagList from tag list page
  const { tagList, setTagList } = props;
  // retrieve tag object from tag list page
  const { tagObject } = props;
  // define tag name and set function
  const [tagName, setTagName] = React.useState('');
  // define tag category and set function
  const [tagCategory, setTagCategory] = React.useState('');

  // save function
  const handleSave = () => {
    // find out it's an edit function or create new function
    if (tagObject !== '') {
      const newTagList = tagList.map((t) => {
        if (t.id === tagObject.id && tagName !== '' && tagCategory !== '') {
          t.name = tagName;
          t.category = tagCategory;
        }
        return t;
      });
      // set to tagList
      setTagList(newTagList);
    } else {
      // only save if both text input have value
      if (tagName !== '' && tagCategory !== '') {
        // construct tag object
        const tagObject = {
          id: 99,
          name: tagName,
          category: tagCategory,
          linkedImages: 0,
          createdBy: 'Qucy',
        };
        // set to tagList
        setTagList([tagObject, ...tagList]);
      }
    }
    // close dialog
    handleCloseDialog();
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
          onInput={(e) => setTagName(e.target.value)}
          defaultValue={tagObject.name}
        />
        <TextField
          autoFocus
          margin='dense'
          id='tag_category'
          label='tag category'
          fullWidth
          variant='standard'
          required
          onInput={(e) => setTagCategory(e.target.value)}
          defaultValue={tagObject.category}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog}>Cancel</Button>
        <Button onClick={handleSave} type='submit'>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
