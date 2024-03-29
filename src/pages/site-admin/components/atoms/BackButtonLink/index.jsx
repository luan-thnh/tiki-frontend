import React from 'react';
import { Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import theme from '../../../../../theme';

function BackButtonLink(props) {
  const { linkTo } = props;
  return (
    <Stack
      component={Link}
      to={linkTo}
      direction="row"
      gap={1}
      mt={4}
      pl={3}
      sx={{
        width: 'fit-content',
        color: theme.palette.black.main,
        fontWeight: 600,
        textDecoration: 'none',

        '&:hover': {
          textDecoration: 'underline',
          textUnderlineOffset: '2px',
        },
      }}
    >
      <ArrowBackRoundedIcon />
      <Typography style={{ fontWeight: 500 }}>Quay lại</Typography>
    </Stack>
  );
}

export default BackButtonLink;
