import React, { useState } from "react";
import { useDispatch } from 'react-redux';
import { login, reset } from '../features/auth/authSlice';  // Здесь правильный импорт reset
import { Link, useNavigate } from "react-router-dom";
import { BiLogInCircle } from "react-icons/bi";
import { toast } from "react-toastify";
import { TextField, Button, Typography, Container, Box, CircularProgress, Paper } from "@mui/material";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const { email, password } = formData;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Проверка на пустые поля
    if (!email || !password) {
      toast.error("Пожалуйста, заполните все поля!", { autoClose: 2000 });
      return;
    }

    const userData = { email, password };
    
    dispatch(login(userData));  // Начинаем процесс входа
    setIsLoading(true);

    try {
      // Убираем тестовую проверку и используем реальный логин
      toast.success("Успешный вход!");
      navigate("/");
    } catch (error) {
      dispatch(reset());  // Сбрасываем состояние в случае ошибки
      toast.error(error.message || "Не получилось войти! Попробуйте заново!", { autoClose: 2000 });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        marginTop: "64px",
        paddingLeft: "16px",
        paddingRight: "16px",
        marginLeft: "auto",
        marginRight: "auto",
        width: "130%",
      }}
    >
      <Box sx={{ textAlign: "center", marginBottom: 4 }}>
        <Typography variant="h4" gutterBottom>
          Войти <BiLogInCircle />
        </Typography>
      </Box>

      <Paper
        elevation={3}
        sx={{
          padding: 5,
          borderRadius: 3,
          borderWidth: 2,
          borderStyle: "solid",
          borderColor: "#1976d2",
        }}
      >
        {isLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", marginBottom: 3 }}>
            <CircularProgress />
          </Box>
        )}

        {!isLoading && (
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          >
            <TextField
              label="Email"
              name="email"
              type="email"
              value={email}
              onChange={handleChange}
              fullWidth
              required
              sx={{
                fontSize: "1.2rem",
                "& .MuiInputBase-root": {
                  height: "60px",
                },
              }}
            />
            <TextField
              label="Пароль"
              name="password"
              type="password"
              value={password}
              onChange={handleChange}
              fullWidth
              required
              sx={{
                fontSize: "1.2rem",
                "& .MuiInputBase-root": {
                  height: "60px",
                },
              }}
            />
            <Button type="submit" variant="contained" color="primary" size="large" fullWidth>
              Войти
            </Button>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 0, // убираем отступ сверху
              }}
            >
              <Link
                to="/reset-password"
                style={{
                  textDecoration: "none",
                  color: "#1976d2",
                  fontSize: "0.9rem",
                  textAlign: "right",
                }}
              >
                Забыли пароль?
              </Link>
              <Button
                variant="outlined"
                color="secondary"
                size="large"
                onClick={() => navigate("/register")}
              >
                Зарегистрироваться
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default LoginPage;
