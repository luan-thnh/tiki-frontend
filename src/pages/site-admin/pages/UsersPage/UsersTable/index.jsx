import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { SCREEN_URL } from '../../../../../constants/screen';
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import { deleteUser, findAllUser, updateUser } from '../../../../../api/userApi';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import ModalRemove from '../../../components/molecules/ModalRemove';

export const UsersTable = (props) => {
  const { users, currentPage, itemsPerPage, handleChangePage, handleChangeRowsPerPage } = props;
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [roles, setRoles] = useState({});

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleClearSelected = () => {
    setSelectAll(false);
    setSelectedItems([]);
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    const allUserIds = users?.map((user) => user.id);

    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(allUserIds);
    }
  };

  const handleSelectItem = (itemId) => {
    const index = selectedItems.indexOf(itemId);
    if (index === -1) {
      setSelectedItems([...selectedItems, itemId]);
    } else {
      const updatedItems = [...selectedItems];
      updatedItems.splice(index, 1);
      setSelectedItems(updatedItems);
    }
  };

  const handleRemoveUser = () => {
    selectedItems.forEach(async (userId) => {
      const res = await dispatch(deleteUser(userId));

      if (res?.payload && res?.payload?.message) await dispatch(findAllUser());
    });
    handleClose();
    handleClearSelected();
  };

  const handleChangeRole = (e, uuid) => {
    const value = e.target.value;

    // // Update the roles state
    // setRoles((prevRoles) => ({
    //   ...prevRoles,
    //   [uuid]: value,
    // }));

    // Dispatch the update to the store
    dispatch(updateUser({ uuid, role: Number(value) }));
  };

  return (
    <Card>
      <Box sx={{ minWidth: 800 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'rgba(0, 0, 0, 0.045)' }}>
              <TableCell padding="checkbox">
                <Checkbox checked={selectAll} onChange={handleSelectAll} />
              </TableCell>
              {selectedItems.length > 0 ? (
                <>
                  <TableCell style={{ padding: '10px 12px' }}>
                    <Stack gap={1} direction="row" alignItems="center">
                      <Typography mr={1}>Đã chọn {selectedItems.length}</Typography>
                      <Typography>|</Typography>
                      <IconButton color="black" onClick={handleOpen}>
                        <DeleteOutlineOutlinedIcon />
                      </IconButton>
                    </Stack>
                  </TableCell>
                  <TableCell style={{ padding: 0 }}></TableCell>
                  <TableCell style={{ padding: 0 }}></TableCell>
                  <TableCell style={{ padding: 0 }}></TableCell>
                  <TableCell style={{ padding: 0 }}></TableCell>
                  <TableCell style={{ padding: '10px 16px', textAlign: 'center' }}></TableCell>
                </>
              ) : (
                <>
                  <TableCell>Tên</TableCell>
                  <TableCell>Địa chỉ</TableCell>
                  <TableCell>Điện thoại</TableCell>
                  <TableCell>Vai trò</TableCell>
                  <TableCell>Thời gian cập nhập</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>Chức năng</TableCell>
                </>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {users?.map(({ uuid, username, fullName, avatar, email, role, address, phoneNumber, createdAt }) => (
              <TableRow key={uuid} hover selected={selectedItems.includes(uuid)}>
                <TableCell padding="checkbox">
                  <Checkbox checked={selectedItems.includes(uuid)} onChange={() => handleSelectItem(uuid)} />
                </TableCell>
                <TableCell>
                  <Stack alignItems="center" direction="row" spacing={2}>
                    <Avatar src={avatar}>C</Avatar>
                    <Stack>
                      <Typography variant="subtitle2">{fullName || username}</Typography>
                      <Typography variant="body2" style={{ color: '#777' }}>
                        {email}
                      </Typography>
                    </Stack>
                  </Stack>
                </TableCell>
                <TableCell>{address}</TableCell>
                <TableCell>{phoneNumber}</TableCell>
                <TableCell>
                  <FormControl sx={{ m: 1, minWidth: 120 }}>
                    <Select
                      value={roles[uuid] || role || ''}
                      onChange={(e) => handleChangeRole(e, uuid)}
                      displayEmpty
                      inputProps={{ 'aria-label': 'Without label' }}
                      sx={{ borderRadius: 999 }}
                    >
                      <MenuItem value={1}>Quản trị viên</MenuItem>
                      <MenuItem value={2}>Khách hàng</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>{createdAt}</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                  <IconButton color="black" component={Link} to={SCREEN_URL.ADMIN_EDIT_USER.replace(':userId', uuid)}>
                    <CreateOutlinedIcon />
                  </IconButton>
                  <IconButton color="black" component={Link} to={SCREEN_URL.ADMIN_DETAIL_USER.replace(':userId', uuid)}>
                    <ArrowForwardRoundedIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      <TablePagination
        component="div"
        count={users?.length}
        page={currentPage}
        rowsPerPage={itemsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <ModalRemove
        open={open}
        selectedItems={selectedItems}
        handleClose={handleClose}
        handleRemove={handleRemoveUser}
      />
    </Card>
  );
};

UsersTable.propTypes = {};
