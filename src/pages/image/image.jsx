import React from 'react';
import {
  Stack,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  TextField,
  IconButton,
  Button,
  Autocomplete,
  CircularProgress
} from '@mui/material'

import InfoIcon from '@mui/icons-material/Info';
import { Pagination } from '@mui/material';


import { useEffect, useRef } from 'react';
import { API_TAG, API_IMAGE } from '../../utils/api';
import { useSelector, useDispatch } from 'react-redux';

import { setAllTagList, tagSliceSelector } from '../../hooks/tag/tagSlice';
import { setPaginatedImageList, setTableStatus, imageSliceSelector } from '../../hooks/image/imageSlice';
import useImage from '../../hooks/image/useImage';
import ImageDialog from './imageDialog';

// function component for image list
export default function TitlebarImageList() {
  const allTagList = useSelector(tagSliceSelector.allTagList);
  const allImageList = useSelector(imageSliceSelector.paginatedImageList);
  const tableStatus = useSelector(imageSliceSelector.tableStatus);
  const dispatch = useDispatch();

  const {
    pageNumber,
    onPaginate,
    refetchImageList,
    open,
    detail,
    handleClickOpen,
    handleClose
  } = useImage()

  const pageCount = useRef(0)

  useEffect(() => {

    // function to retrieve all the images
    const getPaginatedImage  = async () => {
      try {
        const response = await API_IMAGE.getPaginatedImages();
        if (response.status === 200) {

          const allImage = response.data.results;
          // Adding tag label as hard code. Pending on Tag functions
          // TODO: Link the image tag with database data
          allImage.forEach(e => {
            e.tag = "Food";
          });

          dispatch(setPaginatedImageList(allImage));
          dispatch(setTableStatus('SUCCESS'));

          pageCount.current = Number(response.data.count)
        }
      } catch (error) {
        console.error(error);
      }
    }

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
    getPaginatedImage();

  }, []);
  
  React.useEffect(() => {
    refetchImageList(pageNumber);
  }, [pageNumber]);

  // search function for image list
  const search = (event, value) => {
    /* To be implemented */
  }

  if (tableStatus === 'LOADING') {
    return (
      <React.Fragment>
        <CircularProgress />
      </React.Fragment>
    );
  }

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
          {allImageList.map((item) => (
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
      <Pagination
        count={Math.ceil(pageCount.current / 10)}
        page={pageNumber}
        onChange={onPaginate}
      />
      </Stack>
      {/* image dialog component */}
      <ImageDialog open={open} detail={detail} handleClose={handleClose}/>
    </div>
  );
}