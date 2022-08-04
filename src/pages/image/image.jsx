import React from 'react';
import axios from 'axios';
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
  DialogContentText,
  Autocomplete,
  Pagination,
  CircularProgress,
  Grid,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { saveAs } from 'file-saver';
import ArchiveIcon from '@mui/icons-material/Archive';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { useEffect } from 'react';
import { API_IMAGE, API_TAG } from '../../utils/api';
import { useSelector, useDispatch } from 'react-redux';
import { tagSliceSelector } from '../../hooks/tag/tagSlice';
import { imageSliceSelector } from '../../hooks/image/imageSlice';
import useImage from '../../hooks/image/useImage';
import ImageDialog from './imageDialog';

// function component for image list
export default function TitlebarImageList() {
  const allTagList = useSelector(tagSliceSelector.allTagList);
  const allImageList = useSelector(imageSliceSelector.paginatedImageList);
  const tableStatus = useSelector(imageSliceSelector.tableStatus);
  const imageObject = useSelector(imageSliceSelector.imageObject);
  const buttonStatus = useSelector(imageSliceSelector.buttonStatus);

  const dispatch = useDispatch();

  const {
    // pageNumber,
    // onPaginate,
    // onLastImageScroll,
    // refetchImageList,
    // pageCount,
    isReachedMaxImages,
    getPaginatedImage,
    isDetailDialogOpen,
    onDetailDialogOpen,
    onDetailDialogClose,
    isDeleteDialogOpen,
    onDeleteImage,
    onDeleteDialogClose,
    onSaveDelete,
  } = useImage();

  const [scrollPageNumber, setScrollPageNumber] = React.useState(1);

  const observer = React.useRef();
  const lastImageRef = React.useCallback(
    (node) => {
      if (tableStatus === 'LOADING') return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !isReachedMaxImages) {
          console.log(`Visible`);
          setScrollPageNumber((_prevState) => _prevState + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [tableStatus, isReachedMaxImages]
  );

  const [detail, setDetail] = React.useState(false);

  useEffect(() => {
    // const fetchAllTags = async () => {
    //   try {
    //     const response = await API_TAG.getAllTags();
    //     if (response.status === 200) {
    //       dispatch(setAllTagList(response.data));
    //     }
    //     return response.data;
    //   } catch (error) {
    //     console.error(error);
    //   }
    // };

    // const initImage = async () => {
    //   const allTags = await fetchAllTags();
    //   getPaginatedImage(scrollPageNumber, allTags);
    // };

    // initImage();

    getPaginatedImage(scrollPageNumber, allTagList);
  }, []);

  React.useEffect(() => {
    getPaginatedImage(scrollPageNumber, allTagList);
  }, [scrollPageNumber]);

  // search function for image list
  const search = (event, value) => {
    /* To be implemented */
  };

  // function open image dialog
  const openDetailDialog = (item) => {
    setDetail(item);
    onDetailDialogOpen();
  };

  // function to download selected image
  const downloadImage = async (item) => {
    // Fetch the image from server
    axios
      .get(
        `${process.env.REACT_APP_API_ENDPOINT}/image/download/?image_url=${item.image_url}`,
        { responseType: 'blob' }
      )
      .then((response) => {
        // file name
        const file_name = item.image_name + '.' + item.image_type;
        // save the file.
        saveAs(response.data, file_name);
      })
      .catch((response) => {
        console.error('Could not Download the image from the backend.', response);
      });
  };

  return (
    <div>
      {/* Search component */}
      <Stack spacing={3} direction='row' justifyContent='space-between'>
        <Autocomplete
          onChange={search}
          sx={{ width: 500 }}
          multiple
          id='tags-standard'
          options={allTagList.map((t) => t.tag_name)}
          getOptionLabel={(option) => option}
          renderInput={(params) => (
            <TextField
              {...params}
              variant='standard'
              label='Search by hash tag'
              placeholder='Hash tag'
            />
          )}
        />
        <Button variant='contained' onClick={openDetailDialog}>
          UPLOAD
        </Button>
      </Stack>
      <Stack>
        <ImageList sx={{ height: 200 }} cols={5}>
          {/* Loop all the images */}

          {allImageList.map((item, index) => (
            <ImageListItem
              key={index}
              ref={index + 1 === allImageList.length ? lastImageRef : null}
            >
              <img
                src={`data:image/jpeg;base64,${item.img}`}
                alt={item.image_name}
                loading='lazy'
              />
              <ImageListItemBar
                title={item.image_name}
                subtitle={item.tag}
                actionIcon={
                  <>
                    {/* edit icon  */}
                    <IconButton
                      onClick={() => {
                        return openDetailDialog(item);
                      }}
                      sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                      aria-label={`update ${item.image_name}`}
                    >
                      <BorderColorIcon />
                    </IconButton>
                    {/* download icon  */}
                    <IconButton
                      onClick={() => {
                        return downloadImage(item);
                      }}
                      sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                      aria-label={`update ${item.image_name}`}
                    >
                      <ArchiveIcon />
                    </IconButton>
                    {/* delete icon  */}
                    <IconButton
                      onClick={(e) => onDeleteImage(e, item)}
                      sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                      aria-label={`update ${item.image_name}`}
                    >
                      <DeleteOutlinedIcon />
                    </IconButton>
                  </>
                }
              />
            </ImageListItem>
          ))}
          {tableStatus === 'LOADING' && (
            <Stack
              alignItems='center'
              justifyContent='center'
              sx={{ width: '100%', paddingTop: '2rem', paddingBottom: '2rem' }}
            >
              <CircularProgress />
            </Stack>
          )}
        </ImageList>
      </Stack>
      {/* <Stack direction='row' justifyContent='space-between'>
        <Pagination
          count={Math.ceil(pageCount.current / 10)}
          page={pageNumber}
          onChange={onPaginate}
        />
      </Stack> */}
      {/* image add & update dialog component */}
      <ImageDialog
        detail={detail}
        isDetailDialogOpen={isDetailDialogOpen}
        onDetailDialogClose={onDetailDialogClose}
      />
      {/* image delete confirmation dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={onDeleteDialogClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>{'Confirm Deletion of Image'}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Deletion of image cannot be redo. Click "Confirm" to proceed.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onDeleteDialogClose}>Close</Button>
          <LoadingButton
            loading={buttonStatus === 'LOADING'}
            onClick={(e) => onSaveDelete(e, imageObject)}
          >
            {buttonStatus === 'SUCCESS' ? 'Success!' : 'Confirm'}
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}
