import React, { useState } from "react";
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

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (email === "test@example.com" && password === "password", { autoClose: 1000 }) {
        toast.success("Успешный вход!");
        navigate("/");
      } else {
        throw new Error("Неверные данные!", { autoClose: 2000 });
      }
    } catch (error) {
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
