import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  FormControl,
  IconButton,
  MenuItem,
  Paper,
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
import { Link } from 'react-router-dom';
import { SCREEN_URL } from '../../../../../constants/screen';
import { useEffect } from 'react';
import Loading from '../../../../../components/Loading';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import ModalRemove from '../../../components/molecules/ModalRemove';
import { findAllOrder, findRemoveOrderById } from '../../../../../api/orderApi';
import { formatPriceToK, formatPriceToVnd } from '../../../../../utils/formatPrice';
import moment from 'moment/moment';

export const OrdersTable = (props) => {
  const { orders, currentPage, itemsPerPage, handleChangePage, handleChangeRowsPerPage } = props;

  const { isLoading } = useSelector((state) => state.orders);
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [status, setStatus] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleClearSelected = () => {
    setSelectAll(false);
    setSelectedItems([]);
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    const allProductIds = orders?.map((order) => order.id);

    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(allProductIds);
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

  const handleRemoveProduct = () => {
    selectedItems.forEach((orderId) => {
      dispatch(findRemoveOrderById(orderId));
    });
    handleClose();
    handleClearSelected();
  };

  const handleChangeStatus = (e, id) => {
    const value = e.target.value;

    // Update the roles state
    console.log(value);
    setStatus((prev) => ({
      ...prev,
      [id]: value,
    }));

    // Dispatch the update to the store
    // dispatch(updateUser({ userId, role: Number(value) }));
  };

  useEffect(() => {
    dispatch(findAllOrder());
  }, []);

  return isLoading ? (
    <Loading />
  ) : (
    <Card component={Paper} elevation={3}>
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
                    <Stack component="span" gap={1} direction="row" alignItems="center">
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
                  <TableCell>Mã sản phẩm</TableCell>
                  <TableCell>Tên người đặt</TableCell>
                  <TableCell>Thời gian đặt</TableCell>
                  <TableCell>Tổng giá</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>Thời gian cập nhập</TableCell>
                  {/* <TableCell sx={{ textAlign: 'center' }}>Chức năng</TableCell> */}
                </>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {orders
              ?.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
              ?.map(({ id, avatar, username, email, orderTime, totalPrice, status, updatedAt }) => (
                <TableRow key={id} hover>
                  <TableCell padding="checkbox">
                    <Checkbox checked={selectedItems.includes(id)} onChange={() => handleSelectItem(id)} />
                  </TableCell>
                  <TableCell>{id}</TableCell>
                  <TableCell>
                    <Stack alignItems="center" direction="row" spacing={2}>
                      <Avatar src={avatar}>{username[0].toUpperCase()}</Avatar>
                      <Stack>
                        <Typography variant="subtitle2">{username}</Typography>
                        <Typography variant="body2" style={{ color: '#777' }}>
                          {email}
                        </Typography>
                      </Stack>
                    </Stack>
                  </TableCell>
                  <TableCell>{moment(orderTime).format('DD/MM/YYYY hh:mm:ss')}</TableCell>
                  <TableCell>{formatPriceToVnd(totalPrice)}</TableCell>
                  <TableCell>
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                      <Select
                        value={status}
                        onChange={(e) => handleChangeStatus(e, id)}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Without label' }}
                        sx={{ borderRadius: 999 }}
                      >
                        <MenuItem style={{ fontWeight: 500, color: 'orange' }} value="in cart">
                          Trong giỏ hàng
                        </MenuItem>
                        <MenuItem style={{ fontWeight: 500, color: 'rgb(17, 115, 75)' }} value="new orders">
                          Đơn hành mới
                        </MenuItem>
                        <MenuItem style={{ fontWeight: 500, color: 'rgb(10, 83, 168)' }} value="verified">
                          Đã xác thực
                        </MenuItem>
                        <MenuItem style={{ fontWeight: 500, color: 'rgb(33, 90, 108)' }} value="delivering">
                          Đang giao hàng
                        </MenuItem>
                        <MenuItem style={{ fontWeight: 500, color: 'rgb(90, 50, 134)' }} value="delivered">
                          Đã giao hàng
                        </MenuItem>
                        <MenuItem style={{ fontWeight: 500, color: 'rgb(17, 115, 75)' }} value="completed">
                          Hoàn tất
                        </MenuItem>
                        <MenuItem style={{ fontWeight: 500, color: 'rgb(177, 2, 2)' }} value="denied">
                          Bị từ chối
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>{moment(updatedAt).format('DD/MM/YYYY hh:mm:ss')}</TableCell>
                  {/* <TableCell sx={{ textAlign: 'center' }}>
                    <IconButton
                      color="black"
                      component={Link}
                      to={`${SCREEN_URL.ADMIN_EDIT_PRODUCT.replace(':orderId', id)}`}
                    >
                      <CreateOutlinedIcon />
                    </IconButton>
                    <IconButton color="black" component={Link} to={SCREEN_URL.ADMIN_DETAIL_USER.replace(':userId', id)}>
                      <ArrowForwardRoundedIcon />
                    </IconButton>
                  </TableCell> */}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Box>
      <TablePagination
        component="div"
        count={orders?.length}
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
        handleRemove={handleRemoveProduct}
      />
    </Card>
  );
};

OrdersTable.propTypes = {};
