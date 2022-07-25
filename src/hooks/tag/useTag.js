import * as React from 'react';
import { useDispatch } from 'react-redux';
import { setTagList, setTagObject, setTableStatus, setButtonStatus } from './tagSlice';
import { API_TAG } from '../../utils/api';

const NEW_TAG = {
  tag_name: '',
  tag_category: '',
  create_by: '34973152',
  creation_datetime: '',
};

const useTag = () => {
  const [isTagDialogOpen, setIsTagDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [pageCount, setPageCount] = React.useState(1);
  const [pageNumber, setPageNumber] = React.useState(1);

  const dispatch = useDispatch();

  const toggleTagDialog = () => setIsTagDialogOpen((_prev) => !_prev);
  const toggleDeleteDialog = () => setIsDeleteDialogOpen((_prev) => !_prev);

  const onPaginate = (e, v) => setPageNumber(v ? v : 1);

  const onNewTag = () => {
    dispatch(setTagObject(NEW_TAG));
    toggleTagDialog();
  };

  const onEditTag = (e, t) => {
    dispatch(setTagObject(t));
    toggleTagDialog();
  };

  const onDeleteTag = (e, t) => {
    dispatch(setTagObject(t));
    toggleDeleteDialog();
  };

  const onTagDialogClose = () => {
    dispatch(setTagObject({}));
    toggleTagDialog();
  };

  const onDeleteDialogClose = () => {
    dispatch(setTagObject({}));
    toggleDeleteDialog();
  };

  const onSaveDelete = (e, t) => {
    dispatch(setButtonStatus('LOADING'));

    const deleteTag = async (id, callback) => {
      try {
        const response = await API_TAG.deleteTag(id);

        if (response.status === 200) {
          dispatch(setButtonStatus('SUCCESS'));
          setTimeout(onDeleteDialogClose, 1000);
          callback && setTimeout(callback, 1000);
        }
      } catch (error) {
        console.error(error);
      }
    };

    deleteTag(t.id, refetchTagList);
  };

  const refetchTagList = React.useCallback(
    async (pageNumber) => {
      dispatch(setTableStatus('LOADING'));

      try {
        const resTagList = await API_TAG.fetchTags(pageNumber);

        if (resTagList.status === 200) {
          dispatch(setTagList(resTagList.data.results));
          dispatch(setTableStatus('SUCCESS'));
        }
      } catch (error) {
        console.error(error);
      }
    },
    [pageNumber]
  );

  return {
    isTagDialogOpen,
    isDeleteDialogOpen,
    pageCount,
    setPageCount,
    pageNumber,
    onPaginate,
    onNewTag,
    onEditTag,
    onDeleteTag,
    onTagDialogClose,
    onDeleteDialogClose,
    onSaveDelete,
    refetchTagList,
  };
};

export default useTag;
