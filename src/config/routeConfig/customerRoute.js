import { SCREEN_URL } from '../../constants/screen';
import { ErrorPage } from '../loadableRoutes/adminLoadable';
import {
  CartPage,
  CheckoutPage,
  DetailPage,
  HomePage,
  LoginPage,
  RegisterPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  SearchPage,
} from '../loadableRoutes/customerLoadable';

// Config layout customer
export const layoutCustomer = [
  {
    path: SCREEN_URL.HOME,
    component: HomePage,
    isHeader: true,
    isFooter: true,
    isRedirect: true,
    title: 'Trang chủ',
  },
  {
    path: SCREEN_URL.LOGIN,
    component: LoginPage,
    isHeader: true,
    isFooter: true,
    isRedirect: true,
    title: 'Đăng nhập',
  },
  {
    path: SCREEN_URL.REGISTER,
    component: RegisterPage,
    isHeader: true,
    isFooter: true,
    isRedirect: true,
    title: 'Đăng ký',
  },
  {
    path: SCREEN_URL.DETAILS,
    component: DetailPage,
    isHeader: true,
    isFooter: true,
    isRedirect: true,
    title: 'Chi tiết',
  },
  {
    path: SCREEN_URL.CART,
    component: CartPage,
    isHeader: true,
    isFooter: true,
    isRedirect: true,
    title: 'Giỏ hàng',
  },
  {
    path: SCREEN_URL.CHECKOUT,
    component: CheckoutPage,
    isHeader: true,
    isFooter: true,
    isRedirect: true,
    title: 'Thanh toán',
  },
  {
    path: SCREEN_URL.CHECKOUT,
    component: CheckoutPage,
    isHeader: true,
    isFooter: true,
    isRedirect: true,
    title: 'Thanh toán',
  },
  {
    path: SCREEN_URL.SEARCH,
    component: SearchPage,
    isHeader: true,
    isFooter: true,
    isRedirect: true,
    title: 'Tìm kiếm',
  },
  {
    path: SCREEN_URL.FORGOT_PASSWORD,
    component: ForgotPasswordPage,
    isHeader: true,
    isFooter: true,
    isRedirect: false,
    title: 'Quên mật khẩu',
  },
  {
    path: SCREEN_URL.RESET_PASSWORD,
    component: ResetPasswordPage,
    isHeader: true,
    isFooter: true,
    isRedirect: false,
    title: 'Đặt lại mật khẩu',
  },
  {
    path: SCREEN_URL.NOT_FOUND_404,
    component: ErrorPage,
    isHeader: false,
    isSidebar: false,
    isRedirect: false,
    title: '404 Not Found',
  },
];
