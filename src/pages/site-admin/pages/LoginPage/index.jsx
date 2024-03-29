import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { MESSAGES } from '../../../../constants/validate';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../../../../api/userApi';
import { addUserCurrent } from '../../../../redux/slice/userSlice';
import { SCREEN_URL } from '../../../../constants/screen';
import { blue } from '@mui/material/colors';
import { Stack, Typography, Grid, Box, Paper, Checkbox, FormControlLabel, TextField, Button } from '@mui/material';
import AlertMessage from '../../components/atoms/AlertMessage';
import * as yup from 'yup';
import './styles.scss';

const schema = yup
  .object({
    email: yup.string().email(MESSAGES.INVALID_EMAIL).required(MESSAGES.EMAIL_REQUIRED),
    password: yup.string().required(MESSAGES.PASSWORD_REQUIRED).min(8, MESSAGES.INVALID_PASSWORD),
  })
  .required();

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [error, setError] = useState({
    isError: false,
    message: '',
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
  });

  const handleCloseMessage = (e, reason) => {
    if (reason === 'clickaway') return;

    setError({ ...error, isError: false });
  };

  const handleOnSubmit = async (data) => {
    try {
      const { email, password } = data;
      const usersRes = await dispatch(login({ email, password }));

      if (usersRes.payload) {
        const { message, data } = usersRes.payload;

        if (message === 'Failed') {
          setError({ isError: true, message: data });
          return;
        }

        const { token, uuid, avatar, email, username, fullName, role } = data;

        if (role === 2) {
          navigate(SCREEN_URL.ADMIN_LOGIN);
          setError({ isError: true, message: 'Bạn không được phép thực hiện hành động này' });
          return;
        }

        dispatch(
          addUserCurrent({
            token,
            dataUser: { id: uuid, avatar, email, username, fullName, role: role === 1 ? 'admin' : 'public' },
          })
        );
        navigate(SCREEN_URL.ADMIN_PRODUCT);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Grid className="login" container component="main" sx={{ height: '100vh' }}>
      <Grid item xs={false} sm={4} md={6} className="login__background" />
      <Grid item xs={12} sm={8} md={6} component={Paper} elevation={6} square className="login__form">
        <Stack my={8} mx={8}>
          <Stack>
            <Typography variant="h5" style={{ fontWeight: 400 }}>
              Xin chào Admin,
            </Typography>
            <Typography>Đăng Nhập</Typography>
          </Stack>
          <Box component="form" onSubmit={handleSubmit(handleOnSubmit)} sx={{ mt: 1 }}>
            <TextField
              variant="standard"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              error={!!errors.email}
              helperText={errors.email?.message || ''}
              {...register('email')}
            />
            <TextField
              variant="standard"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Mật khẩu"
              type="password"
              id="password"
              autoComplete="current-password"
              error={!!errors.password}
              helperText={errors.password?.message || ''}
              {...register('password')}
            />
            <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" />
            <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 2, color: 'white' }}>
              Đăng Nhập
            </Button>
            <Grid container>
              <Grid item xs>
                <Link to={SCREEN_URL.ADMIN_FORGOT_PASSWORD} style={{ color: blue[800] }}>
                  Quên mật khẩu?
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Stack>
      </Grid>
      <AlertMessage open={error.isError} type="error" message={error.message} handleClose={handleCloseMessage} />
    </Grid>
  );
}

export default LoginPage;
