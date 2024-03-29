import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { SCREEN_URL } from '../../../../../constants/screen';
import { Box, Stack } from '@mui/material';
import SidebarAdmin from '../SidebarAdmin';
import HeaderAdmin from '../HeaderAdmin';

const LayoutAdminContainer = ({ component: Component, isHeader, isSidebar, title, isRedirect }) => {
  const token = localStorage.getItem('token');
  const dataAdmin = JSON.parse(localStorage.getItem('data_admin'));
  const navigate = useNavigate();

  document.title = 'Tiki Admin - ' + title;

  useEffect(() => {
    if ((!token || !dataAdmin) && isRedirect) return navigate(SCREEN_URL.ADMIN_LOGIN);
  }, []);

  return (
    <Stack direction="row">
      {isSidebar && <SidebarAdmin />}
      <Box sx={{ width: '100%', ml: isHeader && '280px' }}>
        {isHeader && <HeaderAdmin />}
        <Component />
      </Box>
    </Stack>
  );
};

export default LayoutAdminContainer;
