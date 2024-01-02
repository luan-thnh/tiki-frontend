import React, { useState } from 'react';
import { grey } from '@mui/material/colors';
import { useNavigate, useParams } from 'react-router-dom';
import { SCREEN_URL } from '../../../../constants/screen';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Divider, FormLabel, IconButton, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material';
import EditorDescription from './EditorDescription';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import BackButtonLink from '../../components/atoms/BackButtonLink';
import Input from '../../components/atoms/Input';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import Loading from '../../../../components/Loading';
import AlertMessage from '../../components/atoms/AlertMessage';
import moment from 'moment/moment';
import theme from '../../../../theme';
import validateField from '../../../../utils/validateField';
import { v4 as uuidv4 } from 'uuid';
import { storage } from '../../../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { formatFileSize } from '../../../../utils/formatFileSize';
import { addProduct, findProductById } from '../../../../api/productApi';
import { MESSAGES } from '../../../../constants/validate';
import { useEffect } from 'react';

const { palette } = theme;

const inputStyle = {
  width: '320px',
  fontWeight: 400,
  lineHeight: 1,
  color: palette.grey.main,

  '.MuiInputBase-root': {
    borderRadius: '10px',
  },

  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: palette.grey.main,
  },

  '.MuiInputBase-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: palette.primary.main,
    borderWidth: '3px',
  },
};

const categories = [
  {
    value: '2549',
    label: 'Đồ Chơi - Mẹ &amp; Bé',
  },
  {
    value: '1789',
    label: 'NGON',
  },
  {
    value: '44792',
    label: 'Điện Thoại - Máy Tính Bảng',
  },
  {
    value: '1520',
    label: 'Làm Đẹp - Sức Khỏe',
  },
  {
    value: '1882',
    label: 'Điện Gia Dụng',
  },
  {
    value: '931',
    label: 'Thời trang nữ',
  },
  {
    value: '915',
    label: 'Thời trang nam',
  },
  {
    value: '1703',
    label: 'Giày - Dép nữ',
  },
  {
    value: '976',
    label: 'Túi thời trang nữ',
  },
  {
    value: '1686',
    label: 'Giày - Dép nam',
  },
  {
    value: '27616',
    label: 'Túi thời trang nam',
  },
  {
    value: '6000',
    label: 'Balo và Vali',
  },
  {
    value: '27498',
    label: 'Phụ kiện thời trang',
  },
  {
    value: '8371',
    label: 'Đồng hồ và Trang sức',
  },
  {
    value: '1846',
    label: 'Laptop - Máy Vi Tính - Linh kiện',
  },
  {
    value: '1883',
    label: 'Nhà Cửa - Đời Sống',
  },
  {
    value: '17166',
    label: 'Cross Border - Hàng Quốc Tế',
  },
  {
    value: '4384',
    label: 'Bách Hóa Online',
  },
  {
    value: '1815',
    label: 'Thiết Bị Số - Phụ Kiện Số',
  },
  {
    value: '11312',
    label: 'Voucher - Dịch vụ',
  },
  {
    value: '8594',
    label: 'Ô Tô - Xe Máy - Xe Đạp',
  },
  {
    value: '8322',
    label: 'Nhà Sách Tiki',
  },
  {
    value: '4221',
    label: 'Điện Tử - Điện Lạnh',
  },
  {
    value: '1975',
    label: 'Thể Thao - Dã Ngoại',
  },
  {
    value: '1801',
    label: 'Máy Ảnh - Máy Quay Phim',
  },
  {
    value: '54042',
    label: 'Sản phẩm Tài chính - Bảo hiểm',
  },
];

