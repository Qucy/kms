// TODO to be merged with useImage.js

import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { API_IMAGE, API_IMAGETAGLINK, API_TAG } from '../../utils/api';
import { setOpen, 
         setPaginatedImageList, 
         setTableStatus, 
         imageSliceSelector, 
         setImageObject,
         setButtonStatus } from '../../hooks/image/imageSlice';
import { setAllTagList, tagSliceSelector } from '../../hooks/tag/tagSlice';

const useImageDev = () => {
    const dispatch = useDispatch();
  
    const pageCount = React.useRef(0)

    const [detail, setDetail] = React.useState(false);
    const [pageNumber, setPageNumber] = React.useState(0);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

    const onPaginate = (e, v) => setPageNumber(v ? v : 1);
    const allTagList = useSelector(tagSliceSelector.allTagList);

    const toggleDeleteDialog = () => setIsDeleteDialogOpen((_prev) => !_prev);
  
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

    const onDeleteImage = (e, t) => {
      dispatch(setImageObject(t));
      toggleDeleteDialog();
    };

    const onDeleteDialogClose = () => {
      dispatch(setImageObject({}));
      toggleDeleteDialog();
    };
  
    const onSaveDelete = (e, t) => {
      dispatch(setButtonStatus('LOADING'));
  
      const deleteImage = async (id, callback) => {
        try {
          const response = await API_IMAGE.deleteImage(id);
  
          if (response.status === 200) {
            dispatch(setButtonStatus('SUCCESS'));
            setTimeout(onDeleteDialogClose, 1000);
            // callback && setTimeout(callback, 1000); TODO call refreshImageList function
          }
        } catch (error) {
          console.error(error);
        }
      };
  
      deleteImage(t.id, 'callback');
    };

    
    return {
        isDeleteDialogOpen,
        onDeleteImage,
        onDeleteDialogClose,
        onSaveDelete
    };
}
export default useImageDev;