import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Используем useNavigate вместо useHistory
import axios from "axios";
import { Button, Container, Grid, Typography, Box, CircularProgress, Stack, Card, CardContent } from "@mui/material";

function QuizDetails() {
  const { id } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [quizTitle, setQuizTitle] = useState("");
  const [questionCount, setQuestionCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Используем useNavigate вместо useHistory

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/v1/quiz/question/quiz/${id}/`)
      .then((response) => {
        if (response.data) {
          setQuestions(response.data);
          setQuizTitle(response.data[0]?.quiz?.title || "Название викторины");
          setQuestionCount(response.data.length);
          setLoading(false);
        }
      })
      .catch((error) => {
        setError("Ошибка загрузки вопросов.");
        setLoading(false);
      });
  }, [id]);

  const handleAnswerSelect = (questionId, answerId) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answerId.toString(),
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateResults = () => {
    let correctAnswers = 0;
    questions.forEach((question) => {
      const correctAnswer = question.answers.find((a) => a.is_right);
      if (correctAnswer && selectedAnswers[question.id] === correctAnswer.id.toString()) {
        correctAnswers++;
      }
    });

    return {
      totalQuestions: questions.length,
      correctAnswers,
      percentage: ((correctAnswers / questions.length) * 100).toFixed(2),
    };
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return (
      <Container>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Container>
    );
  }

  if (showResults) {
    const results = calculateResults();
    return (
      <Container>
        <Typography variant="h4" gutterBottom>
          Результаты теста
        </Typography>
        <Typography variant="h6">Общее количество вопросов: {results.totalQuestions}</Typography>
        <Typography variant="h6">Количество правильных ответов: {results.correctAnswers}</Typography>
        <Typography variant="h6">Процент правильных ответов: {results.percentage}%</Typography>
        <Button variant="contained" onClick={() => navigate("/quiz")} sx={{ mt: 2 }}>
          Закрыть
        </Button>
      </Container>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <Container>
      {/* Заголовок "Пройти тест" */}
      <Typography variant="h4" gutterBottom align="center">
        Пройти тест
      </Typography>

      {/* Название теста */}
      <Typography variant="h5" gutterBottom align="center">
        {quizTitle}
      </Typography>

      {/* Все элементы внутри одного контейнера */}
      <Box sx={{ mb: 4, padding: 2, borderRadius: 2, boxShadow: 2, minHeight: "40vh", minWidth: "40vw" }}>
        {/* Количество вопросов */}
        <Typography variant="h6" align="center" sx={{ marginBottom: 2 }}>
          Количество вопросов: {questionCount}
        </Typography>

        {/* Вопрос и варианты ответов */}
        <Card sx={{ mb: 2, minHeight: "auto", minWidth: "auto" }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Вопрос {currentQuestionIndex + 1}: {currentQuestion.title}
            </Typography>

            {/* Сетка кнопок */}
            <Grid container spacing={2}>
              {currentQuestion.answers.map((answer, index) => (
                <Grid item xs={6} key={answer.id}>
                  <Button
                    variant="outlined"
                    fullWidth
                    color={selectedAnswers[currentQuestion.id] === answer.id.toString() ? "primary" : "default"}
                    onClick={() => handleAnswerSelect(currentQuestion.id, answer.id)}
                  >
                    {answer.answer_text}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        {/* Навигация по вопросам */}
        <Stack direction="row" spacing={2} justifyContent="space-between" mt={3}>
          <Button
            variant="outlined"
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
          >
            Предыдущий
          </Button>
          <Button
            variant="contained"
            onClick={handleNextQuestion}
            disabled={currentQuestionIndex === questions.length - 1} // Отключить кнопку на последнем вопросе
          >
            Следующий вопрос
          </Button>
        </Stack>
      </Box>

      {/* Кнопка завершения теста всегда видна */}
      <Button variant="contained" onClick={() => setShowResults(true)} sx={{ mt: 3 }} fullWidth>
        Завершить тест
      </Button>
    </Container>
  );
}

export default QuizDetails;
