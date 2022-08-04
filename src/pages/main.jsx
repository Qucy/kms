import React from 'react';
import { useDispatch } from 'react-redux';
import { setAllTagList } from '../hooks/tag/tagSlice';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Header from './main/header';
import Menu from './main/menu';
import Content from './main/content';

import { API_TAG } from '../utils/api';

const mdTheme = createTheme();

function DashboardContent() {
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Header open={open} toggleDrawer={toggleDrawer} />
        <Menu open={open} toggleDrawer={toggleDrawer} />
        <Content />
      </Box>
    </ThemeProvider>
  );
}

export default function Dashboard() {
  const dispatch = useDispatch();
  //fetch all tags
  React.useEffect(() => {
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
    fetchAllTags();
  }, []);

  return <DashboardContent />;
}
