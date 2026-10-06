import React from 'react';
import { Box, Typography, Container, keyframes } from '@mui/material';
import BannerImage from '../../assets/images/BannerImage.png';

// Define keyframes for animations
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const BannerPage = () => {
  return (
    <Box
      sx={{
        height: { xs: '50vh', sm: '70vh' },
        backgroundImage: `url(${BannerImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        color: '#fff',
        position: 'relative',
        zIndex: 1,
        overflow: 'hidden',
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          zIndex: -1,
          animation: `${fadeIn} 1.5s ease-out`,
        },
      }}
    >
      <Container maxWidth="md">
        <Box 
          sx={{ 
            width: '100%', 
            maxWidth: 530,
            animation: `${slideUp} 1s ease-out 0.5s both`,
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontFamily: 'Poppins',
              fontWeight: 500,
              fontSize: { xs: '1.5rem', sm: '2.5rem' },
              animation: `${fadeIn} 0.8s ease-out 0.8s both`,
            }}
          >
            Save Big with{' '}
            <span 
              style={{ 
                color: '#FFD700',
                display: 'inline-block',
                animation: `${fadeIn} 0.8s ease-out 1s both, ${keyframes`
                  0% { transform: scale(1); }
                  50% { transform: scale(1.1); }
                  100% { transform: scale(1); }
                `} 2s infinite 1.5s`
              }}
            >
              Exclusive Deals
            </span>{' '}
            & Coupons
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontFamily: 'Poppins',
              fontSize: { xs: '13px', sm: '15px' },
              mt: 1,
              animation: `${fadeIn} 0.8s ease-out 1.2s both`,
            }}
          >
            Discover the best discounts from your favorite stores. Updated
            daily with verified coupons and promotions.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default BannerPage;