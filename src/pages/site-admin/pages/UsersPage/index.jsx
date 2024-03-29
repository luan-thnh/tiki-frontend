import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { SCREEN_URL } from '../../../../constants/screen';
import { UsersTable } from './UsersTable';
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
import { findAllUser } from '../../../../api/userApi';
import { addSelectedValue } from '../../../../redux/slice/userSlice';
import SearchIcon from '@mui/icons-material/Search';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import Loading from '../../../../components/Loading';
import UploadIcon from '@mui/icons-material/Upload';
import AddIcon from '@mui/icons-material/Add';
import * as XLSX from 'xlsx';

UsersPage.propTypes = {};

function UsersPage() {
  const users = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const [search, setSearch] = useState('');
  const [params, setParams] = useState({
    page: 1,
    limit: 5,
    sortByName: 'asc',
  });

  useEffect(() => {
    dispatch(findAllUser(params));
  }, [params]);

  const handleExportFile = () => {
    var wb = XLSX.utils.book_new(),
      ws = XLSX.utils.json_to_sheet(users.data);
    XLSX.utils.book_append_sheet(wb, ws, 'MySheet1');
    XLSX.writeFile(wb, 'MyExcel.xlsx');
  };

  const handleImportFile = (e) => {
    const reader = new FileReader();
    reader.readAsBinaryString(e.target.files[0]);
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet);
      console.log(parsedData);
      return parsedData;
    };
  };

  const handleSearchUser = (e) => setSearch(e.target.value);
  const handleFilterProductBySelect = (e) => {
    const [sortKey, sortOrder] = e.target.value.split('|');

    setParams((prev) => ({ ...prev, [sortKey]: sortOrder }));
    dispatch(addSelectedValue(e.target.value));
  };

  const usersFilter = useMemo(() => {
    let filteredUsers = users?.data?.filter(
      (user) =>
        search === '' ||
        user.fullName.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    );

    return filteredUsers;
  }, [search, users]);

  const handleChangePage = (event, newPage) => {
    setParams((prev) => ({ ...prev, page: newPage }));
  };

  const handleChangeRowsPerPage = (event) => {
    setParams((prev) => ({ ...prev, page: 1, limit: parseInt(event.target.value, 10) }));
  };

  return (
    <div>
      {users.isLoading ? (
        <Loading />
      ) : (
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
                  <Typography variant="h4">Quản lý Người dùng</Typography>
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
                  to={SCREEN_URL.ADMIN_CREATE_USER}
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
                    placeholder="Search customer"
                    onChange={handleSearchUser}
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
                    defaultValue={users?.selectedValue}
                    onChange={handleFilterProductBySelect}
                  >
                    <MenuItem value="sortByName|asc">Sắp xếp theo tăng dần (A-Z)</MenuItem>
                    <MenuItem value="sortByName|desc">Sắp xếp theo giảm dần (Z-A)</MenuItem>
                    <MenuItem value="sortByDate|newest">Cập nhật lần cuối (Mới nhất)</MenuItem>
                    <MenuItem value="sortByDate|oldest">Cập nhật lần cuối (Cũ nhất)</MenuItem>
                  </TextField>
                </Stack>
                <UsersTable
                  users={usersFilter}
                  currentPage={params?.page - 1}
                  itemsPerPage={params?.limit}
                  handleChangePage={handleChangePage}
                  handleChangeRowsPerPage={handleChangeRowsPerPage}
                />
              </Card>
            </Stack>
          </Container>
        </Box>
      )}
    </div>
  );
}

export default UsersPage;
