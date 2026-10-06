import React, { useState , useEffect, useContext} from 'react';
import {
  AppBar,
  Toolbar,
  InputBase,
  Box,
  IconButton,
  Tabs,
  Tab,
  Menu,
  MenuItem,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import LoginIcon from '@mui/icons-material/Login';
import PersonIcon from '@mui/icons-material/Person';
import Logo from '../../assets/images/zodealsLogo.png';
import { useNavigate, useLocation } from 'react-router-dom';
import Badge from '@mui/material/Badge';
import { hosturl } from '../libs/Constant';
import SearchResults from '../Serachresults/searchResult';
import { SearchContext } from './SearchContext';
import CloseIcon from '@mui/icons-material/Close'; // 🆕

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: 20,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  border: '1px solid #ccc',
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    width: '500px',
  },
  [theme.breakpoints.down('xs')]: {
    width: 'calc(100% - 60px)',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#555',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  paddingLeft: `calc(1em + ${theme.spacing(4)})`,
  width: '100%',
}));

export default function Header({ showTabs = true }) {
  const { searchQuery, setSearchQuery } = useContext(SearchContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);

  const token = localStorage.getItem('token');
const [notificationCount, setNotificationCount] = useState(0);

useEffect(() => {
  const fetchNotificationCount = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`${hosturl}/notification/count`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok && data.status && typeof data.result === 'number') {
        setNotificationCount(data.result);
      }
    } catch (error) {
      console.error('Failed to fetch notification count:', error);
    }
  };

  fetchNotificationCount();
}, []);

  const pathToIndex = {
    '/': 0,
    '/stores': 1,
    '/categories': 2,
  };

  const indexToPath = {
    0: '/',
    1: '/stores',
    2: '/categories',
  };

  const currentTab = pathToIndex[location.pathname] ?? false;

  const handleTabChange = (event, newValue) => {
    navigate(indexToPath[newValue]);
    setSearchQuery("")
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('userPinCode');
  handleMenuClose();

  window.location.replace('/'); // Go to home & prevent back
};


  const handleLogin = () => {
    handleMenuClose();
    navigate('/login', { replace: true });
  };

  return (
    <AppBar position="static" color="inherit" elevation={0} sx={{ paddingX: { xs: 2, sm: 8 } }}>
      <Toolbar sx={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
        {/* Logo */}
        <Box
          sx={{ display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer' }}
          onClick={() => {
            navigate('/');
            window.location.reload();
          }}
        >
          <img src={Logo} alt="Logo" width={130} height={55} />
        </Box>

        {/* Search Bar */}
     
<Search sx={{ display: { xs: 'none', sm: 'flex' }, position: 'relative' }}>
  <SearchIconWrapper>
    <SearchIcon />
  </SearchIconWrapper>
  <StyledInputBase
    placeholder="Search for stores..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
  />
  
  {/* Clear Icon Button */}
  {searchQuery && (
    <IconButton
      size="small"
      onClick={() => setSearchQuery('')}
      sx={{
        position: 'absolute',
        right: 8,
        top: '50%',
        transform: 'translateY(-50%)',
        color: '#777',
      }}
    >
      <CloseIcon fontSize="small" />
    </IconButton>
  )}
</Search>

        {/* Icons */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton onClick={() => navigate('/favorites')}>
            <FavoriteBorderIcon />
          </IconButton>
          <IconButton onClick={() => navigate('/notifications')}>
            <Badge badgeContent={notificationCount} color="error">
              <NotificationsNoneIcon />
            </Badge>
          </IconButton>

          <IconButton onClick={handleMenuOpen}>
            <AccountCircleIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            {token ? (
              <>
                <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }}>
                  <PersonIcon fontSize="small" sx={{ marginRight: 1 }} />
                  Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <ExitToAppIcon fontSize="small" sx={{ marginRight: 1 }} />
                  Logout
                </MenuItem>
              </>
            ) : (
              <MenuItem onClick={handleLogin}>
                <LoginIcon fontSize="small" sx={{ marginRight: 1 }} />
                Login
              </MenuItem>
            )}
          </Menu>
        </Box>
      </Toolbar>


      {/* Tabs */}
      {showTabs && (
        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="Home" sx={{ fontFamily: 'Poppins', textTransform: 'none' }} />
            <Tab label="Stores" sx={{ fontFamily: 'Poppins', textTransform: 'none' }} />
            <Tab label="Categories" sx={{ fontFamily: 'Poppins', textTransform: 'none' }} />
          </Tabs>
        </Box>
      )}

      {searchQuery && (
      <Box sx={{ px: { xs: 2, sm: 8 }, mt: 1 }}>
        <SearchResults />
      </Box>
    )}
    </AppBar>
  );
}
