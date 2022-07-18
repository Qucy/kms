import * as React from 'react';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Pagination from '@mui/material/Pagination';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Title from '../main/title';
import TagDialog from './TagDialog';

import { API_TAG } from '../../helpers/api';

// Generate Order Data
function createData(id, name, category, linkedImages, createdBy) {
  return { id, name, category, linkedImages, createdBy };
}

export default function Tags() {
  // add state to control dialog status
  const [openDialog, setOpenDialog] = React.useState(false);
  // add tag list to status
  const [tagList, setTagList] = React.useState(rows);
  // add tag to status (for update)
  const [tagObject, setTagObject] = React.useState(false);

  const [allTags, setAllTags] = React.useState({});

  React.useState(() => {
    const fetchData = async () => {
      const data = await API_TAG.fetchAll();
      console.log(data.data);
      setTagList(data.data.results);
    };

    fetchData();
  }, []);

  React.useState(() => console.log(allTags), [allTags]);

  // open dialog
  const newTag = () => {
    setTagObject('');
    setOpenDialog(true);
  };
  // close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  // delete function
  const deleteTag = (e, tag) => {
    // remove select tag by id
    const newTagList = tagList.filter((t) => {
      return t.id !== tag.id ? t : false;
    });
    // update status
    setTagList(newTagList);
  };
  // edit function
  const editTag = (e, tag) => {
    setTagObject(tag);
    setOpenDialog(true);
  };

  return (
    <React.Fragment>
      <Title>Tags</Title>
      <Table size='small' sx={{ maxHeight: 300 }}>
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography variant='subtitle1'>Tag</Typography>
            </TableCell>
            <TableCell>
              <Typography variant='subtitle1'>Category</Typography>
            </TableCell>
            <TableCell>
              <Typography variant='subtitle1' align='right'>
                Linked Images
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant='subtitle1'>Created By</Typography>
            </TableCell>
            <TableCell>
              <Typography variant='subtitle1'>Operation</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tagList.map((tag) => (
            <TableRow key={tag.id}>
              <TableCell>#{tag.tag_name}</TableCell>
              <TableCell>{tag.tag_category}</TableCell>
              <TableCell align='right'>{tag.linkedImages}</TableCell>
              <TableCell>{tag.create_by}</TableCell>
              <TableCell>
                <Tooltip title='Delete'>
                  <IconButton
                    onClick={(e) => {
                      return deleteTag(e, tag);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title='Delete'>
                  <IconButton
                    onClick={(e) => {
                      return editTag(e, tag);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <Stack direction='row' spacing={2}>
          <Button variant='contained' onClick={newTag}>
            NEW
          </Button>
          <Pagination count={10} showFirstButton showLastButton />
          <TagDialog
            handleCloseDialog={handleCloseDialog}
            openDialog={openDialog}
            tagList={tagList}
            setTagList={setTagList}
            tagObject={tagObject}
            setTagObject={setTagObject}
          />
        </Stack>
      </Table>
    </React.Fragment>
  );
}

const rows = [
  createData(0, 'CustomerExperience', 'CLCM', 22, 'Qucy'),
  createData(1, 'CustomerRelationship', 'CLCM', 13, 'Aelx'),
  createData(2, 'CITIBank', 'Competitor', 5, 'Fung'),
  createData(3, 'RewardPlus', 'APP', 12, 'Martin'),
  createData(4, 'PaymentFraud1', 'Fraud1', 22, 'John'),
  createData(5, 'PaymentFraud2', 'Fraud2', 22, 'John'),
  createData(6, 'PaymentFraud3', 'Fraud3', 22, 'John'),
  createData(7, 'PaymentFraud4', 'Fraud4', 22, 'John'),
  createData(8, 'PaymentFraud5', 'Fraud5', 22, 'John'),
  createData(9, 'PaymentFraud6', 'Fraud6', 22, 'John'),
  createData(10, 'PaymentFraud7', 'Fraud7', 22, 'John'),
  createData(11, 'PaymentFraud8', 'Fraud8', 22, 'John'),
  createData(12, 'PaymentFraud9', 'Fraud9', 22, 'John'),
];
