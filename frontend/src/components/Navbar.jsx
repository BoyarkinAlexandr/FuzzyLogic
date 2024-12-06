import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import AppsIcon from '@mui/icons-material/Apps';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import LineAxisIcon from '@mui/icons-material/LineAxis';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { Link, useLocation } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import AirlineStopsIcon from '@mui/icons-material/AirlineStops';

const drawerWidth = 240;

export default function Navbar({ content, onSearch }) {
  const location = useLocation();

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* Заголовок слева */}
          <Typography variant="h6" noWrap component="div">
            Нечеткая логика
          </Typography>

          {/* Поле поиска по центру */}
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center'}}>
            <TextField
              label="Поиск товаров"
              variant="outlined"
              size="small"
              onChange={(e) => onSearch(e.target.value)} // Отправляем введённый текст в родительский компонент
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderWidth: 2, // Увеличиваем толщину ободка
                  },
                },
              }}
              
            />
          </Box>

          {/* Иконка профиля и текст рядом с ней */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body1" sx={{ marginRight: 1 }}>
              Username {/* Простой текст "Username" */}
            </Typography>
            <IconButton
              color="inherit"
              component={Link}
              to="/auth" // Переход на страницу регистрации
            >
              <AccountCircle />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Боковая панель с навигацией */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          {/* Главная страница */}
          <ListItem key={1} disablePadding>
            <ListItemButton component={Link} to="/" selected={"/" === location.pathname}>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary={"Главная страница"} />
            </ListItemButton>
          </ListItem>

          {/* Графы */}
          <ListItem key={1} disablePadding>
            <ListItemButton component={Link} to="/graphs" selected={"/graphs" === location.pathname}>
              <ListItemIcon>
                <AirlineStopsIcon />
              </ListItemIcon>
              <ListItemText primary={"Графы"} />
            </ListItemButton>
          </ListItem>

          {/* Композиция */}
          <ListItem key={2} disablePadding>
            <ListItemButton component={Link} to="/compozition" selected={"/compozition" === location.pathname}>
              <ListItemIcon>
                <AppsIcon />
              </ListItemIcon>
              <ListItemText primary={"Композиция"} />
            </ListItemButton>
          </ListItem>

          {/* Графические функции */}
          <ListItem key={2} disablePadding>
            <ListItemButton component={Link} to="/member" selected={"/member" === location.pathname}>
              <ListItemIcon>
                <LineAxisIcon />
              </ListItemIcon>
              <ListItemText primary={"Графические функции"} />
            </ListItemButton>
          </ListItem>
        </Box>
      </Drawer>

      {/* Основной контент */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {content}
      </Box>
    </Box>
  );
}
