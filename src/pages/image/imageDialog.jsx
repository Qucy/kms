import React from 'react';
import {
  Stack,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  TextField,
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Autocomplete,
  CircularProgress
} from '@mui/material'

import axios from 'axios';
import useImage from '../../hooks/image/useImage';
import { useSelector, useDispatch } from 'react-redux';
import KMSImageList from '../../components/tagdropdown';
import { styled } from '@mui/material/styles';
import { API_TAG, API_IMAGE, API_IMAGETAGLINK } from '../../utils/api';
import { setPaginatedImageList, setTableStatus, imageSliceSelector } from '../../hooks/image/imageSlice';
import { tagSliceSelector } from '../../hooks/tag/tagSlice';

// image dialog
function ImageDialog(props) {

  const {
    pageNumber,
    onPaginate,
    refetchImageList,
    handleClickOpen,
    handleClose,
    setDetail
  } = useImage()
  
    const open = useSelector(imageSliceSelector.open);
    const allImageList = useSelector(imageSliceSelector.paginatedImageList);
    const allTagList = useSelector(tagSliceSelector.allTagList);

    const { detail } = props
  
    // set image dialog title according to title has value or not
    const title = detail.image_name === undefined ? "Upload" : "Edit";
    // create 2 states and 2 update functions to store and preview selected images
    const [selectedImages, setSelectedImages] = React.useState()
    const [previews, setPreview] = React.useState()
    // create selected tags and update function to retrieve selected tags
    const [selectedTags, setSelectedTags] = React.useState()
    // hide orign upload button for input box
    const Input = styled('input')({
      display: 'none',
    });
  
    // create a preview as a side effect, whenever selected file is changed
    React.useEffect(() => {
      if (!selectedImages) {
          setPreview(undefined)
          return
      }
      let preview_tmp = []
      for (let i = 0; i < selectedImages.length; i++){
        let objectUrl = URL.createObjectURL(selectedImages[i])
        preview_tmp.push(objectUrl)
      }
      setPreview(preview_tmp)
      // free memory when ever this component is unmounted
      // return () => URL.revokeObjectURL(objectUrl) TODO
    }, [selectedImages])
  
    // define onChange method to detect uploaded image
    const onImageSelected = e => {
      // retrieve selected files
      const {files} = e.target
      // if no file selected
      if (!files || files.length === 0) {
        setSelectedImages(undefined)
        return
      } else {
        // only put first image into it
        setSelectedImages(files)
      }
    }
  
    // cancel button
    const onCancel = () => {
      // clean upload component
      setSelectedImages(undefined)
      // close dialog
      handleClose()
    }
  
  // upload function
  const onSave = async () => {
    // Handling multiple images save
    for (let i = 0; i < selectedImages.length; i++) {
      try {
        // create image object and upload
        const { name, size } = selectedImages[i]
        // TODO: Change the hard code creator to input from UI
        const imageObj = {
          file: selectedImages[i],
          image_name: name.split(".")[0],
          create_by: 'Jason',
        }
        const response = await API_IMAGE.createImage(imageObj);
        
        // Getting the returned image_id in backend
        const image_id = response.data.image_id

        // Get the tag id based on tag name
        var tag_ids = allTagList.map(a => a.id)
        var tag_names = allTagList.map(a => a.tag_name)
        var tag_dict = {}
        tag_names.forEach((key, i) => tag_dict[key] = tag_ids[i]);
        const selectedTagsId = selectedTags.map(a => tag_dict[a]);

        // TODO: Change the hard code creator to input from UI
        const payload = {
          tag_ids: selectedTagsId,
          image_id: image_id,
          create_by:  '45072289',
          creation_datetime: new Date()
        };
        const link_response = await API_IMAGETAGLINK.createImageTagLink(payload);
        
      } catch (error) {
        console.error(error);
      }
    }
      // clean upload component
      setSelectedImages(undefined)
      // close dialog
      handleClose()
    }
  
    // update function
    const onUpdate = () => {
      const id = detail.id
      const tags = selectedTags.length === 1 ? selectedTags[0] : selectedTags.join()
      // update tags
      allImageList.map((image)=>{
        if (image.id === id) {
          image.tag = tags
          return image
        }
      })
      // close dialog
      handleClose()
    }
  
    if (title === "Upload") {
      // upload page
      return (
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{title}</DialogTitle>
          {/* upload content */}
          <DialogContent>
            <label htmlFor="contained-button-file">
              {/* upload component */}
              <h4>Upload Guide</h4>
              <p>
                1. Select the tag for the image(s) you would like to upload.
              </p>
              <KMSImageList selectedTags={selectedTags} setSelectedTags={setSelectedTags}/>
              <p>
                2. Upload one or more image(s) using the upload button below.
              </p>
              <Input accept="image/*" id="contained-button-file" multiple type="file" onChange={onImageSelected} />
              <Button variant="contained" component="span">Upload</Button>
              {/* preview component */}
              {selectedImages && previews && previews.map((preview) => (
                <img
                    src={preview}
                    width='550'
                    height='550'
                  alt='new uploaded'
                  style={{ marginTop: '1em', marginBottom: '1em'}}
                  loading="lazy" />
              ))
              }
            </label>
            
          </DialogContent>
          {/* buttons */}
          <DialogActions>
            <Button onClick={onCancel}>Cancel</Button>
            <Button onClick={onSave}>Save</Button>
          </DialogActions>
        </Dialog>
      );} 
    else {
      // update page
      return (
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{title}</DialogTitle>
          <DialogContent>
            <img
              src={`data:image/jpeg;base64,${detail.img}`}
              alt={detail.image_name}
              width='550'
              height='550'
              loading="lazy" />
            <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Image name"
                fullWidth
                variant="standard"
                disabled
                defaultValue={detail.image_name}
              />
            <KMSImageList oldTags={detail.tag} selectedTags={selectedTags} setSelectedTags={setSelectedTags}/>
            <TextField
              autoFocus
              margin="dense"
              id="height"
              label="height"
              fullWidth
              variant="standard"
              disabled
              defaultValue={detail.image_height}
            />
            <TextField
              autoFocus
              margin="dense"
              id="width"
              label="width"
              fullWidth
              variant="standard"
              disabled
              defaultValue={detail.image_width}
            />
            <TextField
              autoFocus
              margin="dense"
              id="size"
              label="size"
              fullWidth
              variant="standard"
              disabled
              defaultValue={detail.image_size}
            />
            <TextField
              autoFocus
              margin="dense"
              id="createdby"
              label="createdby"
              fullWidth
              variant="standard"
              disabled
              defaultValue={detail.create_by} 
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={onUpdate}>Save</Button>
          </DialogActions>
        </Dialog>
      );
    }
  }
  
  export default ImageDialog;