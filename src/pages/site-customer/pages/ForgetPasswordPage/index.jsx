import React, { useState } from 'react';
import BackgroundForm from '../../../../assets/images/bg-form-1.png';
import validateField from '../../../../utils/validateField';
import { useDispatch } from 'react-redux';
import { forgotPassword } from '../../../../api/userApi';

import './styles.scss';
import { CircularProgress } from '@mui/material';

function ForgotPasswordPage() {
  const dispatch = useDispatch();

  const [user, setUser] = useState({ email: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [errorMessage, setErrorMessage] = useState({ email: '', type: 'error' });

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

    if (validateForm()) setIsDisabled(false);
  };

  const validateForm = () => {
    const fieldsToValidate = ['email'];
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
        setIsLoading(true);

        const usersRes = await dispatch(forgotPassword(user?.email));

        if (usersRes.payload) {
          const { message, data } = usersRes.payload;

          if (message === 'Failed') {
            setIsLoading(false);
            setErrorMessage({ ...errorMessage, password: data });
            return;
          }

          if (message && message !== 'Failed') {
            setIsLoading(false);
            setIsDisabled(true);
            setErrorMessage({ ...errorMessage, type: 'success', email: 'Vui lòng kiểm tra email của bạn' });
          }
        }
      } else {
        setErrorMessage({ ...errorMessage, email: 'Form has errors' });
      }
    } catch (error) {
      setErrorMessage({ ...errorMessage, email: `Error while fetching users: ${error}` });
    }
  };

  return (
    <div className="form form__login">
      <div id="form" className="form__main">
        <h3 className="form__main--heading">Quên mật khẩu ?</h3>
        <p className="form__main--text">Vui lòng nhập thông tin tài khoản để lấy lại mật khẩu</p>

        <input
          type="email"
          className={`form__input ${!!errorMessage.email && errorMessage.type}`}
          name="email"
          placeholder="Email"
          onChange={handleOnChange}
        />
        <span className={`form__message-valid ${!!errorMessage.email && errorMessage.type}`}>{errorMessage.email}</span>

        <button
          className="form__btn-submit form__btn-login"
          disabled={!!errorMessage.email || isDisabled}
          onClick={handleSubmit}
        >
          {isLoading ? <CircularProgress size={24} color="white" /> : ' Gửi đi'}
        </button>
      </div>
      <div className="form__thumbnail">
        <img src={BackgroundForm} alt="" />
        <h4>Mua sắm tại Tiki</h4>
        <p>Siêu ưu đãi mỗi ngày</p>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
