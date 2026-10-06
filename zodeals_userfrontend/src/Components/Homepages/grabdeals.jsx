import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { hosturl } from '../libs/Constant';

const DealsCarousel = () => {
  const [timer, setTimer] = useState('23:59:59');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const pincode = localStorage.getItem('userPinCode');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Countdown Timer
  useEffect(() => {
    const getNextMidnight = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      return midnight.getTime();
    };

    const targetTime = getNextMidnight();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetTime - now;

      if (distance <= 0) {
        setTimer('00:00:00');
        clearInterval(interval);
      } else {
        const hours = String(Math.floor((distance / (1000 * 60 * 60)) % 24)).padStart(2, '0');
        const minutes = String(Math.floor((distance / (1000 * 60)) % 60)).padStart(2, '0');
        const seconds = String(Math.floor((distance / 1000) % 60)).padStart(2, '0');
        setTimer(`${hours}:${minutes}:${seconds}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Fetch Deals
  useEffect(() => {
  
      const fetchDeals = async () => {
        setLoading(true);
        setError(null);
    
        try {
          let url = `${hosturl}/home/deals`;
    
          if (pincode && pincode !== 'null' && pincode.trim() !== '') {
            url += `?pinCode=${pincode}`;
          }
    
          const response = await fetch(url);
          const data = await response.json();
    
        if (data.statusCode !== 200 || !data.result) {
      throw new Error(data.displayMessage || 'Failed to fetch deals');
    }
    
    const matchedDeals = Array.isArray(data.result.matchedDeals) ? data.result.matchedDeals : [];
    const panIndiaDeals = Array.isArray(data.result.panIndiaDeals) ? data.result.panIndiaDeals : [];
    const allDeals = [...matchedDeals, ...panIndiaDeals];
    
    setDeals(allDeals);
    
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
    

    fetchDeals();
  }, [pincode]);

  const settings = {
    dots: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: '0px',
    arrows: false,
    beforeChange: (_, next) => setCurrentSlide(next),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          centerMode: true,
          centerPadding: '0px',
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          centerMode: false,
          centerPadding: '0px',
        },
      },
    ],
  };

  if (loading) {
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
        <Typography mt={2}>Loading deals...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#F9C62D1C', py: 4, mt: 10, overflow: 'hidden' }}>
      <Typography textAlign="center" fontWeight={600} color="black">
        Grab the deal Before It Ends
      </Typography>

      <Box display="flex" justifyContent="center" alignItems="center" gap={1} my={1}>
        <AccessAlarmIcon color="error" />
        <Typography variant="h6" color="error" fontWeight={600}>
          {timer}
        </Typography>
      </Box>

      <Box sx={{ mx: isMobile ? 0 : -4 }}>
        <Slider {...settings}>
          {deals.map((item, index) => {
            const centerIndex = currentSlide % deals.length;
            const isCenter = index === centerIndex;

            return (
              <Box key={index} px={isMobile ? 1 : 2}>
                <Box
                  sx={{
                    backgroundColor: '#fff',
                    borderRadius: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    transition: 'all 0.3s ease-in-out',
                    height: 280,
                    boxShadow: isCenter
                      ? '0 12px 40px rgba(0, 0, 0, 0.2)'
                      : '0 4px 20px rgba(0, 0, 0, 0.05)',
                    transform: isCenter && !isMobile ? 'scale(1.05)' : 'scale(0.97)',
                    zIndex: isCenter ? 2 : 1,
                    p: 2,
                  }}
                >
                  {/* Logo */}
                  <Box sx={{ width: '100%', mb: 1 }}>
                    <img
                      crossOrigin="anonymous"
                      src={`${hosturl}${item.logo}`}
                      alt="logo"
                      style={{
                        height: 30,
                        objectFit: 'contain',
                      }}
                    />
                  </Box>

                  {/* Content */}
                  <Box
                    sx={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      width: '100%',
                    }}
                  >
                    <Box textAlign="center" mb={1}>
                      <Typography
                        variant="h6"
                        fontWeight={700}
                        color="black"
                        fontFamily="poppins"
                        fontSize={isMobile ? '16px' : '18px'}
                      >
                        {item.title}
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        fontWeight={600}
                        color="black"
                        fontFamily="poppins"
                        fontSize={isMobile ? '14px' : '16px'}
                      >
                        {item.subtitle}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        flexGrow: 1,
                        overflow: 'hidden',
                        textAlign: 'center',
                        mb: 2,
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          fontFamily: 'poppins',
                          fontSize: isMobile ? '12px' : '14px',
                          overflowY: 'auto',
                          maxHeight: 80,
                          whiteSpace: 'pre-line',
                        }}
                      >
                        {item.description}
                      </Typography>
                    </Box>

                    {/* Button stays at bottom */}
                    <Box display="flex" justifyContent="center" mt="auto">
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: '#f8c433',
                          color: 'black',
                          fontWeight: 'bold',
                          textTransform: 'none',
                          width: '150px',
                          '&:hover': { backgroundColor: '#f1b800' },
                          fontSize: isMobile ? '12px' : '14px',
                        }}
                      >
                        Deal
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Slider>
      </Box>
    </Box>
  );
};

export default DealsCarousel;
