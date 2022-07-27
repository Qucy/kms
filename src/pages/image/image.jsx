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
import { styled } from '@mui/material/styles';
import InfoIcon from '@mui/icons-material/Info';
import { Pagination } from '@mui/material';
import KMSImageList from '../../components/tagdropdown';
import axios from 'axios';
import { useEffect } from 'react';
import { API_TAG, API_IMAGE } from '../../utils/api';
import { useSelector, useDispatch } from 'react-redux';
import { setAllTagList, tagSliceSelector } from '../../hooks/tag/tagSlice';
import { setAllImageList, setTableStatus, imageSliceSelector } from '../../hooks/image/imageSlice';

const url = 'http://127.0.0.1:8000/api/';

// function component for image list
export default function TitlebarImageList() {
  const allTagList = useSelector(tagSliceSelector.allTagList);
  const allImageList = useSelector(imageSliceSelector.allImageList);
  const tableStatus = useSelector(imageSliceSelector.tableStatus);
  const dispatch = useDispatch();

  const [open, setOpen] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [pageNumer, setpageNumer] = React.useState(0);
  const [detail, setDetail] = React.useState(false);
  const [imageList, setImageList] = React.useState(defaultData);
  const [previewImageList, setPreviewImageList] = React.useState(defaultData);

  


  useEffect(() => {

    // function to retrieve all the images
    // const getAllImage  = async () => {
    //   try {
    //     const response = await API_IMAGE.getAllImages();
    //     if (response.status === 200) {
    //       const allImage = response.data.results;
    //       // Adding tag label as hard code. Pending on Tag functions
    //       // TODO: Link the image tag with database data
    //       allImage.forEach(e => {
    //         e.tag = "Food";
    //       });
    //       dispatch(setAllImageList(allImage));
    //       dispatch(setTableStatus('SUCCESS'));
    //     }
    //   } catch (error) {
    //     console.error(error);
    //   }
    // }

    // function to retrieve all the tags TODO call when login page is load
    const fetchAllTags = async () => {
      try {
        const response = await API_TAG.getAllTags();
        if (response.status === 200) {
          dispatch(setAllTagList(response.data));
        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchAllTags();
    getAllImage();

  }, []);
  
  // TODO
  const getAllImage = (pageNum=1) => {
    axios.get(`${url}image/${pageNum === 1 ? '' : '?offset='+(pageNum-1)*10}`).then((response) => 
    {
      const allImage = response.data.results;

      // Adding tag label as hard code. Pending on Tag functions
      // TODO: Link the image tag with database data
      allImage.forEach(element => {
        element.tag = "Food";
      });
      
      setPreviewImageList(allImage);
      setImageList(allImage);
      setpageNumer(Math.ceil(response.data.count / 10))
    }).catch(error => console.error(`Error : ${error}`))
  }

  // function open image dialog
  const handleClickOpen = (item) => {
    setDetail(item)
    setOpen(true);
  };

  // function close image dialog
  const handleClose = () => {
    setOpen(false);
  };

  // function to change the page number
  const handlePageChange = (event, value) => {
    setPage(value);
    getAllImage(value);
  }

  // search function for image list
  const search = (event, value) => {
    if (value.length > 0) {
      // filter image list if value is not null or empty
      const newImageList = imageList.filter(
        (item) =>  {
          if (item.tag.indexOf(value) !== -1) return item
        } 
      ) 
      setPreviewImageList(newImageList)
    } else {
      setPreviewImageList(imageList)
    }
  }

  /*if (tableStatus === 'LOADING') {
    return (
      <React.Fragment>
        <CircularProgress />
      </React.Fragment>
    );
  }*/

  return (
    <div>
      {/* Search component */}
      <Stack spacing={3} sx={{ width: 500 }}>
        <Autocomplete
          onChange={search}
          multiple
          id="tags-standard"
          options={allTagList.map(t => t.tag_name)}
          getOptionLabel={(option) => option}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              label="Search by hash tag"
              placeholder="Hash tag"
            />
          )}
        />
      </Stack>
      <Stack>
        <ImageList sx={{height:580}} cols={5}>
          {/* Loop all the images */}
          {previewImageList.map((item) => (
          <ImageListItem key={item.id}>
            <img
              src={`data:image/jpeg;base64,${item.img}`}
              alt={item.image_name}
              loading="lazy" />
            <ImageListItemBar
              title={item.image_name}
              subtitle={item.tag}
              actionIcon={
                <IconButton onClick={() => {return handleClickOpen(item)}} 
                  sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                  aria-label={`info about ${item.image_name}`} >
                  <InfoIcon />
                </IconButton>}
            />
          </ImageListItem>
          ))}
        </ImageList>
      </Stack>
      <Stack direction="row" justifyContent="space-between">
      {/* other function */}
      <Button variant="contained" onClick={handleClickOpen}>UPLOAD</Button>
      {/* pagnation component */}
      <Pagination count={pageNumer} page={page} onChange={handlePageChange} />
      </Stack>
      {/* image dialog component */}
      <ImageDialog open={open} detail={detail} imageList={imageList} setImageList={setImageList} setPreviewImageList={setPreviewImageList} handleClose={handleClose}/>
    </div>
  );
}

// image dialog
function ImageDialog(props) {
  // retrieve value from props
  const {open, detail, handleClose, imageList, setImageList, setPreviewImageList} = props
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
    console.log(preview_tmp)
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
  const onSave = () => {
    for (let i = 0; i < selectedImages.length; i++) {
      // create image object
      const { name, size } = selectedImages[i]
      const tags = selectedTags.length === 1 ? selectedTags[0] : selectedTags.join()
      const imageObj = {
        file: selectedImages[i],
        image_name: name.split(".")[0],
        // TODO: Change the hard code creator to input from UI
        create_by: 'Jason',
      }
      const config = {
        headers: { 'content-type': 'multipart/form-data' }
      }

      axios.post(`${url}image/`, imageObj, config).then(
        response => console.log(response)
      ).catch(error => console.error(`Error : ${error}`))
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
    imageList.map((image)=>{
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

const defaultData = [
  {
    id : 0,
    img: '',
    title: '',
    tag: '',
    height: 0,
    width: 0,
    size: '',
    creator: '',
  }
]