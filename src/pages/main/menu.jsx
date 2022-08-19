import React from 'react';
import { NavLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  List,
  Divider,
  IconButton,
  Toolbar,
} from '@mui/material';
import {
  Image as ImageIcon,
  Numbers as NumbersIcon,
  ChevronLeft as ChevronLeftIcon,
} from '@mui/icons-material';

import InsertPhotoOutlinedIcon from '@mui/icons-material/InsertPhotoOutlined';
import TagOutlinedIcon from '@mui/icons-material/TagOutlined';
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';

//import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';

const drawerWidth = 240;

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  })
);

export default function Menu(props) {
  const { open, toggleDrawer } = props;
  return (
    <Drawer variant='permanent' open={open}>
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          px: [1],
        }}
      >
        <IconButton onClick={toggleDrawer}>
          <ChevronLeftIcon />
        </IconButton>
      </Toolbar>
      <Divider />
      <List component='nav'>
        <React.Fragment>
          <ListItemButton component={NavLink} to='/main/campaign'>
            <ListItemIcon>
              <FolderOpenOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary='Campaign Repository' />
          </ListItemButton>
          <ListItemButton component={NavLink} to='/main/image'>
            <ListItemIcon>
              <InsertPhotoOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary='Image Gallery' />
          </ListItemButton>
          {/* <ListItemButton component={NavLink} to='/main/document'>
            <ListItemIcon>
              <LibraryBooksIcon />
            </ListItemIcon>
            <ListItemText primary="Documents" />
           </ListItemButton> */}
          <ListItemButton component={NavLink} to='/main/tag'>
            <ListItemIcon>
              <TagOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary='Hash tags' />
          </ListItemButton>
        </React.Fragment>
      </List>
    </Drawer>
  );
}
