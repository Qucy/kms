import * as React from 'react';
import { Icon, Typography, Stack, Divider } from '@mui/material';

export default function IconLabel({ icon, label }) {
  return (
    <Stack direction='row' alignItems='center'>
      {icon}
      <Typography display='block' variant='overline' sx={{ pl: 0.5 }}>
        {label}
      </Typography>
    </Stack>
  );
}
