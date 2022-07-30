import * as React from 'react';
import { useDispatch } from 'react-redux';
import { API_IMAGE } from '../../utils/api';
import { setOpen, setPaginatedImageList, setTableStatus, imageSliceSelector } from '../../hooks/image/imageSlice';


const useImage = () => {
    const dispatch = useDispatch();

    const [detail, setDetail] = React.useState(false);
    const [pageNumber, setPageNumber] = React.useState(0);

    const onPaginate = (e, v) => setPageNumber(v ? v : 1);

    // function open image dialog
    const handleClickOpen = (item) => {
      setDetail(item);
      dispatch(setOpen(true));
    };

    // function close image dialog
    const handleClose = () => {
      dispatch(setOpen(false));
    };


    const refetchImageList = React.useCallback(
        async (pageNumber) => {
          dispatch(setTableStatus('LOADING'));
    
            try {
                const response = await API_IMAGE.getPaginatedImages(pageNumber);
                if (response.status === 200) {
        
                    const allImage = response.data.results;
                    // Adding tag label as hard code. Pending on Tag functions
                    // TODO: Link the image tag with database data
                    allImage.forEach(e => {
                    e.tag = "Food";
                    });
        
                    dispatch(setPaginatedImageList(allImage));
                    dispatch(setTableStatus('SUCCESS'));
                }
          } catch (error) {
            console.error(error);
          }
        },
        [pageNumber]
      );


    return {
        pageNumber,
        onPaginate,
        refetchImageList,
        handleClickOpen,
        handleClose,
        detail,
        setDetail
    };
}
export default useImage;