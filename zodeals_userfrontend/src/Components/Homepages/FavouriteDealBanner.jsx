import React from "react";
import { Box, Typography, Link, Grid, Paper, Button } from "@mui/material";
import bgImage from "../../assets/images/signinBanner.jpg";
import couponImage from "../../assets/images/coupenimage.png";

const FavoriteDealsBanner = () => {
  // Get token from localStorage (or wherever you store it)
  const token = localStorage.getItem("token");

  return (
    <Box
      sx={{
        position: "relative",
        py: 6,
        px: 2,
        mt: '-15px',
        overflow: "hidden",
      }}
    >
      {/* Background image with opacity */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.2,
          zIndex: 0,
        }}
      />

      {/* Foreground content */}
      <Paper
        elevation={0}
        sx={{
          position: "relative",
          zIndex: 1,
          maxWidth: "100%",
          mx: "auto",
          px: { xs: 2, sm: 4 },
          py: { xs: 2, sm: 3 },
          backgroundColor: "transparent",
          boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.5)",
        }}
      >
        <Grid
          container
          spacing={2}
          alignItems="center"
          justifyContent="center"
          textAlign="center"
        >
          {/* Left Text */}
          <Grid item xs={12} sm={5}>
            <Typography
              variant="h6"
              fontWeight="600"
              color="black"
              fontFamily="Poppins"
              sx={{ fontSize: { xs: 18, sm: 25 } }}
            >
              Keep track of your Favorite deals
            </Typography>
          </Grid>

          {/* Center Image */}
          <Grid item xs={12} sm={2}>
            <Box
              component="img"
              src={couponImage}
              alt="Coupon illustration"
              sx={{ height: "180px", maxWidth: "100%" }}
            />
          </Grid>

          {/* Right Side: Conditional Content */}
          <Grid item xs={12} sm={5}>
            {!token ? (
              // User NOT logged in: show sign in
              <Typography
                sx={{
                  fontSize: 20,
                  color: "black",
                  fontFamily: "Poppins",
                  fontWeight: "600",
                }}
              >
                Already a member?{" "}
                <br />
                <Link href="/login" underline="hover" fontWeight="500" color="primary">
                  Sign in
                </Link>
              </Typography>
            ) : (
              // User logged in: show saved deals and wishlist button
              <>
                <Typography
                  sx={{
                    fontSize: 20,
                    color: "black",
                    fontFamily: "Poppins",
                    fontWeight: "600",
                    mb: 2,
                  }}
                >
                  Check your saved deals 
                </Typography>
                {/* <Button
                  variant="contained"
                  color="primary"
                  href="/saved-deals"
                  sx={{ textTransform: "none", fontWeight: "600" }}
                >
                  Saved Deals
                </Button> */}
                <Link
                  variant="outlined"
                  color="primary"
                  href="/favorites"
                  sx={{ textTransform: "none", fontWeight: "600", ml: 2 , fontFamily:'poppins', fontSize:20}}
                >
                  Wishlist
                </Link>
              </>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default FavoriteDealsBanner;
