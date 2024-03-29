import React, { useState } from 'react';
import { Avatar, Button, Card, Divider, Paper, Stack, Typography } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { storage } from '../../../../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useDispatch } from 'react-redux';
import { deleteUser, findImageToUploadAvatar, updateUser } from '../../../../../api/userApi';
import { MESSAGES } from '../../../../../constants/validate';
import AddAPhotoOutlinedIcon from '@mui/icons-material/AddAPhotoOutlined';
import imageCompression from 'browser-image-compression';
import AlertMessage from '../../../components/atoms/AlertMessage';
import ModalRemove from '../../../components/molecules/ModalRemove';
import Loading from '../../../../../components/Loading';
import { useNavigate } from 'react-router-dom';
import { SCREEN_URL } from '../../../../../constants/screen';
import ModalSendEmail from './ModalSendEmail';

const labelInfo = [
  { fullName: 'Họ và tên' },
  { email: 'Email' },
  { phone: 'Số điện thoại' },
  { country: 'Quốc gia' },
  { state: 'Khu vực' },
  { address: 'Địa chỉ' },
];

function InfoUser(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = props;
  const [avatar, setAvatar] = useState();
  const [imageUpload, setImageUpload] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [openRemove, setOpenRemove] = useState(false);
  const [openPass, setOpenPass] = useState(false);
  const [message, setMessage] = useState({
    isMessage: false,
    content: '',
    type: 'success',
  });

  const handleOpenRemove = () => setOpenRemove(true);
  const handleCloseRemove = () => setOpenRemove(false);
  const handleOpenPass = () => setOpenPass(true);
  const handleClosePass = () => setOpenPass(false);

  const handlePreviewAvatar = (e) => {
    const file = e.target.files[0];

    file.preview = URL.createObjectURL(file);

    setAvatar(file);
    setImageUpload(file);
  };

  const handleUploadImage = async () => {
    if (imageUpload == null) return;

    const formData = new FormData();
    formData.append('userId', user?.uuid);
    formData.append('avatar', imageUpload);
    const res = await dispatch(findImageToUploadAvatar(formData));
  };

  const handleCloseMessage = (e, reason) => {
    if (reason === 'clickaway') return;
    setMessage({ ...message, isMessage: false });
  };

  const handleRemoveUser = () => {
    dispatch(deleteUser(user.id));
    handleCloseRemove();
    navigate(SCREEN_URL.ADMIN_USERS);
  };

  const handleResetPassword = () => {
    navigate(SCREEN_URL.ADMIN_FORGOT_PASSWORD);
  };

  return (
    <Stack px={3} py={5}>
      <Typography variant="h5" sx={{ m: 3, mt: 0, flex: 1 }}>
        Thông tin cơ bản
      </Typography>
      <Card component={Paper} elevation={3} sx={{ borderRadius: 5, mx: 3, px: 3 }}>
        <Stack direction="row" alignItems="center" py={3} gap={2}>
          <Stack
            component="label"
            sx={{
              cursor: 'pointer',
              borderRadius: 9999,
              outline: '1px dashed #ccc',
              outlineOffset: '4px',
              overflow: 'hidden',
              position: 'relative',

              '&:hover .icon': {
                display: 'flex',
              },
            }}
          >
            <Avatar sx={{ width: 60, height: 60, objectFit: 'cover' }} src={avatar?.preview || user.avatar} />
            <form>
              <input type="file" name="avatar" hidden onChange={handlePreviewAvatar} />
            </form>
            <Stack
              className="icon"
              justifyContent="center"
              alignItems="center"
              sx={{
                width: 60,
                height: 60,
                backgroundColor: 'rgba(0,0,0,0.25)',
                textAlign: 'center',
                position: 'absolute',
                display: 'none',
              }}
            >
              <Typography style={{ width: 50, fontWeight: 600, color: '#eee' }}>
                <AddAPhotoOutlinedIcon />
              </Typography>
            </Stack>
          </Stack>
          <Button
            color="black"
            variant="contained"
            onClick={handleUploadImage}
            style={{ width: 'fit-content', height: 38, padding: '10px' }}
          >
            Thay đổi
          </Button>
        </Stack>
        {labelInfo.map((obj, index) => {
          const key = Object.keys(obj)[0];
          const value = obj[key];

          return (
            <React.Fragment key={index}>
              <Stack direction="row" py={2}>
                <Typography style={{ width: 150, fontWeight: 600 }} variant="body2">
                  {value}
                </Typography>
                <Typography variant="body2">{user[key]}</Typography>
              </Stack>
              {index < labelInfo.length - 1 && <Divider />}
            </React.Fragment>
          );
        })}
      </Card>
      <Typography variant="h6" sx={{ m: 3, flex: 1 }}>
        Cài đặt lại mật khẩu
      </Typography>
      <Card component={Paper} elevation={3} sx={{ borderRadius: 5, mx: 3, p: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" py={2}>
          <Stack direction="row" alignItems="center">
            <Typography style={{ width: 150, fontWeight: 600 }} variant="body2">
              Mật khẩu
            </Typography>
            <Typography variant="body2">**** **** ****</Typography>
          </Stack>
          <Button variant="contained" color="primary" onClick={handleOpenPass}>
            Đặt lại
          </Button>
        </Stack>
      </Card>
      <Typography variant="h6" sx={{ m: 3, flex: 1 }}>
        Xoá tài khoản người dùng
      </Typography>
      <Card component={Paper} elevation={3} sx={{ borderRadius: 5, mx: 3, p: 3 }}>
        <Button variant="contained" color="red" onClick={handleOpenRemove}>
          Xoá tài khoản
        </Button>
      </Card>

      {message.isMessage && (
        <AlertMessage
          open={message.isMessage}
          type={message.type}
          message={message.content}
          handleClose={handleCloseMessage}
        />
      )}
      {openRemove && <ModalRemove open={openRemove} handleClose={handleCloseRemove} handleRemove={handleRemoveUser} />}
      {openPass && <ModalSendEmail open={openPass} handleClose={handleClosePass} />}
      {isLoading && <Loading />}
    </Stack>
  );
}

export default InfoUser;
