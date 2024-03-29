import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Card,
  Checkbox,
  IconButton,
  Paper,
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
import { deleteProduct, findAllProduct } from '../../../../../api/productApi';
import Loading from '../../../../../components/Loading';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import ModalRemove from '../../../components/molecules/ModalRemove';

export const ProductsTable = (props) => {
  const { products, currentPage, itemsPerPage, handleChangePage, handleChangeRowsPerPage } = props;

  const { isLoading } = useSelector((state) => state.products);
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleClearSelected = () => {
    setSelectAll(false);
    setSelectedItems([]);
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    const allProductIds = products?.map((user) => user.productId);

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
    selectedItems.forEach((productId) => {
      dispatch(deleteProduct(productId));
    });
    handleClose();
    handleClearSelected();
  };

  useEffect(() => {
    dispatch(findAllProduct());
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
                  <TableCell>Tên sản phẩm</TableCell>
                  <TableCell>Số lượng</TableCell>
                  <TableCell>Giá</TableCell>
                  <TableCell>Danh mục</TableCell>
                  <TableCell>Tên shop</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>Chức năng</TableCell>
                </>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {products
              ?.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
              ?.map(({ productId, productName, limitProduct, thumbnailUrl, priceOdd, shopName, categoryName }) => (
                <TableRow key={productId} hover>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedItems.includes(productId)}
                      onChange={() => handleSelectItem(productId)}
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" alignItems="center" gap={2}>
                      <img
                        src={thumbnailUrl}
                        alt={productName}
                        width={48}
                        height={48}
                        style={{ objectFit: 'cover', borderRadius: '10px' }}
                      />
                      <span
                        style={{
                          width: 150,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {productName}
                      </span>
                    </Stack>
                  </TableCell>
                  <TableCell>{limitProduct}</TableCell>
                  <TableCell>{priceOdd.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</TableCell>
                  <TableCell>{categoryName}</TableCell>
                  <TableCell>
                    <span
                      style={{
                        width: 150,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {shopName}
                    </span>
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    <IconButton
                      color="black"
                      component={Link}
                      to={`${SCREEN_URL.ADMIN_EDIT_PRODUCT.replace(':productId', productId)}`}
                    >
                      <CreateOutlinedIcon />
                    </IconButton>
                    <IconButton
                      color="black"
                      component={Link}
                      to={SCREEN_URL.ADMIN_DETAIL_USER.replace(':userId', productId)}
                    >
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
        count={products?.length}
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

ProductsTable.propTypes = {};
