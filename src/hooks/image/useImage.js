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
      // if (alltags.length !== 0) {
      //   const allTagList = await API_TAG.getAllTags().data;
      // }

      const response = await API_IMAGE.getPaginatedImages(pageNumber);
      if (response.status === 200) {
        imageCount.current = response.data.count;
        const allImage = response.data.results;
        const image_tags = allImage.map((a) => a.id);
        const link_response = await API_IMAGETAGLINK.getTagIDbyImagesID(image_tags);
        const linkage_list = link_response.data.map((a) => [a.image_id, a.tag_id]);
        var linkage_dict = {};

        for (let i in linkage_list) {
          const image_id = linkage_list[i][0];
          const tag_id = linkage_list[i][1];

          if (image_id in linkage_dict) {
            linkage_dict[image_id].push(tag_id);
          } else {
            linkage_dict[image_id] = [tag_id];
          }
        }

        var tag_ids = alltags.map((a) => a.id);
        var tag_names = alltags.map((a) => a.tag_name);
        var tag_dict = {};
        tag_ids.forEach((key, i) => (tag_dict[key] = tag_names[i]));

        if (link_response.status === 200) {
          // Adding tag label as hard code. Pending on Tag functions
          // TODO: Link the image tag with database data
          allImage.forEach((e) => {
            var image_tag_ids = linkage_dict[e.id];
            var image_tags = [];
            for (var i in image_tag_ids) {
              image_tags.push(tag_dict[image_tag_ids[i]]);
            }
            e.tag = image_tags.join();
          });

          dispatch(setPaginatedImageList([...allImageList, ...allImage]));
          dispatch(setTableStatus('SUCCESS'));
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  // function to refresh image list
  const refetchImageList = React.useCallback(
    async (pageNumber) => {
      dispatch(setTableStatus('LOADING'));
      getPaginatedImage(pageNumber, allTagList);
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
