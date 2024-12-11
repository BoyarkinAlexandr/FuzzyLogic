import React, { useState } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';
import axios from 'axios';
import { MathJax, MathJaxContext } from 'better-react-mathjax';

function Asection() {
  const [inputValues, setInputValues] = useState('');
  const [set1, setSet1] = useState('');
  const [set2, setSet2] = useState('');
  const [result, setResult] = useState(null);
  const [steps, setSteps] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'inputValues') {
      setInputValues(value);
    } else if (name === 'set1') {
      setSet1(value);
    } else if (name === 'set2') {
      setSet2(value);
    }
  };

  const handleSubmit = () => {
    const parsedInputValues = inputValues.split(',').map(Number).filter(val => !isNaN(val));
    const parsedSet1 = set1.split(',').map(Number).filter(val => !isNaN(val));
    const parsedSet2 = set2.split(',').map(Number).filter(val => !isNaN(val));

    if (!parsedInputValues.length || !parsedSet1.length || !parsedSet2.length) {
      console.error("Некорректные входные данные");
      return;
    }

    axios.post('http://localhost:8000/asection/calculate/', {
      input_values: parsedInputValues,
      sets: [parsedSet1, parsedSet2],
    }).then(response => {
      console.log(response.data); // Логирование данных
      setResult(response.data.result);
      setSteps(response.data.steps);
    }).catch(error => {
      console.error(error);
    });
  };

  // Функция для вычисления пересечения двух множеств
  const getIntersection = (set1, set2) => {
    return set1.filter(value => set2.includes(value));
  };

  // Получаем пересечение Set1 и Set2
  const intersection = getIntersection(set1.split(',').map(Number), set2.split(',').map(Number));

  // Функция для подсчета нечётных чисел
  const countOddNumbers = (values) => {
    return values.filter(num => num % 2 !== 0).length;
  };

  // Подсчитываем нечётные числа
  const oddIndexCount = countOddNumbers(inputValues.split(',').map(Number));

  return (
    <MathJaxContext>
      <Box>
        <Typography variant="h4" gutterBottom>α-сечение, Степень включения, Индекс нечётности</Typography>

        <TextField
          label="Введите значения (точка с запятой)"
          variant="outlined"
          name="inputValues"
          value={inputValues}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Первое множество (точка с запятой)"
          variant="outlined"
          name="set1"
          value={set1}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Второе множество (точка с запятой)"
          variant="outlined"
          name="set2"
          value={set2}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />

        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          fullWidth
          style={{ marginTop: '16px' }}
        >
          Рассчитать
        </Button>

        {result && (
          <Box style={{ marginTop: '24px' }}>
            <Typography variant="h6">Результаты вычислений</Typography>

            {/* Alpha Section */}
            <Box style={{
              border: '1px solid #ccc', padding: '16px', marginTop: '8px', borderRadius: '4px', textAlign: 'left'
            }}>
              <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>α-сечение:</Typography>
              <MathJax>{`\\( \\text{Формула: } \\alpha \\text{-сечение} = \\text{sum(values)} \\)`}</MathJax>
              <Typography>Шаги:</Typography>
              <Typography>{`У вас есть входные значения = [${inputValues}].`}</Typography>
              <Typography>{`Сложим все элементы: ${inputValues} = ${result?.alpha_section || 'не определено'}`}</Typography>
              <MathJax>{`\\( \\text{Результат: } \\alpha \\text{-сечение} = ${result?.alpha_section || 'не определено'} \\)`}</MathJax>
            </Box>

            {/* Inclusion Degree */}
            <Box style={{
              border: '1px solid #ccc', padding: '16px', marginTop: '8px', borderRadius: '4px', textAlign: 'left'
            }}>
              <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>Степень включения:</Typography>
              <MathJax>{`\\( \\text{Формула: } \\text{Степень включения} = \\frac{|Set1 \\cap Set2|}{|Set1|} \\)`}</MathJax>
              <Typography>Шаги:</Typography>
              <Typography>{`1 множество = [${set1}], 2 множество = [${set2}].`}</Typography>
              <Typography>{`Пересечение 1 ∩ 2 множества = [${intersection.length ? intersection.join(', ') : 'не определено'}].`}</Typography>
              <Typography>{`Размер пересечения: |1 ∩ 2| множества = ${intersection.length || 'не определено'}.`}</Typography>
              <Typography>{`Размер множества  = ${set1.split(',').length || 'не определено'}.`}</Typography>
              <MathJax>{`\\( \\text{Подставляем в формулу: } \\frac{|[${set1}] \\cap [${set2}]|}{|[${set1}]|} = ${result?.inclusion_degree || 'не определено'} \\)`}</MathJax>
              <MathJax>{`\\( \\text{Результат: Степень включения} = ${result?.inclusion_degree || 'не определено'} \\)`}</MathJax>
            </Box>

            {/* Odd Index */}
            <Box style={{
              border: '1px solid #ccc', padding: '16px', marginTop: '8px', borderRadius: '4px', textAlign: 'left'
            }}>
              <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>Индекс нечётности:</Typography>
              <MathJax>{`\\( \\text{Формула: } \\text{Индекс нечётности} = \\text{Количество нечётных чисел} \\)`}</MathJax>
              <Typography>Шаги:</Typography>
              <Typography>{`Значения = [${inputValues}].`}</Typography>
              <Typography>{`Проверяем каждый элемент: [${inputValues.split(',').map(Number).join(', ')}]`}</Typography>
              <Typography>{`Количество нечётных чисел: ${oddIndexCount || 'не определено'}.`}</Typography>
              <MathJax>{`\\( \\text{Результат: Индекс нечётности} = ${oddIndexCount || 'не определено'} \\)`}</MathJax>
            </Box>
          </Box>
        )}
      </Box>
    </MathJaxContext>
  );
}

export default Asection;