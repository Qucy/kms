import React from 'react'
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Copyright from '../../components/copyright';
import {useRoutes} from 'react-router-dom'
import routes from '../../routes'


export default function Content() {

  const elements = useRoutes(routes)

  return (
    <Box component="main"
        sx={{
        backgroundColor: (theme) =>
            theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[900],
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
        }}>
        <Toolbar />
        <Container maxWidth="auto" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
              {/* content */}
              <Grid item xs={12}>
              <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column' }}>
                {/* routers */}
                {elements}
              </Paper>
              </Grid>
          </Grid>
          <Copyright sx={{ pt: 4 }} />
        </Container>
    </Box>
  )
}
