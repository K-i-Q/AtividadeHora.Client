import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import AdbIcon from "@mui/icons-material/Adb";
import Tooltip from "@mui/material/Tooltip";
import Avatar from "@mui/material/Avatar";
import MenuItem from "@mui/material/MenuItem";
import BlurOnIcon from "@mui/icons-material/BlurOn";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth";

const settings = [
  { label: "Perfil" },
  { label: "Administrativo" },
  { label: "Sair" },
];

function ResponsiveAppBar() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const navigate = useNavigate();
  const { isLogado, setIsLogado } = useAuth();

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

  const navigatePerfil = () => {
    navigate("perfil");
  };

  const logout = () => {
    localStorage.setItem("email", "");
    setIsLogado(false);
    navigate("/");
  };

  const handleClickSetting = (setting) => {
    debugger;
    switch (setting) {
      case "Sair":
        logout();
        break;
      case "Perfil":
        navigatePerfil();
        break;
      case "Administrativo":
        break;
      default:
        break;
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <BlurOnIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Typography
            variant="h6"
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Oliveira
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}></Box>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
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
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleCloseMenu}
            ></Menu>
          </Box>
          {isLogado ? (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Remy Sharp" src={""} />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem key={setting.label} onClick={handleCloseUserMenu}>
                    <Typography
                      textAlign="right"
                      sx={{ width: "100%", marginLeft: "auto" }}
                      onClick={() => handleClickSetting(setting.label)}
                    >
                      {setting.label}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          ) : (
            <></>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
}

export default ResponsiveAppBar;
