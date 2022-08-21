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

const mdTheme = createTheme({
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

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
          var res = response.data

          var items = Object.keys(res).map((key) => response.data[key]);

          console.log(items)
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
