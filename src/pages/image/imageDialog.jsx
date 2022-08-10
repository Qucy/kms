import React from 'react';
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import useImage from '../../hooks/image/useImage';
import { useSelector } from 'react-redux';
import KMSImageList from '../../components/tagdropdown';
import { styled } from '@mui/material/styles';
import { API_IMAGE, API_IMAGETAGLINK } from '../../utils/api';
import { imageSliceSelector } from '../../hooks/image/imageSlice';

// image dialog
function ImageDialog(props) {
  const allImageList = useSelector(imageSliceSelector.paginatedImageList);
  const { detail, isDetailDialogOpen, onDetailDialogClose } = props;

  const { refetchImageList } = useImage();

  // set image dialog title according to title has value or not
  const title = detail.image_name === undefined ? 'Upload' : 'Edit';
  // create 2 states and 2 update functions to store and preview selected images
  const [selectedImages, setSelectedImages] = React.useState();
  const [previews, setPreview] = React.useState();
  // create selected tags and update function to retrieve selected tags
  const [selectedTags, setSelectedTags] = React.useState();
  // hide orign upload button for input box
  const Input = styled('input')({
    display: 'none',
  });

  // create a preview as a side effect, whenever selected file is changed
  React.useEffect(() => {
    if (!selectedImages) {
      setPreview(undefined);
      return;
    }
    let preview_tmp = [];
    for (let i = 0; i < selectedImages.length; i++) {
      let objectUrl = URL.createObjectURL(selectedImages[i]);
      preview_tmp.push(objectUrl);
    }
    setPreview(preview_tmp);
    // free memory when ever this component is unmounted
    // return () => URL.revokeObjectURL(objectUrl) TODO
  }, [selectedImages]);

  // define onChange method to detect uploaded image
  const onImageSelected = (e) => {
    // retrieve selected files
    const { files } = e.target;
    // if no file selected
    if (!files || files.length === 0) {
      setSelectedImages(undefined);
      return;
    } else {
      // only put first image into it
      setSelectedImages(files);
    }
  };

  // cancel button
  const onCancel = () => {
    // clean upload component
    setSelectedImages(undefined);
    // close dialog
    onDetailDialogClose();
  };

  // upload function
  const onSave = async () => {
    // Handling multiple images save
    for (let i = 0; i < selectedImages.length; i++) {
      try {
        // create image object and upload
        const { name } = selectedImages[i];
        // TODO: Change the hard code creator to input from UI
        const imageObj = {
          file: selectedImages[i],
          image_name: name.split('.')[0],
          create_by: 'Jason',
        };
        const response = await API_IMAGE.createImage(imageObj);

        // TODO: Change the hard code creator to input from UI
        const payload = {
          tag_names: selectedTags,
          image_name: name.split('.')[0],
          create_by: '45072289',
          creation_datetime: new Date(),
        };
        const link_response = await API_IMAGETAGLINK.createImageTagLink(payload);
      } catch (error) {
        console.error(error);
      }
    }
    // clean upload component
    setSelectedImages(undefined);
    // close dialog
    onDetailDialogClose();
  };

  // update function
  const onUpdate = async () => {
    console.log(detail);
    const image_name = detail.image_name;

    // delete tags
    const delete_response = await API_IMAGETAGLINK.deleteImageTagLink(image_name);

    // re-create tags
    // TODO: Change the hard code creator to input from UI
    const payload = {
      tag_names: selectedTags,
      image_name: image_name,
      create_by: '45072289',
      creation_datetime: new Date(),
    };
    const link_response = await API_IMAGETAGLINK.createImageTagLink(payload);

    // close dialog
    onDetailDialogClose();
    refetchImageList();
  };

  if (title === 'Upload') {
    // upload page
    return (
      <Dialog open={isDetailDialogOpen} onClose={onDetailDialogClose}>
        <DialogTitle>{title}</DialogTitle>
        {/* upload content */}
        <DialogContent>
          <label htmlFor='contained-button-file'>
            {/* upload component */}
            <h4>Upload Guide</h4>
            <p>1. Select the tag for the image(s) you would like to upload.</p>
            <KMSImageList selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
            <p>2. Upload one or more image(s) using the upload button below.</p>
            <Input
              accept='image/*'
              id='contained-button-file'
              multiple
              type='file'
              onChange={onImageSelected}
            />
            <Button variant='contained' component='span'>
              Upload
            </Button>
            {/* preview component */}
            {selectedImages &&
              previews &&
              previews.map((preview, index) => (
                <img
                  key={index}
                  src={preview}
                  width='550'
                  height='550'
                  alt='new uploaded'
                  style={{ marginTop: '1em', marginBottom: '1em' }}
                  loading='lazy'
                />
              ))}
          </label>
        </DialogContent>
        {/* buttons */}
        <DialogActions>
          <Button onClick={onCancel}>Cancel</Button>
          <Button onClick={onSave}>Save</Button>
        </DialogActions>
      </Dialog>
    );
  } else {
    // update page
    return (
      <Dialog open={isDetailDialogOpen} onClose={onDetailDialogClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <img
            src={`data:image/jpeg;base64,${detail.img}`}
            alt={detail.image_name}
            width='550'
            height='550'
            loading='lazy'
          />
          <TextField
            autoFocus
            margin='dense'
            id='name'
            label='Image name'
            fullWidth
            variant='standard'
            disabled
            defaultValue={detail.image_name}
          />
          <KMSImageList
            oldTags={detail.tag}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
          />
          <TextField
            autoFocus
            margin='dense'
            id='height'
            label='height'
            fullWidth
            variant='standard'
            disabled
            defaultValue={detail.image_height}
          />
          <TextField
            autoFocus
            margin='dense'
            id='width'
            label='width'
            fullWidth
            variant='standard'
            disabled
            defaultValue={detail.image_width}
          />
          <TextField
            autoFocus
            margin='dense'
            id='size'
            label='size'
            fullWidth
            variant='standard'
            disabled
            defaultValue={detail.image_size}
          />
          <TextField
            autoFocus
            margin='dense'
            id='createdby'
            label='createdby'
            fullWidth
            variant='standard'
            disabled
            defaultValue={detail.create_by}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onDetailDialogClose}>Cancel</Button>
          <Button onClick={onUpdate}>Save</Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default ImageDialog;
