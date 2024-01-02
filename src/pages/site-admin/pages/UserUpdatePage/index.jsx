import React, { useEffect, useState } from 'react';
import theme from '../../../../theme';
import AddAPhotoOutlinedIcon from '@mui/icons-material/AddAPhotoOutlined';
import BackButtonLink from '../../components/atoms/BackButtonLink';
import Input from '../../components/atoms/Input';
import Loading from '../../../../components/Loading';
import moment from 'moment/moment';
import generatePassword from '../../../../utils/generatePassword';
import validateField from '../../../../utils/validateField';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Card,
  Radio,
  Stack,
  Paper,
  Switch,
  Button,
  Avatar,
  FormLabel,
  RadioGroup,
  Typography,
  FormControlLabel,
} from '@mui/material';
import { addUser, findImageToUploadAvatar, findUserById, updateUser } from '../../../../api/userApi';
import { SCREEN_URL } from '../../../../constants/screen';
import { v4 as uuidv4 } from 'uuid';
import { IMAGE_URL } from '../../../../constants/images';

function UserUpdatePage() {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users);
  const navigate = useNavigate();
  const { userId } = useParams();

  console.log(userId);

  const [user, setUser] = useState({
    uuid: uuidv4(),
    username: generatePassword(),
    fullName: '',
    email: '',
    password: generatePassword(),
    country: '',
    state: '',
    address: '',
    phone: '',
    dayOfBirth: '2023-01-01',
    gender: 1,
    avatar: IMAGE_URL.AVATAR_DEFAULT,
    isPublic: 2,
  });
  const [errorMessage, setErrorMessage] = useState({
    fullName: '',
    email: '',
    address: '',
    phone: '',
  });
  const [avatar, setAvatar] = useState();
  const [imageUpload, setImageUpload] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleOnChange = (e) => {
    const { name, value, checked } = e.target;

    setErrorMessage((prevErrors) => ({
      ...prevErrors,
      [name]: validateField(value, name),
    }));

    setUser((prevUser) => ({
      ...prevUser,
      [name]: name === 'isPublic' ? checked : value,
    }));
  };

  const handleSubmit = () => {
    const fieldsToValidate = ['fullName', 'email', 'address', 'phone'];

    const newErrors = {};
    for (const key of fieldsToValidate) {
      const error = validateField(user[key], key);
      newErrors[key] = error;
    }

    setErrorMessage(newErrors);

    const hasErrors = Object.values(newErrors).some((error) => error !== '');

    if (!hasErrors) {
      userId ? dispatch(updateUser({ ...user, updatedAt: moment().format() })) : dispatch(addUser(user));
      navigate(-1);
      console.log('Form submitted successfully');
    } else {
      console.log('Form has errors');
    }
  };

  useEffect(() => {
    if (userId && users.user) {
      setUser(users.user);
    } else if (userId) {
      dispatch(findUserById(userId));
    }
  }, [userId, users.user]);

  console.log(users.user);

  return isLoading || users.isLoading ? (
    <Loading />
  ) : (
    <Stack>
      <BackButtonLink linkTo={SCREEN_URL.ADMIN_USERS} />
      <Stack direction="row" mx={3} my={4} alignItems="center" gap={2} flex={1}>
        {userId ? (
          <Stack direction="row" alignItems="center" gap={2}>
            <Avatar sx={{ width: 62, height: 62 }} src={user.avatar}>
              {user.fullName}
            </Avatar>
            <Stack gap={1}>
              <Typography variant="h4">{user.email}</Typography>
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
                  {user.uuid}
                </span>
              </Typography>
            </Stack>
          </Stack>
        ) : (
          <>
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
              <img src={avatar?.preview || user.avatar} alt="" style={{ width: 80, height: 80, objectFit: 'cover' }} />
              <input type="file" hidden onChange={handlePreviewAvatar} />
              <Stack
                className="icon"
                justifyContent="center"
                alignItems="center"
                sx={{
                  width: 80,
                  height: 80,
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
              style={{
                backgroundColor: 'transparent',
                boxShadow: 'none',
                width: 'fit-content',
                height: 38,
                padding: '10px',
              }}
              variant="contained"
              onClick={handleUploadImage}
            >
              Thay đổi
            </Button>
          </>
        )}
      </Stack>
      <Card component={Paper} elevation={3} sx={{ borderRadius: 5, mx: 3, p: 3 }}>
        <Typography
          variant="h6"
          style={{ fontWeight: 600, color: theme.palette.black.main, textTransform: 'capitalize', paddingBottom: 16 }}
        >
          {userId ? 'Cập nhật' : 'Tạo'} thông tin người dùng
        </Typography>

        <Box>
          <Stack direction="row" gap={2} my={2}>
            <Input
              label="Họ và tên"
              name="fullName"
              required={true}
              value={user.fullName}
              onChange={handleOnChange}
              helperText={errorMessage.fullName}
              error={!!errorMessage.fullName}
            />
            <Input
              label="Email"
              name="email"
              required={true}
              value={user.email}
              onChange={handleOnChange}
              helperText={errorMessage.email}
              error={!!errorMessage.email}
            />
          </Stack>
          <Stack direction="row" gap={2} my={2}>
            <Input label="Quốc gia" name="country" value={user.country} onChange={handleOnChange} />
            <Input label="Thành phố" name="state" value={user.state} onChange={handleOnChange} />
          </Stack>
          <Stack direction="row" gap={2} my={2}>
            <Input
              label="Địa chỉ"
              name="address"
              required={true}
              value={user.address}
              onChange={handleOnChange}
              helperText={errorMessage.address}
              error={!!errorMessage.address}
            />
            <Input
              label="Số điện thoại"
              name="phone"
              required={true}
              value={user.phone}
              onChange={handleOnChange}
              helperText={errorMessage.phone}
              error={!!errorMessage.phone}
            />
          </Stack>
          <Stack direction="row" gap={2} my={2}>
            <Box style={{ flex: 1 }}>
              <Input
                label="Ngày sinh"
                name="dayOfBirth"
                type="date"
                value={user.dayOfBirth}
                onChange={handleOnChange}
              />
            </Box>
            <Stack direction="row" alignItems="center" gap={2} style={{ flex: 1 }}>
              <FormLabel id="demo-row-radio-buttons-group-label">Giới tính:</FormLabel>
              <RadioGroup row value={user.gender} onChange={handleOnChange} name="gender">
                <FormControlLabel value="1" control={<Radio />} label="Nữ" />
                <FormControlLabel value="2" control={<Radio />} label="Nam" />
                <FormControlLabel value="3" control={<Radio />} label="Khác" />
              </RadioGroup>
            </Stack>
          </Stack>
        </Box>

        <Stack direction="row" my={3} justifyContent="space-between">
          <Stack gap={1}>
            <Typography variant="h6" style={{ fontWeight: 500 }}>
              Công khai thông tin liên hệ
            </Typography>
            <Typography style={{ color: theme.palette.gray.main, fontSize: 14 }}>
              Bất kỳ ai xem hồ sơ của bạn đều có thể xem chi tiết liên hệ của bạn
            </Typography>
          </Stack>
          <Switch
            name="isPublic"
            checked={user.isPublic}
            onChange={handleOnChange}
            inputProps={{ 'aria-label': 'controlled' }}
          />
        </Stack>

        <Stack display="inline-flex" direction="row" gap={2}>
          <Button variant="contained" onClick={handleSubmit}>
            {userId ? 'Cập nhật' : 'Tạo'}
          </Button>
          <Button component={Link} color="black" variant="contained" to={SCREEN_URL.ADMIN_USERS}>
            Thoát
          </Button>
        </Stack>
      </Card>
    </Stack>
  );
}

export default UserUpdatePage;