function ProductUpdatePage() {
  const products = useSelector((state) => state.products);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const param = useParams();
  const productId = param?.productId;

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({
    isMessage: false,
    content: '',
    type: 'success',
  });
  const [images, setImages] = useState([]);
  const [product, setProduct] = useState({
    id: uuidv4(),
    categoryId: '',
    categoryName: '',
    productName: '',
    imageUrl: '',
    imageList: [],
    rating: 0,
    soldProduct: 0,
    priceOdd: 0,
    priceNew: 0,
    discountProduct: 0,
    deliveryDay: `Giao thứ${moment().day() + 1}, ngày ${moment().format('DD/MM')}`,
    deliveryPrice: 10000,
    limitProduct: 0,
    shopName: '',
    description: '',
    createdAt: moment().format(),
  });
  const [errors, setErrors] = useState({
    productName: '',
    priceOdd: 0,
    priceNew: 0,
    categoryId: '',
    shopName: '',
    limitProduct: 0,
  });

  const hanldeChangeFile = (e) => {
    let files = Array.from(e.target.files).map((file) => {
      file.preview = URL.createObjectURL(file);

      return {
        file: file,
        name: file.name,
        imageUrl: file.preview,
        size: formatFileSize(file.size),
      };
    });

    setImages(files);
  };

  const handleUploadImage = (e) => {
    if (images.length === 0) return;

    const updatedImageList = [];

    images.forEach(({ file, name }) => {
      const imageRef = ref(storage, `products/${name + uuidv4()}`);

      setIsLoading(true);

      uploadBytes(imageRef, file)
        .then((snapshot) => {
          getDownloadURL(snapshot.ref).then((url) => {
            updatedImageList.push(url);

            if (updatedImageList.length === images.length) {
              setImages([]);
              setIsLoading(false);
              setProduct({ ...product, imageUrl: updatedImageList[0], imageList: updatedImageList });
              setMessage({ isMessage: true, content: MESSAGES.IMAGE_UPDATE_SUCCESS, type: 'success' });
            }
          });
        })
        .catch((error) => {
          setMessage({ isMessage: true, content: MESSAGES.IMAGE_UPDATE_FAILURE, type: 'error' });
        });
    });
  };

  const handleCloseMessage = (e, reason) => {
    if (reason === 'clickaway') return;
    setMessage({ ...message, isMessage: false });
  };

  const handleEditorChange = (html) => {
    setProduct({ ...product, description: html });
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: validateField(value, name),
    }));

    setProduct((prevProduct) => ({
      ...prevProduct,

      [name]: value,
    }));
  };

  const handleRemoveImageItem = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleRemoveAllImage = () => setImages([]);

  const handleSubmit = () => {
    const fieldsToValidate = ['productName', 'priceOdd', 'priceNew', 'categoryId', 'shopName', 'limitProduct'];

    const newErrors = {};
    for (const key of fieldsToValidate) {
      const error = validateField(product[key], key);
      newErrors[key] = error;
    }

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((error) => error !== '');

    if (!hasErrors) {
      const selectedCategory = categories.find((category) => category.value === product.categoryId);

      dispatch(
        addProduct({
          ...product,
          categoryName: selectedCategory?.label,
          priceOdd: Number(product.priceOdd),
          priceNew: Number(product.priceNew),
          limitProduct: Number(product.limitProduct),
          thumbnailUrl: product?.thumbnailUrl
            ? product?.thumbnailUrl
            : 'https://th.bing.com/th/id/OIP.KeKY2Y3R0HRBkPEmGWU3FwAAAA?rs=1&pid=ImgDetMain',
        })
      );
      navigate(-1);
      console.log('Form submitted successfully');
    } else {
      console.log('Form has errors');
    }
  };

  useEffect(() => {
    if (!productId) return;

    dispatch(findProductById(productId));
  }, [productId]);

  useEffect(() => {
    if (products.productDetail) {
      setProduct(products.productDetail);
    }
  }, [products.productDetail]);

  return (
    <Stack px={3} py={5}>
      <BackButtonLink linkTo={SCREEN_URL.ADMIN_PRODUCT} />
      <Typography variant="h4" sx={{ m: 3, flex: 1 }}>
        {productId ? 'Cập Nhật' : 'Thêm'} Sản phẩm
      </Typography>
      <Divider />
      <Stack direction="row" component={Paper} elevation={3} sx={{ borderRadius: 5, m: 3, p: 3 }}>
        <Typography variant="h6" sx={{ flex: 1 }}>
          Thông tin cơ bản
        </Typography>
        <Stack flex={2} gap={3}>
          <Input
            shrink={true}
            label="Tên sản phẩm"
            name="productName"
            value={product.productName}
            onChange={handleOnChange}
            helperText={errors.productName}
            error={!!errors.productName}
          />

          <FormLabel id="demo-radio-buttons-group-label">Mô tả</FormLabel>
          <EditorDescription editorHtml={product.description} handleEditorChange={handleEditorChange} />
        </Stack>
      </Stack>

      <Stack direction="row" component={Paper} elevation={3} sx={{ borderRadius: 5, mx: 3, p: 3 }}>
        <Typography variant="h6" sx={{ flex: 1 }}>
          Hình ảnh
        </Typography>
        <Stack flex={2} gap={2}>
          <Stack height={150} justifyContent="center" alignItems="center">
            <Button
              variant="text"
              color="black"
              component="label"
              sx={{ width: '100%', height: '100%', borderRadius: 3, border: `1px solid ${grey[100]}` }}
            >
              <Stack direction="row" alignItems="center" gap={2}>
                <Stack
                  alignItems="center"
                  justifyContent="center"
                  sx={{ borderRadius: 999 }}
                  width={60}
                  height={60}
                  bgcolor="rgba(0,0,0,0.1)"
                >
                  <FileUploadOutlinedIcon sx={{ fontSize: 32 }} />
                </Stack>
                <Stack>
                  <Typography variant="body1" fontWeight="600">
                    Click to upload
                  </Typography>
                  <Typography variant="body2">(SVG, JPG, PNG, or gif maximum 900x400)</Typography>
                </Stack>
              </Stack>
              <input type="file" multiple="multiple" hidden accept="/image/" onChange={hanldeChangeFile} />
            </Button>
          </Stack>
          {images?.map(({ name, size, imageUrl }, index) => (
            <Stack
              p={2}
              key={index}
              direction="row"
              borderRadius={2}
              alignItems="center"
              justifyContent="space-between"
              border={`1px solid ${grey[100]}`}
            >
              <Stack direction="row" gap={2}>
                <img src={imageUrl} alt="" width={70} height={50} style={{ objectFit: 'cover', borderRadius: 10 }} />
                <Stack>
                  <Typography variant="body2" fontWeight={600}>
                    {name}
                  </Typography>
                  <Typography variant="body2" color={palette.gray.main}>
                    {size}
                  </Typography>
                </Stack>
              </Stack>
              <IconButton onClick={() => handleRemoveImageItem(index)}>
                <CloseRoundedIcon />
              </IconButton>
            </Stack>
          ))}
          {images.length > 0 && (
            <Stack direction="row" justifyContent="end" alignItems="center" gap={2}>
              <Button color="black" onClick={handleRemoveAllImage}>
                Xoá tất cả
              </Button>
              <Button variant="contained" color="primary" onClick={handleUploadImage}>
                Tải lên
              </Button>
            </Stack>
          )}
        </Stack>
      </Stack>

      <Stack direction="row" component={Paper} elevation={3} sx={{ borderRadius: 5, m: 3, p: 3 }}>
        <Typography variant="h6" sx={{ flex: 1 }}>
          Giá và số lượng sản phẩm
        </Typography>
        <Stack flex={2} gap={2}>
          <Input
            label="Giá cũ"
            type="number"
            name="priceOdd"
            value={product.priceOdd}
            onChange={handleOnChange}
            helperText={!!errors.priceOdd && errors.priceOdd}
            error={!!errors.priceOdd}
          />
          <Input
            label="Giá mới"
            type="number"
            name="priceNew"
            value={product.priceNew}
            onChange={handleOnChange}
            helperText={!!errors.priceNew && errors.priceNew}
            error={!!errors.priceNew}
          />
          <Stack direction="row" sx={{ width: 250 }} gap={2}>
            <Button variant="contained">
              <RemoveOutlinedIcon />
            </Button>
            <Input
              style={{ width: '100%' }}
              type="number"
              shrink={false}
              name="limitProduct"
              value={product.limitProduct}
              onChange={handleOnChange}
              helperText={!!errors.limitProduct && errors.limitProduct}
              error={!!errors.limitProduct}
            />
            <Button variant="contained">
              <AddOutlinedIcon />
            </Button>
          </Stack>
        </Stack>
      </Stack>

      <Stack direction="row" component={Paper} elevation={3} sx={{ borderRadius: 5, m: 3, p: 3 }}>
        <Typography variant="h6" sx={{ flex: 1 }}>
          Danh mục
        </Typography>
        <Stack flex={2} gap={2}>
          <TextField
            select
            sx={inputStyle}
            label="Danh mục"
            style={{ width: '100%' }}
            name="categoryId"
            value={product.categoryId}
            onChange={handleOnChange}
            helperText={errors.categoryId}
            error={!!errors.categoryId}
          >
            {categories.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <Input
            label="Tên cửa hàng"
            style={{ width: '100%' }}
            shrink={false}
            name="shopName"
            onChange={handleOnChange}
            helperText={errors.shopName}
            error={!!errors.shopName}
          />
        </Stack>
      </Stack>

      <Stack display="inline-flex" direction="row" m={3} gap={3}>
        <Button variant="contained" onClick={handleSubmit}>
          {productId ? 'Sửa' : 'Thêm'}
        </Button>
        <Button variant="contained" color="black">
          Thoát
        </Button>
      </Stack>

      {isLoading && <Loading />}
      {message.isMessage && (
        <AlertMessage
          open={message.isMessage}
          type={message.type}
          message={message.content}
          handleClose={handleCloseMessage}
        />
      )}
    </Stack>
  );
}

export default ProductUpdatePage;
