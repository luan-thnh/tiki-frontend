import React, { useState } from 'react';
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Grow,
  Modal,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { MESSAGES } from '../../../../../../constants/validate';
import { useDispatch } from 'react-redux';
import { forgotPassword } from '../../../../../../api/userApi';

const style = {
  position: 'absolute',
  top: '30%',
  left: '40%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  borderRadius: 3,
  boxShadow: 24,
  p: 4,
};

const schema = yup
  .object({
    email: yup.string().email(MESSAGES.INVALID_EMAIL).required(MESSAGES.EMAIL_REQUIRED),
  })
  .required();

function ModalSendEmail(props) {
  const { open, handleClose } = props;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
  });

  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [message, setMessage] = useState({
    isMessage: false,
    type: 'error',
    content: '',
  });

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
          handleClose();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Grow direction="down" in={open} timeout={450}>
        <Box component={Paper} elevation={3} sx={style}>
          <Stack alignItems="center" gap={2} component="form" onSubmit={handleSubmit(handleOnSubmit)}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Quên mật khẩu ?
            </Typography>
            <Typography>Vui lòng nhập thông tin tài khoản để lấy lại mật khẩu</Typography>
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
          </Stack>
          <Stack direction="row" justifyContent="center" mt={3} gap={3}>
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
          </Stack>
        </Box>
      </Grow>
    </Modal>
  );
}

export default ModalSendEmail;
