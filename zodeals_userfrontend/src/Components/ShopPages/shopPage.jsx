import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  Container,
  Link,
  CircularProgress,
  Button,
} from "@mui/material";
import axios from "axios";
import { hosturl } from "../libs/Constant";
import Header from "../MainPage/Header";
import Footer from "../Homepages/footerpage";
import AllStoresPage from "./allstoresPage";
import { useNavigate } from "react-router-dom";

const FeaturedStores = () => {
  const [storeLogos, setStoreLogos] = useState([]);
  const [loading, setLoading] = useState(false);
  const pincode = localStorage.getItem("userPinCode");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStoresByPin = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${hosturl}/stores`, {
          params: { pinCode: pincode?pincode:"" },
        });
        if (response.data?.status && response.data?.result?.matchedStores?.length > 0) {
          setStoreLogos(response.data.result.matchedStores);
        } else {
          setStoreLogos([]);
        }
      } catch (error) {
        console.error("Error fetching stores:", error);
        setStoreLogos([]);
      } finally {
        setLoading(false);
      }
    };
      fetchStoresByPin();
  }, [pincode]);

  return (
    <>
      <Header />
      <Container sx={{ mt: 5 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={1}
        >
          <Typography
            variant="h6"
            fontWeight="600"
            color="black"
            fontFamily="poppins"
          >
            Featured Stores
          </Typography>
          {/* <Link href="#" underline="hover" fontSize="14px" color="black" fontFamily="poppins">
          See all
        </Link> */}
        </Box>

        {loading ? (
          <Box textAlign="center" mt={4}>
            <CircularProgress />
          </Box>
        ) : storeLogos.length === 0 ? (
          <Box textAlign="center">
            <Typography variant="body1" color="textSecondary">
              No stores found for the pin code <strong>{pincode}</strong>.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {storeLogos.slice(0, 24).map((store, index) => (
              <Grid item xs={6} sm={4} md={2} key={index}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() =>
                    navigate("/single-store-page", {
                      state: {
                        storeId: store._id,
                        logo: store.logo,
                        name: store.name,
                      },
                    })
                  }
                  sx={{
                    height: 70,
                    borderRadius: 2,
                    borderBottomRightRadius: 0,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 1,
                    backgroundColor: "#fff",
                    "&:hover": {
                      backgroundColor: "#f5f5f5",
                    },
                  }}
                >
                  <img
                    crossOrigin="anonymous"
                    src={`${hosturl}${store.logo}`}
                    alt={store.name || `Store ${index}`}
                    style={{
                      maxHeight: 40,
                      maxWidth: "80%",
                      objectFit: "contain",
                    }}
                  />
                </Button>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
      <AllStoresPage />
      <Footer />
    </>
  );
};

export default FeaturedStores;
