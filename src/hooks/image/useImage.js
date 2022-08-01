import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { API_IMAGE, API_IMAGETAGLINK, API_TAG } from '../../utils/api';
import {
  setOpen,
  setPaginatedImageList,
  setTableStatus,
  imageSliceSelector,
} from '../../hooks/image/imageSlice';
import { setAllTagList, tagSliceSelector } from '../../hooks/tag/tagSlice';

const useImage = () => {
  const dispatch = useDispatch();

  const pageCount = React.useRef(0);

  const [detail, setDetail] = React.useState(false);
  const [pageNumber, setPageNumber] = React.useState(0);

  const onPaginate = (e, v) => setPageNumber(v ? v : 1);
  const allTagList = useSelector(tagSliceSelector.allTagList);

  // function close image dialog
  const handleClose = () => {
    dispatch(setOpen(false));
  };

  const fetchAllTags = async () => {
    try {
      const response = await API_TAG.getAllTags();
      if (response.status === 200) {
        dispatch(setAllTagList(response.data));
      }
    } catch (error) {
      console.error(error);
    }
  };

  //function to retrieve all the images
  const getPaginatedImage = async (pageNumber = 0, alltags) => {
    try {
      // if (alltags.length !== 0) {
      //   const allTagList = await API_TAG.getAllTags().data;
      // }

      const response = await API_IMAGE.getPaginatedImages(pageNumber);
      if (response.status === 200) {
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

          dispatch(setPaginatedImageList(allImage));
          dispatch(setTableStatus('SUCCESS'));

          pageCount.current = Number(response.data.count);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const refetchImageList = React.useCallback(
    async (pageNumber) => {
      dispatch(setTableStatus('LOADING'));
      getPaginatedImage(pageNumber, allTagList);
    },
    [pageNumber, allTagList]
  );

  return {
    pageNumber,
    onPaginate,
    refetchImageList,
    handleClose,
    getPaginatedImage,
    detail,
    setDetail,
    pageCount,
  };
};
export default useImage;
