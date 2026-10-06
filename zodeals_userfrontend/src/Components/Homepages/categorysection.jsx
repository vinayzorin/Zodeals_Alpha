import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  CircularProgress,Link
} from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useNavigate } from 'react-router-dom';
import { hosturl } from '../libs/Constant';

const CategoriesSection = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${hosturl}/category`);
        const data = await response.json();
        if (data.statusCode === 200 && Array.isArray(data.result)) {
          setCategories(data.result);
        } else {
          console.error('Invalid response format', data);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <Container sx={{ mt: 5 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6" fontWeight="600" fontFamily="Poppins" color="black">
          Categories
        </Typography>
   
          <Link href="/categories" underline="hover" fontSize="14px" color="black" fontFamily="poppins" fontWeight='600'>
          Explore more <ArrowForwardIosIcon sx={{ fontSize: 14, ml: 0.3 }} />
        </Link>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="150px">
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2}>
     {categories.slice(0, 6).map((cat) => (
            <Grid item xs={4} sm={2} key={cat._id}>
              <Box
              onClick={() => {
                window.scrollTo(0, 0); // Scroll to top before navigating
                navigate(`/category/${cat?.title}`, {
                 state: {
                    id: cat._id,
                    title: cat.title,
                  }
                });
              }}
                sx={{
                  backgroundColor: '#0c2c54',
                  width: { xs: 80, sm: 100 },
                  height: { xs: 80, sm: 100 },
                  borderRadius: '50%',
                  margin: '0 auto',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              >
                <img
                  crossOrigin="anonymous"
                  src={`${hosturl}${cat.image}`}
                  alt={cat.title}
                  style={{ width: '40px', height: '40px', objectFit: 'contain' }}
                />
                <Typography variant="caption" mt={0.5} fontSize="10px">
                  {cat.title}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default CategoriesSection;
