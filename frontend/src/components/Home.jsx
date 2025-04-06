import React, { lazy, Suspense } from 'react';
import { Card, CardContent, CardMedia, Button, Typography, Box, Grid } from '@mui/material';
import { Link } from 'react-router-dom';

const Accordion = lazy(() => import('@mui/material/Accordion'));
const AccordionSummary = lazy(() => import('@mui/material/AccordionSummary'));
const AccordionDetails = lazy(() => import('@mui/material/AccordionDetails'));
const ExpandMoreIcon = lazy(() => import('@mui/icons-material/ExpandMore'));

const methods = [
  { id: 1, name: "Графы", description: "Краткое описание метода 1. Этот метод помогает решать задачи оптимизации.", imageUrl: "./images/graph.webp", link: "/graphs" },
  { id: 2, name: "Композиция", description: "Краткое описание метода 2. Этот метод используется для анализа данных.", imageUrl: "./images/matrixx.webp", link: "/compozition" },
  { id: 3, name: "Функции принадлежности", description: "Краткое описание метода 3. Этот метод позволяет решать задачи с многими переменными.", imageUrl: "./images/function.webp", link: "/member" },
  { id: 4, name: "α-сечениe", description: "Краткое описание метода 4. Этот метод полезен для работы с большими данными.", imageUrl: "./images/alfa.webp", link: "/asection" },
  { id: 5, name: "Основные операции нечетких множеств", description: "Краткое описание метода 5. Этот метод помогает в задачах с искусственным интеллектом.", imageUrl: "./images/union.png", link: "/fuzzycalculator" },
];

const Home = ({ searchQuery }) => {
  const filteredMethods = methods.filter((method) =>
    (method.name || '').toLowerCase().includes((searchQuery || '').toLowerCase())
  );

  const isSingleMatch = filteredMethods.length === 1;

  return (
    <Box sx={{ padding: { xs: 1, sm: 3 }, maxWidth: '100%' }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Главная страница
      </Typography>
      <Grid
        container
        spacing={{ xs: 1, sm: 2 }}
        justifyContent="center"
        sx={{
          width: { xs: '100%', md: isSingleMatch ? '1000px' : '100%' },
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        {filteredMethods.length === 0 ? (
          <Grid item xs={12}>
            <Typography variant="h6" align="center">
              Нет совпадений для "{searchQuery}"
            </Typography>
          </Grid>
        ) : (
          filteredMethods.map((method) => (
            <Grid item xs={12} sm={6} md={4} key={method.id} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Card sx={{ width: '100%', maxWidth: 345 }}>
                
                <CardMedia
                  component="img"
                  image={method.imageUrl || "/images/default-image.webp"}
                  alt={method.name}
                  loading="lazy"
                  sx={{
                    height: { xs: 100, sm: 140 },
                    width: '100%',
                    objectFit: 'contain',
                  }}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {method.name}
                  </Typography>
                  <Suspense fallback={<Typography variant="body2">Загрузка...</Typography>}>
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={`panel-${method.id}-content`}
                        id={`panel-${method.id}-header`}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Краткое описание
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography variant="body2" color="text.secondary">
                          {method.description}
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  </Suspense>
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <Link to={method.link}>
                      <Button variant="contained" color="primary" size="small">
                        Перейти
                      </Button>
                    </Link>
                  </Box>
                </CardContent>
                
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
};

export default Home;