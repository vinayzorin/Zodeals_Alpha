import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Container,
  Link,
  CircularProgress,
  Button
} from '@mui/material';
import axios from 'axios';
import { hosturl } from '../libs/Constant';
import { useNavigate } from 'react-router-dom';
import PinCodeModal from '../MainPage/Pincodemodel';

const FeaturedStores = () => {
  const [storeLogos, setStoreLogos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openPinCodeModal, setOpenPinCodeModal] = useState(false); // state to control PinCodeModal visibility
  const pincode = localStorage.getItem('userPinCode');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStoresByPin = async () => {
      setLoading(true);
      try {
        let url = `${hosturl}/stores`;

        if (pincode && pincode !== 'null' && pincode.trim() !== '') {
          url += `?pinCode=${pincode.trim()}`;
        }
        const response = await axios.get(url);
        if (response.data?.statusCode === 200 && response.data?.result) {
          const { matchedStores, panIndiaStores } = response.data.result;

          // Prefer matchedStores if non-empty, else panIndiaStores
          const storesToShow = Array.isArray(matchedStores) && matchedStores.length > 0
            ? matchedStores
            : Array.isArray(panIndiaStores)
              ? panIndiaStores
              : [];

          setStoreLogos(storesToShow);

        } else {
          setStoreLogos([]);
        }
      } catch (error) {
        console.error('Error fetching stores:', error);
        setStoreLogos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStoresByPin();
  }, [pincode]);

  return (
    <Container sx={{ mt: 5 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography variant="h6" fontWeight="600" color="black" fontFamily="poppins">
          Featured Stores
        </Typography>
        <Link
          href="/stores"
          underline="hover"
          fontSize="14px"
          color="black"
          fontFamily="poppins"
        >
          See all
        </Link>
      </Box>


      {/* <Box mb={2}>
        <Typography variant="body2">
          Showing stores for Pin Code: <strong>{pincode || 'Not set'}</strong>
        </Typography>
      </Box> */}

      {loading ? (
        <Box textAlign="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : storeLogos.length === 0 ? (
        <Box textAlign="center">
          <Typography variant="body1" color="textSecondary">
            No stores found for the pin code <strong>{pincode}</strong>.{' '}
            To change pin code,{' '}
            <Link
              component="button"
              onClick={() => setOpenPinCodeModal(true)}
              sx={{ cursor: 'pointer', textDecoration: 'underline', display: 'inline' }}
            >
              click here
            </Link>.
          </Typography>
        </Box>

      ) : (
        <Grid container spacing={2}>
          {storeLogos.slice(0, 24).map((store, index) => (
            <Grid item xs={6} sm={4} md={2} key={index}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => {
                  window.scrollTo(0, 0);
                  navigate('/single-store-page', {
                    state: {
                      storeId: store._id,
                      storelogo: store.logo,
                      name: store.name, // optional
                      description: store.description, // optional
                      contact: store.phoneNumber,     // optional
                    },
                  });

                }}
                sx={{
                  height: 70,
                  borderRadius: 2,
                  borderBottomRightRadius: 0,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 1,
                  backgroundColor: '#fff',
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                  },
                }}
              >
                <img
                  crossOrigin="anonymous"
                  src={`${hosturl}${store.logo}`}
                  alt={store.name || `Store ${index}`}
                  style={{
                    maxHeight: 40,
                    maxWidth: '80%',
                    objectFit: 'contain',
                  }}
                />
              </Button>
            </Grid>
          ))}
        </Grid>
      )}

      {openPinCodeModal && (
        <PinCodeModal
          open={openPinCodeModal}
          onClose={() => setOpenPinCodeModal(false)}
          onPinSubmit={(newPin) => {
            localStorage.setItem('userPinCode', newPin);
            setOpenPinCodeModal(false);
            window.location.reload(); // Or better: trigger fetch again without reload
          }}
        />

      )}
    </Container>
  );
};

export default FeaturedStores;
