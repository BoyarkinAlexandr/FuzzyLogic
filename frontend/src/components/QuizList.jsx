import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getUserInfo } from "../features/auth/authSlice";
import axios from "axios";
import { Box, Typography, Button, MenuItem, FormControl, Select, InputLabel } from "@mui/material";
import { toast } from "react-toastify";

function QuizSelector() {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, userInfo } = useSelector((state) => state.auth);

  // Добавляем is_staff вручную для id: 1
  // const enhancedUserInfo = {
  //   ...userInfo,
  //   is_staff: userInfo?.id === 1, // Предполагаем, что id: 1 — персонал
  // };

  const enhancedUserInfo = userInfo;

  console.log("Токены (user):", user);
  console.log("Данные пользователя (userInfo):", userInfo);
  console.log("Улучшенные данные (enhancedUserInfo):", enhancedUserInfo);

  useEffect(() => {
    if (user && user.access) {
      dispatch(getUserInfo());
    }
  }, [user, dispatch]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/v1/quiz/")
      .then((response) => setQuizzes(response.data))
      .catch((error) => console.error("Ошибка загрузки викторин:", error));
  }, []);

  const handleQuizChange = (event) => {
    setSelectedQuiz(event.target.value);
  };

  const handleStartQuiz = () => {
    if (selectedQuiz) {
      navigate(`/quiz/${selectedQuiz}`);
    } else {
      toast.error("Пожалуйста, выберите тест.");
    }
  };

  const handleCreateQuiz = () => {
    if (!enhancedUserInfo || Object.keys(enhancedUserInfo).length === 0) {
      toast.info("Пожалуйста, авторизуйтесь, чтобы продолжить.");
      return;
    }
    if (!enhancedUserInfo.is_staff) {
      toast.info("Только преподаватели могут создавать тесты.");
      return;
    }
    navigate("/quiz/create");
  };

  const handleAddQuestion = () => {
    if (!enhancedUserInfo || Object.keys(enhancedUserInfo).length === 0) {
      toast.info("Пожалуйста, авторизуйтесь, чтобы добавить вопрос.");
      return;
    }
    if (selectedQuiz) {
      navigate(`/quiz/${selectedQuiz}/create_question`);
    } else {
      toast.error("Пожалуйста, выберите тест для добавления вопроса.");
    }
  };

  return (
    <Box sx={{ textAlign: "center", p: 3 }}>
      <Typography variant="h4" gutterBottom>Выберите тест</Typography>
      
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="quiz-select-label">Выберите тест</InputLabel>
        <Select
          labelId="quiz-select-label"
          id="quiz-select"
          value={selectedQuiz}
          onChange={handleQuizChange}
          label="Выберите тест"
        >
          {quizzes.map((quiz) => (
            <MenuItem key={quiz.id} value={quiz.id}>
              {quiz.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleStartQuiz}
          disabled={!selectedQuiz}
          sx={{
            backgroundColor: selectedQuiz ? "#8e24aa" : "#c1c1c1", 
            '&:hover': { backgroundColor: selectedQuiz ? "#6a1b9a" : "#c1c1c1" }
          }}
        >
          Начать
        </Button>

        <Button 
          variant="outlined" 
          color="secondary" 
          onClick={handleCreateQuiz}
          disabled={!enhancedUserInfo || Object.keys(enhancedUserInfo).length === 0 || !enhancedUserInfo.is_staff}
          sx={{
            backgroundColor: enhancedUserInfo && enhancedUserInfo.is_staff ? "transparent" : "#f0f0f0",
            '&:hover': { backgroundColor: enhancedUserInfo && enhancedUserInfo.is_staff ? "#e0e0e0" : "#f0f0f0" }
          }}
        >
          Создать тест
        </Button>

        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleAddQuestion}
          disabled={!enhancedUserInfo || Object.keys(enhancedUserInfo).length === 0 || !enhancedUserInfo.is_staff}
          sx={{
            backgroundColor: selectedQuiz ? "#8e24aa" : "#c1c1c1", 
            '&:hover': { backgroundColor: selectedQuiz ? "#6a1b9a" : "#c1c1c1" }
          }}
        >
          Добавить вопрос
        </Button>
      </Box>
    </Box>
  );
}

export default QuizSelector;