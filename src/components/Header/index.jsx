import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import CloseIcon from '@mui/icons-material/Close';

const Header = ({ onThemeToggle, isDarkMode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const isActive = (path) => location.pathname === path;

  const navigationItems = [
    { path: '/pc/input', label: 'PC 데이터 입력' },
    { path: '/pc/view', label: 'PC 데이터 조회' },
    { path: '/appointment', label: '도원한의원' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const renderNavigationButtons = () => (
    <>
      {navigationItems.map((item) => (
        <Button
          key={item.path}
          onClick={() => handleNavigation(item.path)}
          sx={{
            mx: { xs: 0.5, md: 1 },
            px: { xs: 1.5, md: 2 },
            py: 1,
            color: isActive(item.path) ? 'primary.contrastText' : 'text.secondary',
            backgroundColor: isActive(item.path) 
              ? 'primary.main' 
              : (item.path === '/appointment' ? 'secondary.main' : 'transparent'),
            '&:hover': {
              backgroundColor: isActive(item.path)
                ? 'primary.dark'
                : (item.path === '/appointment' ? 'secondary.dark' : 'action.hover'),
            },
            fontWeight: item.path === '/appointment' ? 600 : 500,
          }}
        >
          {item.label}
        </Button>
      ))}
    </>
  );

  const drawer = (
    <Box sx={{ width: 250, pt: 2, bgcolor: 'background.paper', height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 2, mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          메뉴
        </Typography>
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Box>
      <List>
        {navigationItems.map((item) => (
          <ListItem
            key={item.path}
            onClick={() => handleNavigation(item.path)}
            sx={{
              bgcolor: isActive(item.path) ? 'primary.main' : 'transparent',
              mx: 1,
              borderRadius: 2,
              mb: 1,
              '&:hover': {
                bgcolor: isActive(item.path) ? 'primary.dark' : 'action.hover',
              },
            }}
          >
            <ListItemText
              primary={item.label}
              sx={{
                color: isActive(item.path) ? 'primary.contrastText' : 'text.primary',
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        borderBottom: `1px solid ${theme.palette.divider}`,
        backdropFilter: 'blur(8px)',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography
            variant="h6"
            component="div"
            onClick={() => handleNavigation('/')}
            sx={{
              cursor: 'pointer',
              fontWeight: 700,
              color: 'text.primary',
              fontSize: { xs: '1.1rem', md: '1.25rem' },
            }}
          >
            맥파 측정 시스템
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {!isMobile && (
            <Box sx={{ display: 'flex', mr: 2 }}>
              {renderNavigationButtons()}
            </Box>
          )}
          <IconButton onClick={onThemeToggle} color="inherit">
            {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Box>

        <Drawer
          variant="temporary"
          anchor="left"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better mobile performance
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: 250,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};

export default Header;