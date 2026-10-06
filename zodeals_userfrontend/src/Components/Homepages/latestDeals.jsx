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
  Dialog,
  DialogContent,
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from 'axios';
import { hosturl } from '../libs/Constant';
import CouponDetailDialog from '../Coupenenables/coupenenable';
import SignInRequiredPrompt from '../authentications/SigninOverlay';
import { motion } from 'framer-motion';

const DealCard = ({ deal, onDealClick, wishlist, toggleWishlist }) => {
  const isWishlisted = wishlist.includes(deal._id);

  return (
    <Card
      sx={{
        width: 300,
        height: 350,
        boxShadow: 3,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        overflow: 'hidden',
      }}
    >
      {/* Top Section */}
      <Box sx={{ px: 3, pt: 2 }}>
        <Box display="flex" justifyContent="flex-end">
          <Box display="flex" alignItems="center" gap={1}>
            <IconButton size="small" onClick={() => toggleWishlist(deal._id)}>
              {isWishlisted ? (
                <FavoriteIcon color="error" fontSize="small" />
              ) : (
                <FavoriteBorderIcon fontSize="small" />
              )}
            </IconButton>
            <VisibilityIcon fontSize="small" />
            <Typography variant="caption" color="text.secondary">
              {deal.viewCount}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          px: 3,
          mt: 1,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box display="flex" justifyContent="center" mb={1}>
          <img
            crossOrigin="anonymous"
            src={`${hosturl}${deal.logo}`}
            alt="Store Logo"
            style={{ width: 80, height: 'auto' }}
          />
        </Box>

        <Typography variant="subtitle1" fontWeight={600} textAlign="center">
          {deal.title}
        </Typography>

        <Box
          sx={{
            flexGrow: 1,
            overflowY: 'auto',
            mt: 1,
            pr: 1,
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            fontSize={12}
            whiteSpace="pre-line"
            textAlign="center"
          >
            {deal.description}
          </Typography>
        </Box>
      </Box>

      {/* Bottom Section - always at the bottom */}
      <Box
        sx={{
          backgroundColor: '#001F3F',
          p: 1.5,
          textAlign: 'center',
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
        }}
      >
        <Button
          fullWidth
          sx={{ color: 'white', textTransform: 'none', fontWeight: 600 }}
          onClick={() => onDealClick(deal)}
        >
          Deal
        </Button>
      </Box>
    </Card>
  );
};


// Main component
export default function LatestDeals() {
  const [deals, setDeals] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [openCouponDialog, setOpenCouponDialog] = useState(false);
  const [openSignInDialog, setOpenSignInDialog] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3;

  const pincode = localStorage.getItem('userPinCode');

const fetchDeals = async () => {
  setLoading(true);
  setError(null);

  try {
    let url = `${hosturl}/home/last/deals`;

    // Append pincode only if it's valid
    if (pincode && pincode !== 'null' && pincode.trim() !== '') {
      url += `?pinCode=${pincode.trim()}`;
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


  const fetchWishlist = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await axios.get(`${hosturl}/user/wishlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data?.result?.couponIds) {
        setWishlist(res.data.result.couponIds.map((item) => item._id));
      }
    } catch (err) {
      console.error('Error fetching wishlist:', err);
    }
  };

  const toggleWishlist = async (couponId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setOpenSignInDialog(true);
      return;
    }

    const isWishlisted = wishlist.includes(couponId);

    try {
      if (isWishlisted) {
        await axios.delete(`${hosturl}/user/wishlist/${couponId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWishlist((prev) => prev.filter((id) => id !== couponId));
      } else {
        await axios.post(
          `${hosturl}/user/wishlist`,
          { couponId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setWishlist((prev) => [...prev, couponId]);
      }
    } catch (err) {
      console.error('Failed to update wishlist:', err);
      alert('Failed to update wishlist.');
    }
  };

  const handleDealClick = (deal) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setOpenSignInDialog(true);
      return;
    }

    setSelectedDeal(deal);
    setOpenCouponDialog(true);
  };

  const handleCloseCouponDialog = () => {
    setSelectedDeal(null);
    setOpenCouponDialog(false);
  };

useEffect(() => {
  fetchDeals();     // Always fetch deals regardless of pincode
  fetchWishlist();  // Only if token is present, handles inside the function
}, [pincode]);

  const paginatedDeals = deals.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const totalPages = Math.ceil(deals.length / itemsPerPage);

  return (
    <Container sx={{ mt: 5 }}>
      <Box>
        <Typography variant="h6" mb={3} fontFamily="poppins" color="black" fontWeight="600">
          Latest Deals
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : deals.length === 0 ? (
          <Typography>No deals available for your location.</Typography>
        ) : (
          <>
            <Grid container spacing={3} justifyContent="center" alignItems="flex-start">
              {paginatedDeals.map((deal, index) => {
                // Center card moves more, side cards move less
                let baseY = 0;
                let moveY = 10;
                if (index === 1) moveY = 18; // Center card moves a bit more

                // Animation: move up and down continuously, slower and less movement
                const yValues = [baseY, baseY - moveY, baseY, baseY + moveY, baseY];

                return (
                  <Grid
                    item
                    key={deal._id || index}
                    sx={{
                      mt: index === 1 ? 4 : 0,
                    }}
                  >
                    <motion.div
                      animate={{ y: yValues }}
                      transition={{
                        duration: 3.2, // slower
                        repeat: Infinity,
                        repeatType: "loop",
                        ease: "easeInOut"
                      }}
                    >
                      <DealCard
                        deal={deal}
                        onDealClick={handleDealClick}
                        wishlist={wishlist}
                        toggleWishlist={toggleWishlist}
                      />
                    </motion.div>
                  </Grid>
                );
              })}
            </Grid>

            {/* Dot Pagination */}
            <Box display="flex" justifyContent="center" mt={7}>
              {[...Array(totalPages)].map((_, pageIndex) => (
                <Box
                  key={pageIndex}
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    backgroundColor: pageIndex === currentPage ? 'black' : 'lightgray',
                    mx: 0.5,
                    cursor: 'pointer',
                  }}
                  onClick={() => setCurrentPage(pageIndex)}
                />
              ))}
            </Box>
          </>
        )}
      </Box>

      {/* Coupon Dialog */}
      <Dialog open={openCouponDialog} onClose={handleCloseCouponDialog} maxWidth="xl" fullWidth>
        <DialogContent>
          {selectedDeal && (
            <CouponDetailDialog coupon={selectedDeal} onClose={handleCloseCouponDialog} />
          )}
        </DialogContent>
      </Dialog>

      {/* Sign-In Prompt */}
      <Dialog
        open={openSignInDialog}
        onClose={() => setOpenSignInDialog(false)}
        fullWidth
        maxWidth="xs"
      >
        <SignInRequiredPrompt onClose={() => setOpenSignInDialog(false)} />
      </Dialog>
    </Container>
  );
}
