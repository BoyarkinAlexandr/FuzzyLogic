import React from 'react';
import { Card, CardContent, CardMedia, Button, Typography, Box, Accordion, AccordionSummary, AccordionDetails, Grid } from '@mui/material';
import { Link } from 'react-router-dom'; 
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'; 

const methods = [
  {
    id: 1,
    name: "Метод 1",
    description: "Краткое описание метода 1. Этот метод помогает решать задачи оптимизации.",
    imageUrl: "https://via.placeholder.com/150",
    link: "/method1"
  },
  {
    id: 2,
    name: "Метод 2",
    description: "Краткое описание метода 2. Этот метод используется для анализа данных.",
    imageUrl: "https://via.placeholder.com/150",
    link: "/method2"
  },
  {
    id: 3,
    name: "Метод 3",
    description: "Краткое описание метода 3. Этот метод позволяет решать задачи с многими переменными.",
    imageUrl: "https://via.placeholder.com/150",
    link: "/method3"
  },
  {
    id: 4,
    name: "Метод 4",
    description: "Краткое описание метода 4. Этот метод полезен для работы с большими данными.",
    imageUrl: "https://via.placeholder.com/150",
    link: "/method4"
  },
  {
    id: 5,
    name: "Метод 5",
    description: "Краткое описание метода 5. Этот метод помогает в задачах с искусственным интеллектом.",
    imageUrl: "https://via.placeholder.com/150",
    link: "/method5"
  },
  {
    id: 6,
    name: "Метод 6",
    description: "Краткое описание метода 6. Этот метод используется в экономике для прогнозирования.",
    imageUrl: "https://via.placeholder.com/150",
    link: "/method6"
  },
  {
    id: 7,
    name: "Метод 7",
    description: "Краткое описание метода 7. Этот метод применяется в области биоинформатики.",
    imageUrl: "https://via.placeholder.com/150",
    link: "/method7"
  },
  {
    id: 8,
    name: "Метод 8",
    description: "Краткое описание метода 8. Этот метод используется для машинного обучения.",
    imageUrl: "https://via.placeholder.com/150",
    link: "/method8"
  },
  {
    id: 9,
    name: "Метод 9",
    description: "Краткое описание метода 9. Этот метод помогает в задачах статистики.",
    imageUrl: "https://via.placeholder.com/150",
    link: "/method9"
  },
  {
    id: 10,
    name: "Метод 10",
    description: "Краткое описание метода 10. Этот метод используется для работы с нейросетями.",
    imageUrl: "https://via.placeholder.com/150",
    link: "/method10"
  }
];

const Home = ({ searchQuery }) => {
  const filteredMethods = methods.filter((method) => {
    const name = method.name || '';  
    return name.toLowerCase().includes((searchQuery || '').toLowerCase());
  });

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom align="center">
        Главная страница
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {filteredMethods.length === 0 ? (
          <Typography variant="h6" align="center">
            Нет совпадений для "{searchQuery}"
          </Typography>
        ) : (
          filteredMethods.map((method) => (
            <Grid item xs={12} sm={6} md={4} key={method.id}>
              <Card sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={method.imageUrl}
                  alt={method.name}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {method.name}
                  </Typography>

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

                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <Link to={method.link}>
                      <Button variant="contained" color="primary">
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
