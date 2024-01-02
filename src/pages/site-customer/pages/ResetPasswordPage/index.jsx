import React, { useEffect, useState } from 'react';
import BackgroundForm from '../../../../assets/images/bg-form-1.png';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { forgotPassword, redirectResetPassword, updatedResetPassword } from '../../../../api/userApi';
import validateField from '../../../../utils/validateField';

import './styles.scss';
import { CircularProgress } from '@mui/material';
import { SCREEN_URL } from '../../../../constants/screen';

function ResetPasswordPage() {
  const { userId, token } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [user, setUser] = useState({ password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [countdown, setCountdown] = useState(parseInt(localStorage.getItem('countdown')) || 120);
  const [isRunning, setIsRunning] = useState(false);
  const [message, setMessage] = useState({ password: '', type: 'error' });

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));

    setMessage((prevErrors) => ({
      ...prevErrors,
      [name]: validateField(value, name),
    }));

    if (validateForm()) setIsDisabled(false);
  };

  const validateForm = () => {
    const fieldsToValidate = ['password'];
    const newErrors = {};

    for (const key of fieldsToValidate) {
      const error = validateField(user[key], key);
      newErrors[key] = error;
    }

    return Object.values(newErrors).every((error) => error === '');
  };

  const handleSubmit = async () => {
    try {
      if (validateForm()) {
        setIsLoading(true);

        const res = await dispatch(updatedResetPassword({ userId, token, password: user?.password }));

        if (res.payload) {
          const { message, data } = res.payload;

          if (message === 'Failed') {
            setIsLoading(false);
            setMessage({ ...message, password: data });
            return;
          }

          if (message && message !== 'Failed') {
            setIsLoading(false);
            setIsDisabled(true);
            setIsRunning((prevIsRunning) => !prevIsRunning);
            setMessage({ ...message, type: 'success', password: 'Cập nhật thành công' });
            localStorage.removeItem('countdown');
          }
        }
      } else {
        setMessage({ ...message, password: 'Form has errors' });
      }
    } catch (error) {
      setMessage({ ...message, password: `Error while fetching users: ${error}` });
    }
  };

  useEffect(() => {
    const fetchApi = async () => {
      const res = await dispatch(redirectResetPassword({ userId, token }));

      if (res.payload) {
        const { message, data } = res.payload;

        if (message === 'Failed') {
          localStorage.removeItem('countdown');
          navigate(SCREEN_URL.NOT_FOUND_404);
        }

        localStorage.setItem('countdown', '120');
      }
    };

    fetchApi();
  }, []);

  useEffect(() => {
    let timer;

    if (!isRunning && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      setIsDisabled(true);
      navigate(SCREEN_URL.FORGOT_PASSWORD);
      localStorage.removeItem('countdown');
    }

    return () => {
      clearInterval(timer);
    };
  }, [countdown, isRunning]);

  useEffect(() => {
    localStorage.setItem('countdown', countdown.toString());
  }, [countdown]);

  return (
    <div className="form form__login">
      <div id="form" className="form__main">
        <h3 className="form__main--heading">Tạo mật khẩu mới ?</h3>
        <p className="form__main--text">Vui lòng nhập mật khẩu mới của bạn</p>

        <input
          type="password"
          className={`form__input ${!!message.password && message.type}`}
          name="password"
          placeholder="Mật khẩu mới"
          onChange={handleOnChange}
        />
        <span className={`form__message-valid ${!!message.password && message.type}`}>{message.password}</span>

        <button
          className="form__btn-submit form__btn-login"
          disabled={!!message.password || isDisabled}
          onClick={handleSubmit}
        >
          {isLoading ? (
            <CircularProgress size={24} color="white" />
          ) : (
            `Cập nhật (${Math.floor(countdown / 60) + ':' + (countdown % 60 < 10 ? '0' : '') + (countdown % 60)})`
          )}
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

export default ResetPasswordPage;
