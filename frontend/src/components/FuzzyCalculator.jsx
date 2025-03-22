import { useState } from 'react';
import {
  TextField,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
} from '@mui/material';
import VennDiagram from './VennDiagram';
import axios from 'axios';

function FuzzyCalculator() {
  const [inputs, setInputs] = useState(['']);
  const [operation, setOperation] = useState('');
  const [alpha, setAlpha] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (index, value) => {
    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);
  };

  const addSet = () => setInputs([...inputs, '']);

  const parseSets = () => {
    return inputs
      .filter(input => input.trim())
      .map(input => {
        return input.split(',').reduce((acc, pair) => {
          const [element, val] = pair.split(':');
          acc[element.trim()] = parseFloat(val);
          return acc;
        }, {});
      });
  };

  const handleCalculate = async () => {
    const sets = parseSets();
    if (!operation || sets.length === 0) {
      setError('Пожалуйста, выберите операцию и введите хотя бы одно множество.');
      return;
    }

    setError(null);
    try {
      const response = await axios.post(
        'http://localhost:8000/api/fuzzy_operations/calculate_oper/',
        { operation, sets, alpha: operation === 'alphaCut' ? alpha : null }
      );
      setResult({ computed: response.data.result, originalSets: sets });
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка при выполнении запроса.');
    }
  };

  const reset = () => {
    setInputs(['']);
    setOperation('');
    setAlpha('');
    setResult(null);
    setError(null);
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Grid container spacing={2}>
        {inputs.map((input, index) => (
          <Grid item xs={12} key={index}>
            <TextField
              fullWidth
              label={`Множество ${index + 1} (формат: x:0.3, y:0.7)`}
              value={input}
              onChange={(e) => handleInputChange(index, e.target.value)}
            />
          </Grid>
        ))}
        <Grid item xs={12}>
          <Button variant="contained" onClick={addSet}>
            Добавить множество
          </Button>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Операция</InputLabel>
            <Select value={operation} onChange={(e) => setOperation(e.target.value)}>
              <MenuItem value="union">Объединение</MenuItem>
              <MenuItem value="intersection">Пересечение</MenuItem>
              <MenuItem value="difference">Разность (первое минус остальные)</MenuItem>
              <MenuItem value="complement">Дополнение (первое множество)</MenuItem>
              <MenuItem value="concentration">Концентрирование (первое множество)</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        {operation === 'alphaCut' && (
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Значение альфа (0-1)"
              value={alpha}
              onChange={(e) => setAlpha(e.target.value)}
              type="number"
              inputProps={{ min: 0, max: 1, step: 0.1 }}
            />
          </Grid>
        )}
        <Grid item xs={6}>
          <Button variant="contained" color="primary" onClick={handleCalculate} fullWidth>
            Вычислить
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button variant="outlined" color="secondary" onClick={reset} fullWidth>
            Сбросить
          </Button>
        </Grid>
        {error && (
          <Grid item xs={12}>
            <Typography color="error">{error}</Typography>
          </Grid>
        )}
        {result && (
          <>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mt: 2 }}>
                Результат:
              </Typography>
              <pre>{JSON.stringify(result.computed, null, 2)}</pre>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mt: 2 }}>
                График:
              </Typography>
              <VennDiagram result={result} />
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  );
}

export default FuzzyCalculator;