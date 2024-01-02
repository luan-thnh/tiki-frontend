import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { MESSAGES } from '../../../../constants/validate';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { forgotPassword } from '../../../../api/userApi';
import {
  Stack,
  Typography,
  Grid,
  Box,
  Paper,
  Checkbox,
  FormControlLabel,
  TextField,
  Button,
  CircularProgress,
} from '@mui/material';
import AlertMessage from '../../components/atoms/AlertMessage';
import * as yup from 'yup';
import './styles.scss';
import Loading from '../../../../components/Loading';

const schema = yup
  .object({
    email: yup.string().email(MESSAGES.INVALID_EMAIL).required(MESSAGES.EMAIL_REQUIRED),
  })
  .required();

function ForgotPasswordAdminPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
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

      const { email } = data;
      const usersRes = await dispatch(forgotPassword(email));

      if (usersRes.payload) {
        const { message, data } = usersRes.payload;

        if (message === 'Failed') {
          setIsLoading(false);
          setMessage({ isMessage: true, type: 'error', content: data });
          return;
        }

        if (message && message !== 'Failed') {
          setIsLoading(false);
          setIsDisabled(true);
          setMessage({ isMessage: true, type: 'success', content: 'Vui lòng kiểm tra email của bạn' });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Grid className="forgot-password" container component="main" sx={{ height: '100vh' }}>
      <Grid item xs={12} sm={8} md={6} component={Paper} elevation={6} square className="forgot-password__form">
        <Stack my={8} mx={8}>
          <Stack>
            <Typography variant="h5" style={{ fontWeight: 400 }}>
              Quên mật khẩu ?
            </Typography>
            <Typography>Vui lòng nhập thông tin tài khoản để lấy lại mật khẩu</Typography>
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

            <Button
              type="submit"
              disabled={!!errors.email || isDisabled}
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2, color: 'white' }}
            >
              {isLoading ? <CircularProgress size={24} color="white" /> : ' Gửi đi'}
            </Button>
          </Box>
        </Stack>
      </Grid>
      <Grid item xs={false} sm={4} md={6} className="forgot-password__background" />
      <AlertMessage
        open={message.isMessage}
        type={message.type}
        message={message.content}
        handleClose={handleCloseMessage}
      />
    </Grid>
  );
}

export default ForgotPasswordAdminPage;
