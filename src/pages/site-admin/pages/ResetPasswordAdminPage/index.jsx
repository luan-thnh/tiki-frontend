import * as React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { MESSAGES } from '../../../../constants/validate';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { forgotPassword, redirectResetPassword, updatedResetPassword } from '../../../../api/userApi';
import { Stack, Typography, Grid, Box, Paper, TextField, Button, CircularProgress } from '@mui/material';
import AlertMessage from '../../components/atoms/AlertMessage';
import * as yup from 'yup';
import './styles.scss';
import { useEffect } from 'react';
import { SCREEN_URL } from '../../../../constants/screen';
import NotFoundPage from '../NotFoundPage';

const schema = yup
  .object({
    password: yup.string().required(MESSAGES.PASSWORD_REQUIRED).min(8, MESSAGES.INCORRECT_PASSWORD),
    confirmPassword: yup
      .string()
      .required(MESSAGES.CONFIRM_PASSWORD_REQUIRED)
      .oneOf([yup.ref('password'), null], MESSAGES.INCORRECT_MUST_MATCH_PASSWORD),
  })
  .required();

function ResetPasswordAdminPage() {
  const { userId, token } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [countdown, setCountdown] = useState(parseInt(localStorage.getItem('countdown')) || 120);
  const [isRunning, setIsRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState({
    isMessage: false,
    type: 'error',
    content: '',
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

    setMessage({ ...message, isMessage: false });
  };

  const handleOnSubmit = async (data) => {
    try {
      setIsLoading(true);

      const { password } = data;
      const res = await dispatch(updatedResetPassword({ userId, token, password }));

      if (res.payload) {
        const { message, data } = res.payload;

        if (message === 'Failed') {
          setMessage({ isMessage: true, type: 'error', content: data });
          return;
        }

        if (message && message !== 'Failed') {
          setIsLoading(false);
          setIsDisabled(true);
          setIsRunning((prevIsRunning) => !prevIsRunning);
          setMessage({ isMessage: true, type: 'success', content: 'Cập nhật thành công' });
          localStorage.removeItem('countdown');
          navigate(SCREEN_URL.ADMIN_LOGIN);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchApi = async () => {
      const res = await dispatch(redirectResetPassword({ userId, token }));

      if (res.payload) {
        const { message, data } = res.payload;

        if (message === 'Failed') {
          setIsError(true);
        }

        localStorage.setItem('countdown', '120');
      }
    };

    fetchApi();
  }, []);

  useEffect(() => {
    let timer;

    if (!isRunning && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      setIsDisabled(true);
      navigate(SCREEN_URL.ADMIN_FORGOT_PASSWORD);
      localStorage.removeItem('countdown');
    }

    return () => {
      clearInterval(timer);
    };
  }, [countdown, isRunning]);

  useEffect(() => {
    localStorage.setItem('countdown', countdown.toString());
  }, [countdown]);

  return isError ? (
    <NotFoundPage />
  ) : (
    <Grid className="reset-password" container component="main" sx={{ height: '100vh' }}>
      <Grid item xs={12} sm={8} md={6} component={Paper} elevation={6} square className="reset-password__form">
        <Stack my={8} mx={8}>
          <Stack>
            <Typography variant="h5" style={{ fontWeight: 400 }}>
              Tạo mật khẩu mới ?
            </Typography>
            <Typography>Vui lòng nhập mật khẩu mới của bạn</Typography>
          </Stack>
          <Box component="form" onSubmit={handleSubmit(handleOnSubmit)} sx={{ mt: 1 }}>
            <TextField
              variant="standard"
              margin="normal"
              required
              fullWidth
              id="password"
              label="Mật khẩu"
              name="password"
              autoComplete="password"
              autoFocus
              error={!!errors.password}
              helperText={errors.password?.message || ''}
              type="password"
              {...register('password')}
            />
            <TextField
              variant="standard"
              margin="normal"
              required
              fullWidth
              id="confirmPassword"
              label="Nhập lại mật khẩu"
              name="confirmPassword"
              autoComplete="confirmPassword"
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message || ''}
              {...register('confirmPassword')}
              type="password"
            />

            <Button
              type="submit"
              disabled={!!errors.confirmPassword || isDisabled}
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2, color: 'white' }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="white" />
              ) : (
                `Đặt lại (${Math.floor(countdown / 60) + ':' + (countdown % 60 < 10 ? '0' : '') + (countdown % 60)})`
              )}
            </Button>
          </Box>
        </Stack>
      </Grid>
      <Grid item xs={false} sm={4} md={6} className="reset-password__background" />
      <AlertMessage
        open={message.isMessage}
        type={message.type}
        message={message.content}
        handleClose={handleCloseMessage}
      />
    </Grid>
  );
}

export default ResetPasswordAdminPage;
