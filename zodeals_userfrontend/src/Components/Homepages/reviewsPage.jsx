import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Rating,
  Stack,
  useTheme,
  useMediaQuery,
  autocompleteClasses,
} from "@mui/material";
import Slider from "react-slick";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { hosturl } from "../libs/Constant";

// Axios instance with token and baseURL
const token = localStorage.getItem("token");
const axiosInstance = axios.create({
  baseURL: hosturl,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const CustomerReviews = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [cReview, setCReview] = useState([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axiosInstance.get("/testimonials/approved");
        setCReview(
          res.data?.result?.map((i) => ({
            name: i?.name,
            date: i?.createdAt?.slice(0, 10),
            rating: i?.rating,
            review: i?.review,
            avatar: i?.profilePic,
          })) || []
        );
      } catch (error) {
        console.error("Error fetching customer reviews:", error);
      }
    };

    fetchReviews();
  }, []);

  const settings = {
    autoplay: true, autoplaySpeed: 2000
    , infinite: true,
    speed: 500,
    slidesToShow: isMobile ? 1 : 3,
    slidesToScroll: 1,
    centerMode: !isMobile,
    centerPadding: isMobile ? "0px" : "40px",
    arrows: false,
    beforeChange: (oldIndex, newIndex) => setCurrentSlide(newIndex),
  };

  return (
    <Box sx={{ py: 6, px: { xs: 1, sm: 2 }, overflow: "hidden" }}>
      <Typography
        variant="h6"
        fontWeight="bold"
        align="center"
        mb={4}
        color="black"
        fontFamily="poppins"
      >
        Reviews from Customers
      </Typography>

      <Box sx={{ mx: isMobile ? 0 : -6, overflow: "visible", position: "relative" }}>
        <Slider {...settings}>
          {cReview.map((item, index) => {
            const centerIndex = currentSlide % cReview.length;
            const isCenter = index === centerIndex;

            return (
              <Box key={index} px={1}>
                <Card
                  sx={{
                    transition: "all 0.4s ease-in-out",
                    height: { xs: "auto", sm: isCenter ? 240 : 220 },
                    transform: { sm: isCenter ? "scale(1.05)" : "scale(0.95)", xs: "scale(1)" },
                    zIndex: isCenter ? 2 : 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    border: "1px solid #e0e0e0",
                    boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.1)",
                    mb: 2,
                    mx: { xs: 1, sm: 0 },
                  }}
                >
                  <CardContent>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      mb={2}
                      flexWrap="wrap"
                      gap={1}
                    >
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Box
                          sx={{
                            borderLeft: "4px solid #FFC107",
                            borderBottom: "4px solid #FFC107",
                            borderTopLeftRadius: 10,
                            borderBottomRightRadius: 8,
                            display: "flex",
                            alignItems: "center",
                            padding: "2px",
                          }}
                        >
                          <Avatar
                            alt={item.name}
                            src={item.avatar ? `${hosturl}${item.avatar}` : ""}
                            sx={{ width: 50, height: 50 }}
                            imgProps={{ crossOrigin: "anonymous" }}
                          />
                        </Box>
                        <Box>
                          <Typography
                            fontWeight={600}
                            fontSize={14}
                            fontFamily="poppins"
                          >
                            {item.name}
                          </Typography>
                          <Typography
                            fontSize={12}
                            color="text.secondary"
                            fontFamily="poppins"
                          >
                            {item.date || ""}
                          </Typography>
                        </Box>
                      </Stack>
                      <Rating value={item.rating} readOnly size="small" />
                    </Stack>

                    <Typography
                      fontSize={14}
                      color="text.secondary"
                      fontFamily="poppins"
                    >
                      {item.review}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            );
          })}
        </Slider>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 1,
          marginTop: "10px",
        }}
      >
        {cReview.map((_, idx) => (
          <Box
            key={idx}
            sx={{
              height: 5,
              width: 15,
              background: currentSlide === idx ? "black" : "#ccc",
              borderRadius: 2,
              transition: "0.3s",
            }}
          />
        ))}
      </Box>
    </Box >
  );
};

export default CustomerReviews;
