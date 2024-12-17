import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { Box, Typography, Button, MenuItem, FormControl, Select, InputLabel } from "@mui/material";
import { toast } from "react-toastify";

function QuizSelector() {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState('');
  const navigate = useNavigate();

  // Доступ к состоянию пользователя
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    axios.get("http://localhost:8000/api/v1/quiz/")
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
      alert("Пожалуйста, выберите тест.");
    }
  };

  const handleProtectedAction = (action) => {
    if (user) {
      action();
    } else {
      toast.info("Пожалуйста, авторизуйтесь, чтобы создать тест или добавить вопрос.");
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
          label="SELECT QUIZ"
        >
          {quizzes.map((quiz) => (
            <MenuItem key={quiz.id} value={quiz.id}>
              {quiz.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Используем Box с flexbox для выравнивания кнопок на одном уровне */}
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

        {/* Кнопка для перехода на страницу создания теста */}
        <Button 
          variant="outlined" 
          color="secondary" 
          onClick={() => handleProtectedAction(() => navigate("/quiz/create"))}
        >
          Создать тест
        </Button>

        {/* Кнопка для перехода на страницу добавления вопросов */}
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => handleProtectedAction(() => navigate(`/quiz/${selectedQuiz}/create_question`))}
          disabled={!selectedQuiz} // Делаем кнопку неактивной, если не выбран тест
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
