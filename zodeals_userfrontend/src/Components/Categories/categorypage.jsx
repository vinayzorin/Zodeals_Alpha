import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
} from '@mui/material';

import { useNavigate } from 'react-router-dom';
import Footer from '../Homepages/footerpage';
import Header from '../MainPage/Header';
import { hosturl } from '../libs/Constant';

const CategoriesSection = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

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
    <>
      <Header />
      <Container sx={{ mt: 5, paddingBottom: '100px' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6" fontWeight="600" fontFamily="Poppins" color="black">
            Categories
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {categories.map((cat, index) => (
            <Grid item xs={4} sm={2} key={index}
              onClick={() => navigate(`/category/${cat?.title}`, {
                state: {
                  id: cat._id,
                  title: cat.title,
                }
              })}>
              <Box
                sx={{
                  backgroundColor: '#0c2c54',
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  margin: '0 auto',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  cursor: 'pointer',
                }}
              >
                <img
                  crossOrigin="anonymous"
                  src={`${hosturl}${cat.image}`}
                  alt={cat.title}
                  style={{ width: '40px', height: '40px', objectFit: 'contain' }}
                />
                <Typography variant="caption" mt={0.5} textAlign="center" fontSize="10px">
                  {cat.title}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
      <Footer />
    </>
  );
};

export default CategoriesSection;
