import React, { useState } from 'react';
import BackgroundForm from '../../../../assets/images/bg-form-1.png';
import googleIcon from '../../../../assets/images/google-icon.png';
import facebookIcon from '../../../../assets/images/facebook-icon.png';
import validateField from '../../../../utils/validateField';

import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useDispatch } from 'react-redux';
import { addUser, findUserByOne, register } from '../../../../api/userApi';
import { FacebookAuth, GoogleAuth } from '../../../../firebase/auth';
import { addUserCurrent } from '../../../../redux/slice/userSlice';
import { SCREEN_URL } from '../../../../constants/screen';

import './styles.scss';

function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [user, setUser] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState({
    username: '',
    email: '',
    address: '',
    userExists: '',
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

  const handleSubmit = async () => {
    const fieldsToValidate = ['username', 'email', 'password'];

    const newErrors = {};
    for (const key of fieldsToValidate) {
      const error = validateField(user[key], key);
      newErrors[key] = error;
    }

    setErrorMessage(newErrors);

    const hasErrors = Object.values(newErrors).some((error) => error !== '');

    if (!hasErrors) {
      setErrorMessage({ ...errorMessage, userExists: '' });
      const userRes = await dispatch(register(user));

      if (userRes.payload) {
        const { message, data } = userRes.payload;

        if (message === 'Failed') {
          setErrorMessage({ ...errorMessage, userExists: data });
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
    <div className="form form-regiter">
      <div id="form" className="form__main">
        <h3 className="form__main--heading">Xin chào,</h3>
        <p className="form__main--text">Tạo tài khoản</p>

        <input
          type="text"
          className={`form__input ${!!errorMessage.username && 'error'}`}
          name="username"
          placeholder="Tên tài khoản"
          onChange={handleOnChange}
        />
        <span className="form__message-valid">{errorMessage.username}</span>
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
        <button className="form__btn-submit form__btn-register" onClick={handleSubmit}>
          Đăng ký
        </button>
        <Link to="/login" className="form__btn-switch">
          Đăng nhập
        </Link>

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

export default RegisterPage;
