import moment from 'moment/moment';
import { signInWithPopup, FacebookAuthProvider, GoogleAuthProvider } from 'firebase/auth';
import { authentication } from '.';

const fbAuthProvider = new FacebookAuthProvider();
const ggAuthProvider = new GoogleAuthProvider();

/**
 * Xác thực người dùng và lấy thông tin người dùng từ Firebase sử dụng authProvider.
 * @param {FirebaseAuthProvider} authProvider - Cung cấp xác thực (FacebookAuthProvider hoặc GoogleAuthProvider).
 * @returns {Object} - Trả về một đối tượng chứa thông tin người dùng sau khi xác thực.
 */
const findUserByIdData = async (authProvider) => {
  const res = await signInWithPopup(authentication, authProvider);
  const {
    uid,
    accessToken,
    displayName,
    email,
    photoURL,
    metadata: { createdAt },
  } = res.user;
  const dateFormat = moment(Number(createdAt)).format('YYYY-MM-DDTHH:mm:ssZ');

  return {
    id: uid,
    token: accessToken,
    fullName: displayName,
    email: email,
    avatar: photoURL,
    createdAt: dateFormat,
  };
};

export const FacebookAuth = async () => {
  return await findUserByIdData(fbAuthProvider);
};

export const GoogleAuth = async () => {
  return await findUserByIdData(ggAuthProvider);
};
