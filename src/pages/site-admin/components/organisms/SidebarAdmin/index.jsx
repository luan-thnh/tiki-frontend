import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { SCREEN_URL } from '../../../../../constants/screen';
import { Divider, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Stack, Typography } from '@mui/material';
import LogoTiki from '../../../../../assets/images/logo-tiki.png';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useSelector } from 'react-redux';

SidebarAdmin.propTypes = {};

const menuItems = [
  {
    icon: <SignalCellularAltIcon color="white" />,
    iconActive: <SignalCellularAltIcon color="primary" />,
    title: 'Tổng quan',
    url: SCREEN_URL.ADMIN_HOME,
  },
  {
    icon: <GroupIcon color="white" />,
    iconActive: <GroupIcon color="primary" />,
    title: 'Người dùng',
    url: SCREEN_URL.ADMIN_USERS,
    name: 'user',
  },
  {
    icon: <LocalMallIcon color="white" />,
    iconActive: <LocalMallIcon color="primary" />,
    title: 'Sản phẩm',
    url: SCREEN_URL.ADMIN_PRODUCT,
    name: 'product',
  },
  {
    icon: <ShoppingCartIcon color="white" />,
    iconActive: <ShoppingCartIcon color="primary" />,
    title: 'Đơn hàng',
    url: SCREEN_URL.ADMIN_ORDER,
    name: 'order',
  },
  {
    icon: <PersonIcon color="white" />,
    iconActive: <PersonIcon color="primary" />,
    title: 'Tài khoản',
    url: SCREEN_URL.ADMIN_ACCOUNT,
    name: 'account',
  },
  {
    icon: <SettingsIcon color="white" />,
    iconActive: <SettingsIcon color="primary" />,
    title: 'Cài đặt',
    url: SCREEN_URL.ADMIN_SETTINGS,
    name: 'setting',
  },
];

function SidebarAdmin() {
  const location = useLocation();
  const user = useSelector((state) => state.users.userCurrent);

  const activeIndex = menuItems.findIndex((menuItem) => {
    if (menuItem.url === SCREEN_URL.ADMIN_HOME) {
      return location.pathname === menuItem.url;
    } else {
      return location.pathname.includes(menuItem.name);
    }
  });

  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Drawer variant="permanent" open={open}>
      <Stack bgcolor="#1c2536" width={280} minHeight="100vh">
        <Stack m={3} gap={3}>
          <Stack direction="row" alignItems="end">
            <img src={LogoTiki} alt="" width={64} />
            <Typography variant="h6" color="#fff" lineHeight="1">
              Admin
            </Typography>
          </Stack>
          <Stack
            bgcolor="rgba(255,255,255,0.04)"
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            borderRadius={3}
            color="#fff"
            sx={{
              p: '12px',
            }}
          >
            <Stack gap={1}>
              <Typography variant="h6" fontWeight="700">
                {user.fullName || user.username}
              </Typography>
              <Typography color="#ccc">Production</Typography>
            </Stack>
            <UnfoldMoreIcon />
          </Stack>
        </Stack>
        <Divider color="#555" />
        <List>
          {menuItems.map((menuItem, index) => (
            <ListItemButton
              key={index}
              component={NavLink}
              to={menuItem.url}
              style={({ isActive }) => {
                return {
                  fontWeight: isActive || activeIndex === index ? 'bold' : '',
                  color: isActive || activeIndex === index ? '#fff' : '#ccc',
                };
              }}
            >
              <ListItemIcon>{activeIndex === index ? menuItem.iconActive : menuItem.icon}</ListItemIcon>
              <ListItemText
                primary={menuItem.title}
                sx={{ '.MuiTypography-root': { fontWeight: activeIndex === index ? 600 : 400 } }}
              />
            </ListItemButton>
          ))}
        </List>
      </Stack>
    </Drawer>
  );
}

export default SidebarAdmin;
