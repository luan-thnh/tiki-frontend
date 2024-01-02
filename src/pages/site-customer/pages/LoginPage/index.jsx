import React, { useState } from 'react';
import BackgroundForm from '../../../../assets/images/bg-form-1.png';
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useDispatch } from 'react-redux';
import { addUserCurrent } from '../../../../redux/slice/userSlice';
import { addUser, findAllUser, findUserById, findUserByOne, login, register } from '../../../../api/userApi';
import googleIcon from '../../../../assets/images/google-icon.png';
import facebookIcon from '../../../../assets/images/facebook-icon.png';
import md5 from 'md5';
import validateField from '../../../../utils/validateField';
import { FacebookAuth, GoogleAuth } from '../../../../firebase/auth';
import './styles.scss';
import { SCREEN_URL } from '../../../../constants/screen';
import { IMAGE_URL } from '../../../../constants/images';
import moment from 'moment/moment';
import generatePassword from '../../../../utils/generatePassword';

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [user, setUser] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState({
    email: '',
    password: '',
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));

    setErrorMessage((prevErrors) => ({
      ...prevErrors,
      [name]: validateField(value, name),
    }));
  };

  const validateForm = () => {
    const fieldsToValidate = ['email', 'password'];
    const newErrors = {};

    for (const key of fieldsToValidate) {
      const error = validateField(user[key], key);
      newErrors[key] = error;
    }

    setErrorMessage(newErrors);

    return Object.values(newErrors).every((error) => error === '');
  };

  const handleSubmit = async () => {
    try {
      if (validateForm()) {
        const { email, password } = user;
        const usersRes = await dispatch(login({ email, password }));

        if (usersRes.payload) {
          const { message, data } = usersRes.payload;

          if (message === 'Failed') {
            setErrorMessage({ ...errorMessage, password: data });
            return;
          }

          const { token, uuid, avatar, email, username, fullName, role } = data;

          dispatch(
            addUserCurrent({
              token,
              dataUser: { id: uuid, avatar, email, username, fullName, role: role === 1 ? 'admin' : 'public' },
            })
          );
          navigate(SCREEN_URL.HOME);
        }
      } else {
        console.log('Form has errors');
      }
    } catch (error) {
      console.error('Error while fetching users:', error);
    }
  };

  const handleLogin = async (authProvider) => {
    try {
      const data = await authProvider();

      const userExists = await dispatch(findUserByOne({ email: data.email }));

      const { id, token, username = 'tiki_' + uuidv4().split('-')[0], fullName, email, avatar } = data;

      const user = {
        uuid: id,
        username: username,
        fullName: fullName,
        email: email,
        avatar: avatar,
        password: '123456',
      };

      if (userExists?.payload && userExists?.payload?.data === 'Tài khoản không tồn tại') {
        await dispatch(addUser(user));
      }

      await dispatch(addUserCurrent({ token, dataUser: { id, username, fullName, email, avatar } }));
      navigate(SCREEN_URL.HOME);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLoginFacebook = () => handleLogin(FacebookAuth);
  const handleLoginGoogle = () => handleLogin(GoogleAuth);

  return (
    <div className="form form__login">
      <div id="form" className="form__main">
        <h3 className="form__main--heading">Xin chào,</h3>
        <p className="form__main--text">Đăng nhập</p>

        <input
          type="email"
          className={`form__input ${!!errorMessage.email && 'error'}`}
          name="email"
          placeholder="Email"
          onChange={handleOnChange}
        />
        <span className="form__message-valid">{errorMessage.email}</span>
        <input
          type="password"
          className={`form__input ${(!!errorMessage.password || !!errorMessage.userExists) && 'error'}`}
          name="password"
          placeholder="Mật khẩu"
          onChange={handleOnChange}
        />
        <span className="form__message-valid">
          {errorMessage.userExists ? errorMessage.userExists : errorMessage.password}
        </span>
        <button className="form__btn-submit form__btn-login" onClick={handleSubmit}>
          Đăng nhập
        </button>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Link to="/forgot-password" className="form__btn-forgot-password">
            Quên mật khẩu ?
          </Link>
          <Link to="/register" className="form__btn-switch">
            Đăng ký
          </Link>
        </div>

        <div className="form__footer">
          <p className="form__text-line">
            <span>Hoặc tiếp tục bằng</span>
          </p>

          <div className="form__login-other">
            <button className="form__btn-google" onClick={handleLoginGoogle}>
              <img src={googleIcon} alt="" />
              Đăng nhập bằng Google
            </button>

            <button className="form__btn-facebook" onClick={handleLoginFacebook}>
              <img src={facebookIcon} alt="" />
              Đăng nhập bằng Facebook
            </button>
          </div>

          <p className="form__footer-rules">
            Bằng việc tiếp tục, bạn đã chấp nhận <a href="#!">điều khoản sử dụng</a>
          </p>
        </div>
      </div>
      <div className="form__thumbnail">
        <img src={BackgroundForm} alt="" />
        <h4>Mua sắm tại Tiki</h4>
        <p>Siêu ưu đãi mỗi ngày</p>
      </div>
    </div>
  );
}

export default LoginPage;
