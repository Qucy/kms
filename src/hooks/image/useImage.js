import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { API_IMAGE, API_IMAGETAGLINK, API_TAG } from '../../utils/api';
import imageSlice, {
  imageSliceSelector,
  setScrollPageNumber,
} from '../../hooks/image/imageSlice';
import {
  setPaginatedImageList,
  setTableStatus,
  setImageObject,
  setButtonStatus,
} from '../../hooks/image/imageSlice';
import { tagSliceSelector } from '../../hooks/tag/tagSlice';

const useImage = () => {
  const allTagList = useSelector(tagSliceSelector.allTagList);
  const allImageList = useSelector(imageSliceSelector.paginatedImageList);
  const scrollPageNumber = useSelector(imageSliceSelector.scrollPageNumber);

  const dispatch = useDispatch();

  const [detail, setDetail] = React.useState(false);
  const [isReachedMaxImages, setIsReachMaxImages] = React.useState(false);
  const imageCount = React.useRef(null);

  React.useEffect(() => {
    setIsReachMaxImages(allImageList.length === imageCount.current);
  }, [allImageList]);

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
  const getPaginatedImage = async (pageNumber = 1) => {
    dispatch(setTableStatus('LOADING'));

    try {
      const response = await API_IMAGE.getPaginatedImages(pageNumber);
      if (response.status === 200) {
        imageCount.current = response.data.count;
        const allImage = response.data.results;
        const image_names = allImage.map((a) => a.image_name);
        const imagesWithTag = await getImagesWithTag(allImage, image_names);

        dispatch(setPaginatedImageList([...allImageList, ...imagesWithTag]));
        dispatch(setTableStatus('SUCCESS'));
      }
    } catch (error) {
      console.error(error);
    }
  };

  //function to retrieve all the images
  const getFilteredImage = async (image_names) => {
    dispatch(setTableStatus('LOADING'));
    const imageNamesStr = image_names.toString();

    try {
      const response = await API_IMAGE.getFilteredImages(imageNamesStr);
      if (response.status === 200) {
        imageCount.current = response.data.count;
        const allImage = response.data.results;
        const imagesWithTag = await getImagesWithTag(allImage, imageNamesStr);

        dispatch(setPaginatedImageList([...imagesWithTag]));
        dispatch(setTableStatus('SUCCESS'));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const initImages = async (pageNumber) => {
    //set loading
    dispatch(setTableStatus('LOADING'));
    const response = await API_IMAGE.getPaginatedImages(pageNumber);

    //set dataSource to DEFAULT
    //fetch the first 10 images from the server
    //adding tags to the images
    //set success
  };

  /**
   * function to get related tags of each image
   * @param {Array} image_names array of image names
   * @returns {Object} return an object in which the key is the image name and value is an array of related tags
   */

  const getTagDictByImageNames = async (image_names) => {
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
      return linkage_dict;
    }
  };

  /**
   * function to add tags into each of the image inside an array
   * @param {Array} allImage image list fetched from API.IMAGE_getPaginatedImages
   * @param {Array} imageNames array of image names
   * @return {Array} return an image list with tags attached
   */
  const getImagesWithTag = async (allImage, imageNames) => {
    const linkage_dict = await getTagDictByImageNames(imageNames);

    allImage.forEach((e) => {
      const image_tag_name = linkage_dict[e.image_name];
      if (image_tag_name) {
        e.tag = image_tag_name.join();
      }
    });

    return allImage;
  };

  // function to refresh image list
  const refetchImageList = React.useCallback(async (pageNumber) => {
    dispatch(setTableStatus('LOADING'));
    dispatch(setScrollPageNumber(1));
    getPaginatedImage(pageNumber);
  }, []);

  // function to delete image
  const onSaveDelete = (e, t) => {
    dispatch(setButtonStatus('LOADING'));

    const deleteImage = async (id, callback) => {
      try {
        const response = await API_IMAGE.deleteImage(id);

        if (response.status === 204) {
          dispatch(setButtonStatus('SUCCESS'));
          onDeleteDialogClose();
          callback && setTimeout(callback(), 3000);
        }
      } catch (error) {
        console.error(error);
      }
    };

    deleteImage(t.id, refetchImageList);
  };

  return {
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
