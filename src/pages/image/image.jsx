import React from 'react';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack'
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Autocomplete from '@mui/material/Autocomplete';
import KMSImageList from '../../components/tagdropdown';
import axios from 'axios';
import { useEffect } from 'react';

const url = 'http://127.0.0.1:8000/api/';

// function component for image list
export default function TitlebarImageList() {
  

  const [open, setOpen] = React.useState(false);
  const [detail, setDetail] = React.useState(false);
  const [imageList, setImageList] = React.useState(defaultData);
  const [previewImageList, setPreviewImageList] = React.useState(defaultData);


  useEffect(() => {
    getAllImage();
  }, []);

  
  const getAllImage = () => {
    axios.get(`${url}image/`).then((response) => 
    {
      const allImage = response.data.results;

      // Adding tag label as hard code. Pending on Tag functions
      // TODO: Link the image tag with database data
      allImage.forEach(element => {
        element.tag = "Food";
      });
      
      setPreviewImageList(allImage);
      setImageList(allImage);
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

  return (
    <div>
      {/* Search component */}
    <Stack spacing={3} sx={{ width: 500 }}>
      <Autocomplete
        onChange={search}
        multiple
        id="tags-standard"
        options={hashTags}
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
      <ImageList sx={{height:500}} cols={5}>
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
      {/* other function */}
      <Button variant="contained" onClick={handleClickOpen}>UPLOAD</Button>
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
  const [preview, setPreview] = React.useState()
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
    const objectUrl = URL.createObjectURL(selectedImages)
    setPreview(objectUrl)
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
      setSelectedImages(files[0])
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
    // create image object
    const {name, size} = selectedImages
    const tags = selectedTags.length === 1 ? selectedTags[0] : selectedTags.join()
    const imageObj =   {
      file: selectedImages,
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

    // append element to image list (Commented since connected to DB)
    // const newImageList = [...imageList, imageObj]
    // setImageList(newImageList)
    // setPreviewImageList(newImageList)
    
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
            <Input accept="image/*" id="contained-button-file" multiple type="file" onChange={onImageSelected}/>
            <Button variant="contained" component="span">Upload</Button>
            {/* preview component */}
            {selectedImages &&  <img src={preview}
                                      width='550'
                                      height='550'
                                      alt='new uploaded'
                                      loading="lazy" /> }
          </label>
        </DialogContent>
        {/* multiple tag select component */}
        <DialogContent>
          <KMSImageList selectedTags={selectedTags} setSelectedTags={setSelectedTags}/>
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
    id : 1,
    img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?w=164&h=164&fit=crop&auto=format&dpr=2',
    title: 'Breakfast',
    tag: '#Food',
    height: 100,
    width: 100,
    size: '300 KB',
    creator: 'Jason',
  }
]


const itemData = [
  {
    id : 1,
    img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?w=164&h=164&fit=crop&auto=format&dpr=2',
    title: 'Breakfast',
    tag: '#Food',
    height: 100,
    width: 100,
    size: '300 KB',
    creator: 'Jason',
  },
  {
    id : 2,
    img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=164&h=164&fit=crop&auto=format&dpr=2',
    title: 'Burger',
    tag: '#Food',
    height: 199,
    width: 288,
    size: '400 KB',
    creator: 'Jason',
  },
  {
    id : 3,
    img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45?w=164&h=164&fit=crop&auto=format&dpr=2',
    title: 'Camera',
    tag: '#Electronic',
    height: 400,
    width: 500,
    size: '600 KB',
    creator: 'Jason',
  },
  {
    id : 4,
    img: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c?w=164&h=164&fit=crop&auto=format&dpr=2',
    title: 'Coffee',
    tag: '#Food',
    height: 200,
    width: 100,
    size: '350 KB',
    creator: 'Jason',
  },
  {
    id : 5,
    img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8?w=164&h=164&fit=crop&auto=format&dpr=2',
    title: 'Hats',
    tag: '#Clothes',
    height: 100,
    width: 100,
    size: '300 KB',
    creator: 'Jason',
  },
  {
    id : 6,
    img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=164&h=164&fit=crop&auto=format&dpr=2',
    title: 'Honey',
    tag: '#Food',
    height: 100,
    width: 100,
    size: '300 KB',
    creator: 'Jason',
  },
  {
    id : 7,
    img: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6?w=164&h=164&fit=crop&auto=format&dpr=2',
    title: 'Basketball',
    tag: '#Sports',
    height: 100,
    width: 100,
    size: '300 KB',
    creator: 'Jason',
  },
  {
    id : 8,
    img: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f?w=164&h=164&fit=crop&auto=format&dpr=2',
    title: 'Fern',
    tag: '#Plants',
    height: 100,
    width: 100,
    size: '300 KB',
    creator: 'Jason',
  },
  {
    id : 9,
    img: 'https://images.unsplash.com/photo-1597645587822-e99fa5d45d25?w=164&h=164&fit=crop&auto=format&dpr=2',
    title: 'Mushrooms',
    tag: '#Plants',
    height: 100,
    width: 100,
    size: '300 KB',
    creator: 'Jason',
  },
  {
    id : 10,
    img: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af?w=164&h=164&fit=crop&auto=format&dpr=2',
    title: 'Tomato basil',
    tag: '#Plants',
    height: 100,
    width: 100,
    size: '300 KB',
    creator: 'Jason',
  },
  {
    id : 11,
    img: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1?w=164&h=164&fit=crop&auto=format&dpr=2',
    title: 'Sea star',
    tag: '#Sea',
    height: 100,
    width: 100,
    size: '300 KB',
    creator: 'Jason',
  },

];


const hashTags = [
'#Food', 
'#Electronic',
'#Clothes',
'#Sports',
'#Plants',
'#Sea'
];