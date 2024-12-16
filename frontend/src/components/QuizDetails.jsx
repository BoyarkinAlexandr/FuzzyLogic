import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Button,
  Container,
  Grid,
  Typography,
  Box,
  CircularProgress,
  Stack,
  Card,
  CardContent,
} from "@mui/material";

function QuizDetails() {
  const { id } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [quizTitle, setQuizTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/v1/quiz/question/quiz/${id}/`)
      .then((response) => {
        if (response.data?.length) {
          setQuestions(response.data);
          setQuizTitle(response.data[0]?.quiz?.title || "Название викторины");
        } else {
          setError("Вопросы не найдены.");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Ошибка загрузки данных.");
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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentQuestionIndex]);

  if (loading) return <CircularProgress />;

  if (error) {
    return (
      <Container>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Container>
    );
  }

  if (!questions.length) {
    return (
      <Container>
        <Typography variant="h6" color="textSecondary">
          Вопросов нет.
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
      <Typography variant="h4" gutterBottom align="center">
        Пройти тест
      </Typography>
      <Typography variant="h5" gutterBottom align="center">
        {quizTitle}
      </Typography>
      <Box sx={{ mb: 4, p: 2, borderRadius: 2, boxShadow: 2, minHeight: "40vh" }}>
        <Typography variant="h6" align="center" sx={{ mb: 2 }}>
          Вопрос {currentQuestionIndex + 1}/{questions.length}
        </Typography>
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {currentQuestion.title}
            </Typography>
            <Grid container spacing={2}>
              {currentQuestion.answers.map((answer) => (
                <Grid item xs={6} key={answer.id}>
                  <Button
                    variant={
                      selectedAnswers[currentQuestion.id] === answer.id.toString()
                        ? "contained"
                        : "outlined"
                    }
                    fullWidth
                    onClick={() => handleAnswerSelect(currentQuestion.id, answer.id)}
                  >
                    {answer.answer_text}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
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
            onClick={
              currentQuestionIndex === questions.length - 1
                ? () => setShowResults(true)
                : handleNextQuestion
            }
          >
            {currentQuestionIndex === questions.length - 1 ? "Завершить" : "Следующий вопрос"}
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}

export default QuizDetails;
