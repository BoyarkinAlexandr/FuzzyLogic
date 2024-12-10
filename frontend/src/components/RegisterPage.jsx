import React, { useEffect, useState } from 'react';
import { BiUser } from 'react-icons/bi';
import { TextField, Button, CircularProgress, Container, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../features/auth/authSlice';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    re_password: '',
  });

  const { first_name, last_name, email, password, re_password } = formData;
  const dispatch = useDispatch();
  
  // Используем состояние из Redux
  const { isLoading, isError, isSuccess, message, user } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== re_password) {
      toast.error('Пароли не совпадают!!!', {
        position: 'top-right',
        autoClose: 2000,
      });
      return;
    }

    const userData = {
      first_name,
      last_name,
      email,
      password,
      re_password,
    };

    dispatch(register(userData));
  };

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (isSuccess && user) {
      navigate('/');
      toast.success("Активация аккаунта отправлена на вашу почту. Проверьте её!");
    }
  }, [isError, isSuccess, user, message, navigate]);

  const handleResetPassword = () => {
    navigate('/reset-password');
  };

  return (
    <Container maxWidth="sm" className="auth__container">
      <Typography variant="h4" align="center" gutterBottom>
        Регистрация <BiUser />
      </Typography>

      {/* Показать индикатор загрузки, если идет регистрация */}
      {isLoading && <CircularProgress />}

      <form onSubmit={handleSubmit}>
        <TextField
          label="Имя"
          name="first_name"
          onChange={handleChange}
          value={first_name}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Фамилия"
          name="last_name"
          onChange={handleChange}
          value={last_name}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Email"
          name="email"
          onChange={handleChange}
          value={email}
          type="email"
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Пароль"
          name="password"
          onChange={handleChange}
          value={password}
          type="password"
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Повторите пароль"
          name="re_password"
          onChange={handleChange}
          value={re_password}
          type="password"
          fullWidth
          margin="normal"
          required
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          disabled={isLoading}
          sx={{ marginBottom: 2 }}
        >
          {isLoading ? 'Регистрация...' : 'Регистрация'}
        </Button>
      </form>

      <Button
        variant="outlined"
        color="secondary"
        fullWidth
        size="large"
        onClick={handleResetPassword}
      >
        Сбросить пароль
      </Button>
    </Container>
  );
};

export default RegisterPage;
