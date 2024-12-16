import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";  // Подключаем Redux
import axios from "axios";
import { Button, TextField, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";  // Для навигации
import { getUserInfo } from "../features/auth/authSlice";  // Экшен для получения информации о пользователе

function CreateQuiz() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");  // Состояние для автора
  const [error, setError] = useState(null);
  const navigate = useNavigate();  // Хук для навигации

  const dispatch = useDispatch();
  const { user, userInfo } = useSelector((state) => state.auth);  // Получаем данные о пользователе из Redux

  useEffect(() => {
    if (user && !userInfo.first_name) {
      dispatch(getUserInfo());  // Запрашиваем информацию о пользователе, если ее нет
    }
  }, [user, userInfo, dispatch]);

  useEffect(() => {
    // Когда информация о пользователе загружена, обновляем поле "Автор"
    if (userInfo?.first_name) {
      setAuthor(userInfo.first_name);  // Заполняем поле "Автор" именем пользователя
    }
  }, [userInfo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/api/v1/quiz/", {
        title,
        author,
      });
      alert("Викторина создана!");
      navigate("/quiz");  // Перенаправляем на страницу с викторинами
    } catch (err) {
      setError("Ошибка при создании викторины");
    }
  };

  const handleExit = () => {
    navigate("/quiz");  // Перенаправляем на страницу викторин
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Создать новую викторину
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Название викторины"
          variant="outlined"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="Автор"
          variant="outlined"
          fullWidth
          value={author}  // Отображаем имя пользователя в поле "Автор"
          onChange={(e) => setAuthor(e.target.value)}  // При необходимости обновляем его
          required
          disabled  // Делаем поле автором только для чтения
        />
        {error && <Typography color="error">{error}</Typography>}
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
          Создать викторину
        </Button>
      </form>

      <Button 
        variant="outlined" 
        color="secondary" 
        onClick={handleExit} 
        sx={{ mt: 2 }}
      >
        Выход
      </Button>
    </Container>
  );
}

export default CreateQuiz;
