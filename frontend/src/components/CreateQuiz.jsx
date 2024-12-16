import React, { useState } from "react";
import axios from "axios";
import { Box, Typography, TextField, Button, Stack, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { useNavigate } from "react-router-dom";

function CreateQuiz() {
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  const [questions, setQuestions] = useState([{ question: "", answers: [{ answer_text: "", is_right: false }] }]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleTitleChange = (event) => {
    setQuizTitle(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setQuizDescription(event.target.value);
  };

  const handleQuestionChange = (index, event) => {
    const newQuestions = [...questions];
    newQuestions[index].question = event.target.value;
    setQuestions(newQuestions);
  };

  const handleAnswerChange = (questionIndex, answerIndex, event) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].answers[answerIndex].answer_text = event.target.value;
    setQuestions(newQuestions);
  };

  const handleCorrectAnswerChange = (questionIndex, answerIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].answers.forEach((answer, idx) => {
      answer.is_right = idx === answerIndex;
    });
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", answers: [{ answer_text: "", is_right: false }] }
    ]);
  };

  const addAnswer = (index) => {
    const newQuestions = [...questions];
    newQuestions[index].answers.push({ answer_text: "", is_right: false });
    setQuestions(newQuestions);
  };

  const handleSubmit = () => {
    setLoading(true);
    const quizData = {
      title: quizTitle,
      description: quizDescription,
      questions: questions.map((q) => ({
        question: q.question,
        answers: q.answers.map((a) => ({
          answer_text: a.answer_text,
          is_right: a.is_right
        }))
      }))
    };

    // Логирование данных, чтобы проверить, что отправляется
    console.log("Sending quiz data:", JSON.stringify(quizData, null, 2));

    axios.post("http://localhost:8000/api/v1/quiz/", quizData)
      .then(() => {
        setLoading(false);
        navigate("/quiz");
      })
      .catch((error) => {
        setLoading(false);
        // Логирование ошибок
        if (error.response) {
          console.error("Ошибка при создании теста:", error.response.data);
          alert(`Ошибка: ${error.response.data.detail || 'Неверные данные'}`);
        } else {
          console.error("Ошибка при создании теста:", error.message);
          alert('Произошла ошибка при отправке запроса');
        }
      });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Создание нового теста</Typography>

      <TextField
        label="Название теста"
        fullWidth
        value={quizTitle}
        onChange={handleTitleChange}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Описание теста"
        fullWidth
        value={quizDescription}
        onChange={handleDescriptionChange}
        sx={{ mb: 2 }}
      />

      {questions.map((q, qIndex) => (
        <Box key={qIndex} sx={{ mb: 3 }}>
          <TextField
            label={`Вопрос ${qIndex + 1}`}
            fullWidth
            value={q.question}
            onChange={(e) => handleQuestionChange(qIndex, e)}
            sx={{ mb: 2 }}
          />
          {q.answers.map((answer, aIndex) => (
            <Box key={aIndex} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <TextField
                label={`Ответ ${aIndex + 1}`}
                value={answer.answer_text}
                onChange={(e) => handleAnswerChange(qIndex, aIndex, e)}
                sx={{ flexGrow: 1 }}
              />
              <FormControlLabel
                control={
                  <Radio
                    checked={answer.is_right}
                    onChange={() => handleCorrectAnswerChange(qIndex, aIndex)}
                  />
                }
                label="Правильный ответ"
                sx={{ ml: 2 }}
              />
            </Box>
          ))}
          <Button
            variant="outlined"
            onClick={() => addAnswer(qIndex)}
            sx={{ mb: 2 }}
          >
            Добавить ответ
          </Button>
        </Box>
      ))}

      <Button variant="outlined" onClick={addQuestion}>Добавить вопрос</Button>

      <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || !quizTitle || !quizDescription || questions.length === 0}
        >
          {loading ? "Сохраняю..." : "Создать тест"}
        </Button>
        <Button
          variant="outlined"
          onClick={() => navigate("/quiz")}
        >
          Отменить
        </Button>
      </Stack>
    </Box>
  );
}

export default CreateQuiz;
