import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { API_IMAGE, API_IMAGETAGLINK, API_TAG } from '../../utils/api';
import { imageSliceSelector } from '../../hooks/image/imageSlice';
import {
  setPaginatedImageList,
  setTableStatus,
  setImageObject,
  setButtonStatus,
} from '../../hooks/image/imageSlice';
import { tagSliceSelector } from '../../hooks/tag/tagSlice';
import { setAllTagList } from '../../hooks/tag/tagSlice';

const useImage = () => {
  const allTagList = useSelector(tagSliceSelector.allTagList);
  const allImageList = useSelector(imageSliceSelector.paginatedImageList);

  const dispatch = useDispatch();

  const [detail, setDetail] = React.useState(false);
  // const [pageNumber, setPageNumber] = React.useState(0);
  const [isReachedMaxImages, setIsReachMaxImages] = React.useState(false);
  // const pageCount = React.useRef(null);
  const imageCount = React.useRef(null);

  React.useEffect(() => {
    setIsReachMaxImages(allImageList.length === imageCount.current);
  }, [allImageList]);

  // const onPaginate = (e, v) => setPageNumber(v ? v : 1);

  // image upload & edit dialog open & close control
  const [isDetailDialogOpen, setIsDetailDialogOpen] = React.useState(false);
  const toggleDetailDialog = () => setIsDetailDialogOpen((_prev) => !_prev);

  // image delete confirmation dialog open & close control
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const toggleDeleteDialog = () => setIsDeleteDialogOpen((_prev) => !_prev);

  // function open image detail dialog
  const onDetailDialogOpen = () => {
    toggleDetailDialog();
  };

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
  const getPaginatedImage = async (pageNumber = 1, alltags = allTagList) => {
    dispatch(setTableStatus('LOADING'));

    try {
      const response = await API_IMAGE.getPaginatedImages(pageNumber);
      if (response.status === 200) {
        imageCount.current = response.data.count;
        const allImage = response.data.results;
        const image_names = allImage.map((a) => a.image_name);

        const linkage_dict = await fetchTagDictbyImageName(image_names);

        allImage.forEach((e) => {
          var image_tag_name = linkage_dict[e.image_name];
          if (image_tag_name) {
            e.tag = image_tag_name.join();
          }
        });

          dispatch(setPaginatedImageList([...allImageList, ...allImage]));
          dispatch(setTableStatus('SUCCESS'));
        }
    } catch (error) {
      console.error(error);
    }
  }; 

    //function to retrieve all the images
    const getFilteredImage = async (image_names) => {
      dispatch(setTableStatus('LOADING'));
  
      try {
        const response = await API_IMAGE.getFilteredImages(image_names);
        if (response.status === 200) {
          imageCount.current = response.data.count;
          const allImage = response.data.results;  
          const linkage_dict = await fetchTagDictbyImageName(image_names);
  
          allImage.forEach((e) => {
            var image_tag_name = linkage_dict[e.image_name];
            if (image_tag_name) {
              e.tag = image_tag_name.join();
            }
          });
            dispatch(setPaginatedImageList([allImage]));
            dispatch(setTableStatus('SUCCESS'));
          }
      } catch (error) {
        console.error(error);
      }
    }; 

  const fetchTagDictbyImageName = async (image_names) => {
    const link_response = await API_IMAGETAGLINK.getTagNamesbyImagesNames(
      image_names
    );

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
      return linkage_dict
    }
  }

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
    [allTagList]
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
    // pageNumber,
    // onPaginate,
    refetchImageList,

    imageCount,
    isReachedMaxImages,

    isDetailDialogOpen,
    onDetailDialogOpen,
    onDetailDialogClose,

    getPaginatedImage,
    getFilteredImage,
    detail,
    setDetail,
    // pageCount,

    isDeleteDialogOpen,
    onDeleteImage,
    onDeleteDialogClose,
    onSaveDelete,
  };
};
export default useImage;
