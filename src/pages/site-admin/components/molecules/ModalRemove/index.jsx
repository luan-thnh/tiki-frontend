import React from 'react';
import { Backdrop, Box, Button, Grow, Modal, Paper, Stack, Typography } from '@mui/material';
import warningIcon from '../../../../../assets/images/warning-icon.png';

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

function ModalRemove(props) {
  const { open, title = 'Bạn có chắc chắn muốn xoá không?', handleClose, handleRemove } = props;

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
          <Stack alignItems="center" gap={2}>
            <img src={warningIcon} alt="" width={100} />
            <Typography id="transition-modal-title" variant="h6" component="h2">
              {title}
            </Typography>
          </Stack>
          <Stack direction="row" justifyContent="center" mt={3} gap={3}>
            <Button variant="contained" color="gray" style={{ color: 'white' }} onClick={handleClose}>
              Thoát
            </Button>
            <Button variant="contained" color="red" style={{ color: 'white' }} onClick={handleRemove}>
              Đồng ý
            </Button>
          </Stack>
        </Box>
      </Grow>
    </Modal>
  );
}

export default ModalRemove;
