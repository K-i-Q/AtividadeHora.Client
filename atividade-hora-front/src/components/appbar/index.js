import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import AdbIcon from '@mui/icons-material/Adb';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import { useLocation } from 'react-router-dom';



const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

function ResponsiveAppBar({ handleLoginClick, isLogado, handleOpenModalEmail, logout }) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    
    const location = useLocation();

    const handleOpenMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleClickSetting = (setting) =>{
        if(setting === 'Logout'){
            logout();
        }
    }

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                    <Typography
                        variant="h6"
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        Oliveira
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>

                    </Box>
                    <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="menu"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenMenu}
                            color="inherit"
                        >
                            <AdbIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorEl)}
                            onClose={handleCloseMenu}
                        >
                        </Menu>
                    </Box>
                    {isLogado ?
                        <Box sx={{ flexGrow: 0 }}>
                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <Avatar alt="Remy Sharp" src={''} />
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                {settings.map((setting) => (
                                    <MenuItem key={setting} onClick={handleCloseUserMenu}>
                                        <Typography textAlign="center" onClick={() => handleClickSetting(setting)}>{setting}</Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                        : <>
                            <Button color="inherit" onClick={() => handleLoginClick(true,null,null,null)}>
                                Login com Google
                            </Button>
                            <Button color="inherit" onClick={() => handleOpenModalEmail()}>
                                Login com email e senha
                            </Button>
                        </>
                    }
                </Toolbar>
            </AppBar>
        </>
    );
}

export default ResponsiveAppBar;
