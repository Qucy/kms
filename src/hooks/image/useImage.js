import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { API_IMAGE, API_IMAGETAGLINK, API_TAG } from '../../utils/api';
import {
  setPaginatedImageList,
  setTableStatus,
  setImageObject,
  setButtonStatus
} from '../../hooks/image/imageSlice';
import { tagSliceSelector } from '../../hooks/tag/tagSlice';
import { setAllTagList } from '../../hooks/tag/tagSlice';

const useImage = () => {

  const dispatch = useDispatch();
  const pageCount = React.useRef(0);
  const [detail, setDetail] = React.useState(false);
  const [pageNumber, setPageNumber] = React.useState(0);
  const onPaginate = (e, v) => setPageNumber(v ? v : 1);
  const allTagList = useSelector(tagSliceSelector.allTagList);

  // image upload & edit dialog open & close control
  const [isDetailDialogOpen, setIsDetailDialogOpen] = React.useState(false);
  const toggleDetailDialog = () => setIsDetailDialogOpen((_prev) => !_prev);

  // image delete confirmation dialog open & close control
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const toggleDeleteDialog = () => setIsDeleteDialogOpen((_prev) => !_prev);


  // function open image detail dialog
  const onDetailDialogOpen = () => {
    toggleDetailDialog();
  }

  // function close image detail dialog
  const onDetailDialogClose = () => {
    toggleDetailDialog();
  };

  // function to open image delete dialog
  const onDeleteImage = (e, t) => {
    dispatch(setImageObject(t));
    toggleDeleteDialog();
  };

  // function to close image delete dialog
  const onDeleteDialogClose = () => {
    dispatch(setImageObject({}));
    toggleDeleteDialog();
  };

  //function to retrieve all the images
  const getPaginatedImage = async (pageNumber = 0) => {
    try {

      const response = await API_IMAGE.getPaginatedImages(pageNumber);
      if (response.status === 200) {
        const allImage = response.data.results;
        const image_names = allImage.map((a) => a.image_name);
        const link_response = await API_IMAGETAGLINK.getTagNamesbyImagesNames(image_names);

        if (link_response.status === 200) {
          const linkage_list = link_response.data.map((a) => [a.image_name, a.tag_name]);
          var linkage_dict = {};
  
          for (let i in linkage_list) {
            const image_name = linkage_list[i][0];
            const tag_name = linkage_list[i][1];
  
            if (image_name in linkage_dict) {
              linkage_dict[image_name].push(tag_name);
            } else {
              linkage_dict[image_name] = [tag_name];
            }
          }

          allImage.forEach((e) => {
            var image_tag_name = linkage_dict[e.image_name];
            if (image_tag_name) {
              e.tag = image_tag_name.join();
            }
          });

          dispatch(setPaginatedImageList(allImage));
          dispatch(setTableStatus('SUCCESS'));

          pageCount.current = Number(response.data.count);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAllTags = async () => {
    try {
      const response = await API_TAG.getAllTags();
      if (response.status === 200) {
        dispatch(setAllTagList(response.data));
      }
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  const initImage = async () => {
    const allTags = await fetchAllTags();
    getPaginatedImage(null, allTags);
  };

  // function to refresh image list
  const refetchImageList = React.useCallback(
    async (pageNumber) => {
      dispatch(setTableStatus('LOADING'));
      getPaginatedImage(pageNumber);
    },
    [pageNumber, allTagList]
  );

  // function to delete image
  const onSaveDelete = (e, t) => {
    dispatch(setButtonStatus('LOADING'));

    const deleteImage = async (id, callback) => {
      try {
        const response = await API_IMAGE.deleteImage(id);

        if (response.status === 200) {
          dispatch(setButtonStatus('SUCCESS'));
          setTimeout(onDeleteDialogClose, 1000);
          callback && setTimeout(callback, 1000);
        }
      } catch (error) {
        console.error(error);
      }
    };

    deleteImage(t.id, refetchImageList);
  };

  return {
    pageNumber,
    onPaginate,
    refetchImageList,

    isDetailDialogOpen,
    onDetailDialogOpen,
    onDetailDialogClose,
    
    initImage,
    detail,
    setDetail,
    pageCount,


    isDeleteDialogOpen,
    onDeleteImage,
    onDeleteDialogClose,
    onSaveDelete

    
  };
};
export default useImage;
