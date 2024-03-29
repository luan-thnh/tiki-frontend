import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { Box, Button, Container, SvgIcon, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { SCREEN_URL } from '../../../../constants/screen';
import { IMAGE_URL } from '../../../../constants/images';

const NotFoundPage = () => {
  document.title = 'Tiki Admin - 404 Not Found';

  return (
    <Box
      component="main"
      sx={{
        alignItems: 'center',
        display: 'flex',
        flexGrow: 1,
        minHeight: '100%',
      }}
    >
      <Container maxWidth="md">
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box
            sx={{
              mb: 3,
              textAlign: 'center',
            }}
          >
            <img
              alt="Under development"
              src={IMAGE_URL.NOT_FOUND_IMAGE}
              style={{
                display: 'inline-block',
                maxWidth: '100%',
                width: 400,
              }}
            />
          </Box>
          <Typography align="center" sx={{ mb: 3 }} variant="h3">
            404: The page you are looking for isn’t here
          </Typography>
          <Typography align="center" color="text.secondary" variant="body1">
            You either tried some shady route or you came here by mistake. Whichever it is, try using the navigation
          </Typography>
          <Button
            component={Link}
            to={SCREEN_URL.ADMIN_HOME}
            startIcon={
              <SvgIcon fontSize="small">
                <KeyboardArrowLeftIcon />
              </SvgIcon>
            }
            sx={{ mt: 3 }}
            variant="contained"
          >
            Go back to dashboard
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default NotFoundPage;
