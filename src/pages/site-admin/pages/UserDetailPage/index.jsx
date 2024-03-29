import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { findUserById } from '../../../../api/userApi';
import { Avatar, Box, Button, Stack, Tab, Tabs, Typography } from '@mui/material';
import { SCREEN_URL } from '../../../../constants/screen';
import BackButtonLink from '../../components/atoms/BackButtonLink';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import InfoUser from './InfoUser';
import HistoryOrder from './HistoryOrder';

function UserDetailPage(props) {
  const dispatch = useDispatch();
  const { userId } = useParams();

  const [user, setUser] = useState({});
  const [tab, setTab] = useState(0);

  const handleChange = (e, value) => {
    setTab(value);
  };

  useEffect(() => {
    const getUser = async () => {
      const res = await dispatch(findUserById(userId));

      const { data } = res.payload;
      setUser(data);
    };

    getUser();
  }, [userId]);

  return (
    <Stack>
      <BackButtonLink linkTo={SCREEN_URL.ADMIN_USERS} />
      <Stack direction="row" mx={3} my={4} alignItems="center" justifyContent="space-between" gap={2} flex={1}>
        <Stack direction="row" alignItems="center" gap={2}>
          <Avatar sx={{ width: 62, height: 62 }} src={user?.avatar} />
          <Stack gap={1}>
            <Typography variant="h4">{user?.email}</Typography>
            <Typography variant="body2">
              <span style={{ fontWeight: 600 }}>user_id:</span>
              <span
                style={{
                  margin: '0 8px',
                  padding: '2px 8px',
                  borderRadius: 999,
                  backgroundColor: 'rgba(17, 25, 39, 0.12)',
                }}
              >
                {user?.uuid}
              </span>
            </Typography>
          </Stack>
        </Stack>
        <Button
          component={Link}
          color="black"
          to={SCREEN_URL.ADMIN_EDIT_USER.replace(':userId', userId)}
          variant="contained"
        >
          <Stack direction="row" gap={1}>
            Sửa <EditOutlinedIcon style={{ fontSize: '20px' }} />
          </Stack>
        </Button>
      </Stack>

      <Box mx={3} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={tab}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons={false}
          aria-label="basic tabs example"
        >
          <Tab label="Chi tiết" sx={{ textTransform: 'capitalize' }} />
          <Tab label="Lịch sử" sx={{ textTransform: 'capitalize' }} />
        </Tabs>
      </Box>
      <Stack>
        {tab === 0 && <InfoUser user={user} />}
        {tab === 1 && <HistoryOrder />}
      </Stack>
    </Stack>
  );
}

export default UserDetailPage;
