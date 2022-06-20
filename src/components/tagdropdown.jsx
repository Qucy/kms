import React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';

const names = [
  '#Electronic',
  '#Food',
  '#Clothes',
  '#Sports',
  '#Plants',
  '#Sea'
];

export default function KMSImageList(props) {
  // retrieve tags
  const {oldTags, setSelectedTags} = props
  var initTags = []
  // init selected tags
  if (oldTags !== undefined) {
    initTags = oldTags.split(',')
  }
  // bind tags with state
  const [tags, setTag] = React.useState(initTags);

  const handleChange = (event) => {
    const { target: { value }} = event;
    const values = typeof value === 'string' ? value.split(',') : value;
    setTag(values);
    setSelectedTags(values)
  };

  return (
    <FormControl variant="standard" sx={{ m: 1, minWidth: 550 }}>
      <InputLabel id="multiple-hash-tag-title">#Tag</InputLabel>
      <Select
        labelId="multiple-hash-tag"
        id="multiple-hash-tag-select"
        multiple
        value={tags}
        onChange={handleChange}
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected.map((value) => (
              <Chip key={value} label={value} />
            ))}
          </Box>
        )}
      >
        {names.map((name) => (
          <MenuItem key={name} value={name}>
            {name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}