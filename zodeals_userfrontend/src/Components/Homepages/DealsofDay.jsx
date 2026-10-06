import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  IconButton,
  Stack,
  Container,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import VisibilityIcon from "@mui/icons-material/Visibility";
import axios from "axios";
import { hosturl } from "../libs/Constant";

export default function DealsOfTheDay() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${hosturl}/products`);
        setProducts(response.data.result);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleViewDeal = async (productId) => {
    try {
      const response = await axios.get(`${hosturl}/product/${productId}`);
      const productDetail = response.data;
      console.log("Fetched Product Detail:", productDetail);

      // Optionally do something:
      // - Open a dialog
      // - Set state for a detail modal
      // - Navigate
    } catch (error) {
      console.error("Error fetching product detail:", error);
    }
  };


  if (loading) {
    return (
      <Container sx={{ paddingTop: "30px" }}>
        <Typography variant="h6" fontWeight="600" fontFamily="poppins" color="black" mb={2}>
          Deals of the Day
        </Typography>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ paddingTop: "30px" }}>
      <Typography variant="h6" fontWeight="600" fontFamily="poppins" color="black" mb={2}>
        Deals of the Day
      </Typography>

      <Grid container spacing={2}>
        {products.slice(0, 4).map((item) => {
          const discount = item.discountPercentage || 0;
          const oldPrice = Math.round(item.price / (1 - discount / 100));

          return (
            <Grid item xs={6} sm={6} md={3} key={item._id}>
              <Card sx={{ borderRadius: 2, boxShadow: 3, overflow: "hidden" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    px: 1,
                    pt: 1,
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <VisibilityIcon sx={{ fontSize: 14 }} />
                    <Typography variant="caption">{item.viewCount}</Typography>
                    {/* <IconButton size="small">
                      <FavoriteBorderIcon sx={{ fontSize: 16 }} />
                    </IconButton> */}
                  </Stack>
                </Box>

                <Box
                  sx={{
                    height: 130,
                    display: "flex",
                    justifyContent: "flex-end",  // Align the image to the right
                    alignItems: "flex-end",  // Center the image vertically
                    px: 1,
                    pb: 1,
                  }}
                >
                  <CardMedia
                    crossOrigin="anonymous"
                    component="img"
                    image={`${hosturl}${item.image}`}
                    alt={item.description}
                    sx={{
                      maxHeight: "100%",
                      maxWidth: "100%",
                      objectFit: "contain", // Ensures the image doesn't stretch, maintains aspect ratio
                    }}
                  />
                </Box>


                <CardContent sx={{ pt: 0 }}>
                  <Typography variant="subtitle2" color="green" fontWeight="bold">
                    Get {discount}% Off
                  </Typography>

                  <Stack direction="row" spacing={1}>
                    {/* Discounted actual price */}
                    <Typography fontWeight="bold" fontSize={14}>
                      ₹{Math.round(item.price - (item.price * discount / 100))}
                    </Typography>

                    {/* Original calculated price (struck through) */}
                    <Typography
                      fontSize={12}
                      sx={{ textDecoration: "line-through", color: "#DB3939" }}
                    >
                      ₹{item.price}
                    </Typography>
                  </Stack>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    mt={1}
                    sx={{
                      fontSize: 13,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {item.description}
                  </Typography>

                </CardContent>

                <Button
                  fullWidth
                  variant="contained"
                  onClick={async () => {
                    await handleViewDeal(item._id); // Call the API
                    window.open(item.link, "_blank"); // Then open the link
                  }}
                  sx={{
                    backgroundColor: "#0A2342",
                    borderRadius: 0,
                    py: 1,
                    fontSize: 12,
                    "&:hover": {
                      backgroundColor: "#06172e",
                    },
                    textDecoration: "underline",
                  }}
                >
                  SHOP NOW
                </Button>

              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Box textAlign="center" mt={4}>
        <Button
          onClick={() => window.location.href = "/all/deals/today"}
          variant="contained"
          sx={{
            backgroundColor: "#9c2b2e",
            px: 4,
            py: 1,
            textTransform: "none",
            fontWeight: 500,
            "&:hover": {
              backgroundColor: "#831f21",
            },
            fontFamily: "poppins",
          }}
        >
          Show me More
        </Button>
      </Box>
    </Container>
  );
}
