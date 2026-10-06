import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Grid,
  Container,
  CircularProgress,
  Link,
  Dialog,
  DialogContent,
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import axios from 'axios';

import { hosturl } from '../libs/Constant';
import CouponDetailDialog from '../Coupenenables/coupenenable';
import SignInRequiredPrompt from '../authentications/SigninOverlay';

// CouponCard Component
const CouponCard = ({
  coupon,
  wishlist,
  toggleWishlist,
  handleOpenDialog,
  setOpenSignInDialog,
}) => {
  const {
    _id,
    title,
    description,
    validTill,
    logo,
    brand = 'Brand Name',
    category = 'General',
    viewCount = 0,
    code = 'XXXXXX',
  } = coupon;

  return (
    <Card
      sx={{
        width: 350,
        minHeight:240,
        boxShadow: 2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        '&:hover': {
          borderColor: '#2196f3',
        },
      }}
    >
      <CardContent sx={{ p: 2, pb: 1.5 }}>
        {/* Top row */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <img
            crossOrigin="anonymous"
            src={`${hosturl}${logo}`}
            alt={brand}
            style={{ width: 'auto', height: '30px', objectFit: 'contain' }}
          />
          <Box display="flex" alignItems="center" gap={1}>
            <IconButton size="small" onClick={() => toggleWishlist(_id)}>
              {wishlist.includes(_id) ? (
                <FavoriteIcon color="error" fontSize="small" />
              ) : (
                <FavoriteBorderIcon fontSize="small" />
              )}
            </IconButton>
            <VisibilityIcon fontSize="small" />
            <Typography variant="caption" color="text.secondary">
              {viewCount}
            </Typography>
          </Box>
        </Box>

        {/* Meta info */}
        <Box display="flex" justifyContent="space-between" mb={1}>
         <Typography variant="caption" color="text.secondary" fontSize="10px">
          <LocalOfferIcon fontSize="inherit" /> {category?.title || 'General'}
        </Typography>

          <Typography variant="caption" color="text.secondary" fontSize="10px">
            Expires: {new Date(validTill).toLocaleDateString()}
          </Typography>
        </Box>

        {/* Description */}
        <Typography
          variant="body2"
          color="text.secondary"
          whiteSpace="pre-line"
          fontWeight="600"
          textAlign="center"
          mt="20px"
            sx={{
              height: 60,          // fixed height (adjust as needed)
              overflowY: 'auto',   // scroll if content overflows vertically
            }}     
           >
          {description}
        </Typography>
      </CardContent>

      {/* Footer */}
      <Box sx={{ position: 'relative', height: 50, overflow: 'hidden' }}>
        <Typography
          sx={{
            backgroundColor: '#8B0000',
            height: '100%',
            width: '100%',
            filter: 'blur(1px)',
            color: 'white',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontWeight: 'bold',
            fontSize: '16px',
            marginLeft: '40px',
          }}
        >
          {code}
        </Typography>

        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '75%',
            backgroundColor: '#F8C433',
            clipPath: 'polygon(0 0, 90% 0, 80% 100%, 0% 100%)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1,
            borderTopLeftRadius: 15,
          }}
        >
          <Button
            onClick={() => {
              const token = localStorage.getItem('token');
              if (!token) {
                setOpenSignInDialog(true);
              } else {
                handleOpenDialog(coupon);
              }
            }}
            sx={{
              color: 'black',
              fontWeight: 'bold',
              textTransform: 'none',
              zIndex: 2,
            }}
            fullWidth
          >
            View Code
          </Button>
        </Box>
      </Box>
    </Card>
  );
};

// Main Component
export default function CouponsSection() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [openSignInDialog, setOpenSignInDialog] = useState(false);
  const [wishlist, setWishlist] = useState([]);

  const pincode = localStorage.getItem('userPinCode');

  const handleOpenDialog = (coupon) => {
    setSelectedCoupon(coupon);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCoupon(null);
  };

useEffect(() => {
 const fetchCoupons = async () => {
  setLoading(true);
  setError(null);

  try {
    let url = `${hosturl}/home/coupons`;

    if (pincode && pincode !== 'null' && pincode.trim() !== '') {
      url += `?pinCode=${pincode.trim()}`;
    }

    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
      },
    });

    const contentType = response.headers.get("content-type");

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }



    const data = await response.json();

    if (data.statusCode !== 200 || !data.result) {
      throw new Error(data.displayMessage || "Failed to fetch coupons");
    }

    const matchedCoupons = Array.isArray(data.result.matchedCoupons) ? data.result.matchedCoupons : [];
    const panIndiaCoupons = Array.isArray(data.result.panIndiaCoupons) ? data.result.panIndiaCoupons : [];

    setCoupons([...matchedCoupons, ...panIndiaCoupons]);
  } catch (err) {
    setError(err.message || "An error occurred");
  } finally {
    setLoading(false);
  }
};
 fetchCoupons()
}, [pincode]);

  useEffect(() => {
    const fetchWishlist = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const { data } = await axios.get(`${hosturl}/user/wishlist`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (data?.result?.couponIds) {
          setWishlist(data.result.couponIds.map((item) => item._id));
        }
      } catch (error) {
        console.error('Failed to fetch wishlist:', error);
      }
    };

    fetchWishlist();
  }, []);

  const toggleWishlist = async (couponId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setOpenSignInDialog(true);
      return;
    }

    const isInWishlist = wishlist.includes(couponId);

    try {
      if (isInWishlist) {
        await axios.delete(`${hosturl}/user/wishlist/${couponId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWishlist((prev) => prev.filter((id) => id !== couponId));
      } else {
        await axios.post(
          `${hosturl}/user/wishlist`,
          { couponId },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setWishlist((prev) => [...prev, couponId]);
      }
    } catch (error) {
      alert('Failed to update wishlist.');
    }
  };

  return (
    <>
      <Container style={{marginTop:'10px'}}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6" fontFamily="poppins" fontWeight="600" color="black">
            Coupons
          </Typography>
          <Link href="/categories" underline="hover" fontSize="14px" color="black" fontFamily="poppins">
            See all
          </Link>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : coupons.length === 0 ? (
          <Typography>No coupons found for your area.</Typography>
        ) : (
          <Grid container spacing={3} justifyContent="center">
            {coupons.slice(0, 3).map((coupon, index) => (
              <Grid item key={index}>
                <CouponCard
                  coupon={coupon}
                  wishlist={wishlist}
                  toggleWishlist={toggleWishlist}
                  handleOpenDialog={handleOpenDialog}
                  setOpenSignInDialog={setOpenSignInDialog}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Dialogs */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="xl" fullWidth>
        <DialogContent>
          {selectedCoupon && <CouponDetailDialog coupon={selectedCoupon} onClose={handleCloseDialog} />}
        </DialogContent>
      </Dialog>

      <Dialog open={openSignInDialog} onClose={() => setOpenSignInDialog(false)} fullWidth maxWidth="xs">
        {openSignInDialog && <SignInRequiredPrompt onClose={() => setOpenSignInDialog(false)} />}
      </Dialog>
    </>
  );
}
