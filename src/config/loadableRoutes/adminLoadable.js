import { createLoadable } from './createLoadable';

// Admin router
export const HomeAdminPage = createLoadable(() => import('../../pages/site-admin/pages/HomePage'));
export const LoginAdminPage = createLoadable(() => import('../../pages/site-admin/pages/LoginPage'));
export const UsersAdminPage = createLoadable(() => import('../../pages/site-admin/pages/UsersPage'));
export const UserUpdateAdminPage = createLoadable(() => import('../../pages/site-admin/pages/UserUpdatePage'));
export const UserDetailAdminPage = createLoadable(() => import('../../pages/site-admin/pages/UserDetailPage'));
export const ProductAdminPage = createLoadable(() => import('../../pages/site-admin/pages/ProductPage'));
export const ProductUpdateAdminPage = createLoadable(() => import('../../pages/site-admin/pages/ProductUpdatePage'));
export const OrderAdminPage = createLoadable(() => import('../../pages/site-admin/pages/OrderPage'));
export const ErrorPage = createLoadable(() => import('../../pages/site-admin/pages/NotFoundPage'));
