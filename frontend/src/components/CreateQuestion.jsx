import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";  // Подключаем useNavigate
import axios from "axios";
import { Button, TextField, Container, Grid, Typography, Checkbox, FormControlLabel } from "@mui/material";

function CreateQuestion() {
  const { quizId } = useParams(); // Получаем quizId из URL
  const navigate = useNavigate(); // Инициализируем хук useNavigate
  const [questionText, setQuestionText] = useState("");
  const [answers, setAnswers] = useState([{ text: "", isRight: false }]);
  const [error, setError] = useState(null);

  const handleAddAnswer = () => {
    setAnswers([...answers, { text: "", isRight: false }]);
  };

  const handleAnswerChange = (index, field, value) => {
    const newAnswers = [...answers];
    newAnswers[index][field] = value;
    setAnswers(newAnswers);
  };

  const handleDeleteAnswer = (index) => {
    const newAnswers = answers.filter((_, i) => i !== index);
    setAnswers(newAnswers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Передаем quizId в URL
      const response = await axios.post(
        `http://localhost:8000/api/v1/quiz/question/quiz/${quizId}/`,
        {
          title: questionText,
          answers: answers.map((answer) => ({
            answer_text: answer.text,
            is_right: answer.isRight,
          })),
        }
      );
      alert("Вопрос успешно добавлен!");
    } catch (err) {
      setError("Ошибка при добавлении вопроса");
    }
  };

  // Функция для выхода (перенаправление на страницу тестов)
  const handleExit = () => {
    navigate("/quiz");  // Перенаправляет на страницу списка тестов
  };

  return (
    <Container>
      <Typography variant="h5" gutterBottom>
        Добавить вопрос
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Вопрос"
          variant="outlined"
          fullWidth
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          required
        />
        <Typography variant="h6" gutterBottom>
          Ответы:
        </Typography>
        {answers.map((answer, index) => (
          <Grid container spacing={2} key={index} alignItems="center">
            <Grid item xs={8}>
              <TextField
                sx={{ mb: 2 }}
                label={`Ответ ${index + 1}`}
                variant="outlined"
                fullWidth
                value={answer.text}
                onChange={(e) => handleAnswerChange(index, "text", e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={3}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={answer.isRight}
                    onChange={(e) => handleAnswerChange(index, "isRight", e.target.checked)}
                  />
                }
                label="Правильный ответ"
              />
            </Grid>
            <Grid item xs={1}>
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleDeleteAnswer(index)}
                sx={{
                  fontSize: '1rem',  // Уменьшаем шрифт кнопки
                  padding: '8px 16px',  // Уменьшаем отступы
                  height: '40px',  // Устанавливаем меньшую высоту кнопки
                  width: 'auto',  // Автоматическая ширина для кнопки
                }}
              >
                Удалить
              </Button>
            </Grid>
          </Grid>
        ))}
        <Button variant="outlined" onClick={handleAddAnswer} sx={{ mt: 2, mr: 2 }}>
          Добавить ответ
        </Button>
        {error && <Typography color="error">{error}</Typography>}
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
          Добавить вопрос
        </Button>
      </form>

      {/* Кнопка для выхода (перенаправление на страницу с тестами) */}
      <Button 
        variant="outlined" 
        color="secondary" 
        onClick={handleExit} 
        sx={{ mt: 3 }}
      >
        Выход
      </Button>
    </Container>
  );
}

export default CreateQuestion;
