import React, { useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  Container,
  InputAdornment,
  MenuItem,
  OutlinedInput,
  Paper,
  Stack,
  SvgIcon,
  TextField,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import UploadIcon from '@mui/icons-material/Upload';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';
import { SCREEN_URL } from '../../../../constants/screen';
import * as XLSX from 'xlsx';
import { useDispatch, useSelector } from 'react-redux';
import { ProductsTable } from './ProductsTable';
import { useState } from 'react';
import { useMemo } from 'react';
import moment from 'moment/moment';
import { findAllProduct, findAllProductByName } from '../../../../api/productApi';
import { addSelectedValue } from '../../../../redux/slice/productSlice';
import { useDebounce } from '../../../../hooks/useDebounce';

ProductPage.propTypes = {};

function ProductPage() {
  const products = useSelector((state) => state.products);
  const dispatch = useDispatch();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const [params, setParams] = useState({
    page: 1,
    limit: 5,
    sortByName: 'asc',
  });

  useEffect(() => {
    dispatch(findAllProduct(params));
  }, [dispatch, params]);

  useEffect(() => {
    if (search.trim()) {
      setParams({ ...params, productName: debouncedSearch });
    } else {
      setParams({ ...params, productName: '' });
    }
  }, [debouncedSearch]);

  const handleExportFile = () => {
    var wb = XLSX.utils.book_new(),
      ws = XLSX.utils.json_to_sheet(products);
    XLSX.utils.book_append_sheet(wb, ws, 'product');
    XLSX.writeFile(wb, 'product_excel.xlsx');
  };

  const handleImportFile = (e) => {
    const reader = new FileReader();
    reader.readAsBinaryString(e.target.files[0]);
    reader.onload = async (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet);
      return parsedData;
    };
  };

  const handleSearchProduct = (e) => setSearch(e.target.value);
  const handleFilterProductBySelect = (e) => {
    const [sortKey, sortOrder] = e.target.value.split('|');

    console.log(sortOrder);

    setParams((prev) => ({ ...prev, [sortKey]: sortOrder }));
    dispatch(addSelectedValue(e.target.value));
  };
  const handleChangePage = (event, newPage) => {
    setParams((prev) => ({ ...prev, page: newPage }));
  };

  const handleChangeRowsPerPage = (event) => {
    setParams((prev) => ({ ...prev, page: 1, limit: parseInt(event.target.value, 10) }));
  };

  // const productsFilter = useMemo(() => {
  //   let filteredProducts = products.data.filter(
  //     (product) => search === '' || product.productName.trim().toLowerCase().startsWith(search.toLowerCase())
  //     // product.categoryName.toLowerCase().includes(search.toLowerCase())
  //   );

  //   return filteredProducts;
  // }, [search, products]);

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >
      <Container maxWidth="xl">
        <Stack spacing={3}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={4}>
            <Stack spacing={1}>
              <Typography variant="h4">Quản lý Sản phẩm</Typography>
              <Stack alignItems="center" direction="row" spacing={1}>
                <Button
                  color="inherit"
                  component="label"
                  startIcon={
                    <SvgIcon fontSize="small">
                      <UploadIcon />
                    </SvgIcon>
                  }
                >
                  Import
                  <input type="file" hidden onChange={handleImportFile} />
                </Button>
                <Button
                  color="inherit"
                  filename="users table"
                  sheet="users"
                  onClick={handleExportFile}
                  startIcon={
                    <SvgIcon fontSize="small">
                      <FileDownloadIcon />
                    </SvgIcon>
                  }
                >
                  Export
                </Button>
              </Stack>
            </Stack>
            <Button
              component={Link}
              to={SCREEN_URL.ADMIN_CREATE_PRODUCT}
              startIcon={
                <SvgIcon fontSize="small">
                  <AddIcon />
                </SvgIcon>
              }
              variant="contained"
            >
              Thêm
            </Button>
          </Stack>
          <Card sx={{ borderRadius: 5 }} component={Paper} elevation={3}>
            <Stack sx={{ p: 2 }} direction="row" justifyContent="space-between">
              <OutlinedInput
                fullWidth
                placeholder="Tìm kiếm sản phẩm"
                onChange={handleSearchProduct}
                value={search}
                startAdornment={
                  <InputAdornment position="start">
                    <SvgIcon color="action" fontSize="small">
                      <SearchIcon />
                    </SvgIcon>
                  </InputAdornment>
                }
                sx={{ maxWidth: 800, borderRadius: 3, mb: 2 }}
              />
              <TextField
                id="outlined-select-currency"
                sx={{
                  width: 250,
                  borderRadius: 3,
                  '.MuiInputBase-root': {
                    borderRadius: '10px',
                  },
                }}
                select
                label="Select"
                value={products?.selectedValue}
                onChange={handleFilterProductBySelect}
              >
                <MenuItem value="sortByName|asc">Sắp xếp theo tăng dần (A-Z)</MenuItem>
                <MenuItem value="sortByName|desc">Sắp xếp theo giảm dần (Z-A)</MenuItem>
                <MenuItem value="sortByDate|newest">Cập nhật lần cuối (Mới nhất)</MenuItem>
                <MenuItem value="sortByDate|oldest">Cập nhật lần cuối (Cũ nhất)</MenuItem>
              </TextField>
            </Stack>
            <ProductsTable
              products={products.data}
              currentPage={params?.page - 1}
              itemsPerPage={params?.limit}
              handleChangePage={handleChangePage}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </Card>
        </Stack>
      </Container>
    </Box>
  );
}

export default ProductPage;
