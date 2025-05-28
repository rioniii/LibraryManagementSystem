import React, { useEffect, useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Container,
    IconButton,
    Avatar,
    useTheme,
    useMediaQuery,
    Drawer,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Divider,
    Tooltip,
    Switch
} from '@mui/material';
import {
    Menu as MenuIcon,
    Home as HomeIcon,
    Book as BookIcon,
    Dashboard as DashboardIcon,
    Person as PersonIcon,
    ExitToApp as LogoutIcon,
    Login as LoginIcon,
    PersonAdd as RegisterIcon,
    LibraryBooks as LibraryIcon,
    Info as InfoIcon,
    ContactMail as ContactMailIcon,
    MenuBook as MenuBookIcon,
    Brightness7 as Brightness7Icon,
    Brightness4 as Brightness4Icon
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import authService from '../services/authService';
import { useThemeContext } from '../ThemeContext';

function Navbar() {
    const [userInfo, setUserInfo] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate();
    const location = useLocation();
    const { mode, toggleColorMode } = useThemeContext();

    useEffect(() => {
        const checkAuth = async () => {
            const user = await authService.getCurrentUser();
            setUserInfo(user);
        };
        checkAuth();
    }, [location.pathname]);

    const handleLogout = () => {
        authService.logout();
        setUserInfo(null);
        navigate('/login');
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const menuItems = [
        { text: 'Home', icon: <HomeIcon />, path: '/' },
        { text: 'Books', icon: <BookIcon />, path: '/books' },
        { text: 'About', icon: <InfoIcon />, path: '/about' },
        ...(userInfo ? [{ text: 'Contact', icon: <ContactMailIcon />, path: '/contact' }] : []),
        ...(userInfo ? [{ text: 'My Books', icon: <MenuBookIcon />, path: '/my-books' }] : []),
        ...(userInfo?.roles?.includes('Admin') ? [{ text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' }] : []),
    ];

    const isActive = (path) => location.pathname === path;

    const drawer = (
        <Box sx={{ width: 250 }} role="presentation">
            <List>
                {menuItems.map((item) => (
                    <ListItem
                        button
                        key={item.text}
                        component={RouterLink}
                        to={item.path}
                        onClick={handleDrawerToggle}
                        selected={isActive(item.path)}
                        sx={{
                            '&.Mui-selected': {
                                backgroundColor: 'primary.light',
                                '&:hover': {
                                    backgroundColor: 'primary.light',
                                },
                            },
                        }}
                    >
                        <ListItemIcon sx={{ color: isActive(item.path) ? 'primary.main' : 'inherit' }}>
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText
                            primary={item.text}
                            primaryTypographyProps={{
                                color: isActive(item.path) ? 'primary.main' : 'inherit',
                                fontWeight: isActive(item.path) ? 'bold' : 'normal'
                            }}
                        />
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                <ListItem>
                    <ListItemIcon>{mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}</ListItemIcon>
                    <ListItemText primary="Dark Mode" />
                    <Switch edge="end" onChange={toggleColorMode} checked={mode === 'dark'} />
                </ListItem>
            </List>
            <Divider />
            {userInfo ? (
                <List>
                    <ListItem
                        button
                        component={RouterLink}
                        to="/profile"
                        onClick={handleDrawerToggle}
                        selected={isActive('/profile')}
                    >
                        <ListItemIcon>
                            <PersonIcon />
                        </ListItemIcon>
                        <ListItemText primary="Profile" />
                    </ListItem>
                    <ListItem button onClick={handleLogout}>
                        <ListItemIcon>
                            <LogoutIcon />
                        </ListItemIcon>
                        <ListItemText primary="Logout" />
                    </ListItem>
                </List>
            ) : (
                <List>
                    <ListItem
                        button
                        component={RouterLink}
                        to="/login"
                        onClick={handleDrawerToggle}
                        selected={isActive('/login')}
                    >
                        <ListItemIcon>
                            <LoginIcon />
                        </ListItemIcon>
                        <ListItemText primary="Login" />
                    </ListItem>
                    <ListItem
                        button
                        component={RouterLink}
                        to="/register"
                        onClick={handleDrawerToggle}
                        selected={isActive('/register')}
                    >
                        <ListItemIcon>
                            <RegisterIcon />
                        </ListItemIcon>
                        <ListItemText primary="Register" />
                    </ListItem>
                </List>
            )}
        </Box>
    );

    return (
        <AppBar position="fixed" color="default" elevation={1} sx={{ bgcolor: 'background.paper' }}>
            <Container maxWidth="lg">
                <Toolbar disableGutters>
                    <Typography
                        variant="h6"
                        noWrap
                        component={RouterLink}
                        to="/"
                        sx={{
                            flexGrow: 1,
                            color: 'primary.main',
                            textDecoration: 'none',
                            fontWeight: 700,
                            letterSpacing: 1,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}
                    >
                        <LibraryIcon />
                        Global Digital Library
                    </Typography>

                    {isMobile ? (
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ ml: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                    ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            {menuItems.map((item) => (
                                <Tooltip key={item.text} title={item.text}>
                                    <Button
                                        component={RouterLink}
                                        to={item.path}
                                        color={isActive(item.path) ? 'primary' : 'inherit'}
                                        startIcon={item.icon}
                                        sx={{
                                            fontWeight: isActive(item.path) ? 'bold' : 'normal',
                                            '&:hover': {
                                                backgroundColor: 'primary.light',
                                            },
                                        }}
                                    >
                                        {item.text}
                                    </Button>
                                </Tooltip>
                            ))}

                            <Tooltip title="Toggle Dark Mode">
                                <IconButton color="inherit" onClick={toggleColorMode}>
                                    {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                                </IconButton>
                            </Tooltip>

                            {userInfo ? (
                                <>
                                    <Tooltip title={`${userInfo.firstName} ${userInfo.lastName}`}>
                                        <Avatar
                                            alt={userInfo.userName}
                                            src={userInfo.profilePicture}
                                            sx={{ width: 32, height: 32 }}
                                        />
                                    </Tooltip>
                                    <Button
                                        variant="outlined"
                                        color="inherit"
                                        startIcon={<LogoutIcon />}
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                <Box>
                                    <Button color="inherit" component={RouterLink} to="/login" sx={{ mr: 1 }}>Login</Button>
                                    <Button variant="contained" component={RouterLink} to="/register">Register</Button>
                                </Box>
                            )}
                        </Box>
                    )}
                </Toolbar>
            </Container>
            <Drawer
                anchor="right"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true,
                }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
                }}
            >
                {drawer}
            </Drawer>
        </AppBar>
    );
}

export default Navbar;
