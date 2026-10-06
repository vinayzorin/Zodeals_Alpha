import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  List,
  ListItem,
  IconButton,
  Button,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import PhoneIcon from "@mui/icons-material/Phone";
import logo from "../../assets/images/zodealsLogo.png";
import Addreview from "./Addreview";
import { hosturl } from "../libs/Constant";
import axios from "axios";
import VendorPartnershipButton from "./vendorButton";

const footerLinks = {
  company: [
    { label: "About Us", path: "/aboutus" },
    { label: "FAQ", path: "/faq" },
    { label: "Privacy Statement", path: "/privacy-policy" },
    { label: "Terms and Conditions", path: "/terms-and-conditions" },
    { label: "Refund Policy", path: "/refund/policy" },
    { label: "Product Pricing Policy", path: "/product/pricing/policy" },
  ],
};

const slugify = (text) => text.toLowerCase().replace(/\s+/g, "-");

export default function Footer() {
  const [categories, setCategories] = useState([]);
  const [stores, setStores] = useState([]);
  const [details, setDetails] = useState({});
  const pincode = localStorage.getItem("userPinCode");

  useEffect(() => {
    fetch(`${hosturl}/category`)
      .then((res) => res.json())
      .then((data) => {
        if (data.result) setCategories(data.result.slice(0, 5));
      });

    fetchContact();
  }, []);

  const fetchContact = async () => {
    try {
      const response = await axios.get(`${hosturl}/contact-us`);
      setDetails(response.data.result);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchStoresByPin = async () => {
      try {
        const response = await axios.get(
          `${hosturl}/stores/?pinCode=${pincode || ""}`
        );
        setStores(response.data?.result?.matchedStores || []);
      } catch (error) {
        setStores([]);
      }
    };

    if (pincode) fetchStoresByPin();
  }, [pincode]);

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#12253d",
        color: "#fff",
        p: 4,
        fontSize: "0.9rem",
      }}
    >
      <Grid container spacing={3} justifyContent="space-between">
        <Addreview />

        {/* Popular Stores */}
        <Grid item xs={6} sm={4} md={2}>
          <Typography gutterBottom fontSize="20px" fontFamily="poppins">
            Popular Stores
          </Typography>
          <List>
            {stores.map((store) => (
              <ListItem key={store._id} sx={{ py: 0.3 }}>
                <Button
                  component={RouterLink}
                  to="/single-store-page"
                  state={{
                    storeId: store._id,
                    name: store.name,
                    logo: store.logo,
                  }}
                  sx={{
                    color: "#cbd5e1",
                    fontSize: "15px",
                    fontFamily: "poppins",
                    justifyContent: "flex-start",
                    padding: 0,
                    textTransform: "none",
                    "&:hover": {
                      color: "#fff",
                      backgroundColor: "transparent",
                      textDecoration: "underline",
                    },
                  }}
                >
                  • {store.name}
                </Button>
              </ListItem>
            ))}
          </List>
        </Grid>

        {/* Categories */}
        <Grid item xs={6} sm={4} md={2}>
          <Typography gutterBottom fontSize="20px" fontFamily="poppins">
            Categories
          </Typography>
          <List>
            {categories.map((cat) => (
              <ListItem key={cat._id} sx={{ py: 0.3 }}>
                <Button
                  component={RouterLink}
                  to={`/category/${slugify(cat.title)}`}
                  state={{ id: cat._id, title: cat.title }}
                  sx={{
                    color: "#cbd5e1",
                    fontSize: "15px",
                    fontFamily: "poppins",
                    justifyContent: "flex-start",
                    padding: 0,
                    textTransform: "none",
                    "&:hover": {
                      color: "#fff",
                      backgroundColor: "transparent",
                      textDecoration: "underline",
                    },
                  }}
                >
                  • {cat.title}
                </Button>
              </ListItem>
            ))}
          </List>
        </Grid>

        {/* Company */}
        <Grid item xs={6} sm={4} md={2}>
          <Typography gutterBottom fontSize="20px" fontFamily="poppins">
            Company
          </Typography>
          <List>
            {footerLinks.company.map((item) => (
              <ListItem key={item.label} sx={{ py: 0.3 }}>
                <Button
                  component={RouterLink}
                  to={item.path}
                  sx={{
                    color: "#cbd5e1",
                    fontSize: "13px",
                    fontFamily: "poppins",
                    justifyContent: "flex-start",
                    padding: 0,
                    textTransform: "none",
                    "&:hover": {
                      color: "#fff",
                      backgroundColor: "transparent",
                    },
                  }}
                >
                  • {item.label}
                </Button>
              </ListItem>
            ))}
          </List>
        </Grid>

        {/* Contact */}
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="h6" gutterBottom>
            Contact Us
          </Typography>

          <Box sx={{ mb: 1 }}>
            <a href={details?.facebook} target="_blank" rel="noopener noreferrer">
              <IconButton size="small" sx={{ color: "#cbd5e1" }}>
                <FacebookIcon fontSize="small" />
              </IconButton>
            </a>

            <a href={details?.instagram} target="_blank" rel="noopener noreferrer">
              <IconButton size="small" sx={{ color: "#cbd5e1" }}>
                <InstagramIcon fontSize="small" />
              </IconButton>
            </a>

            <a href={details?.linkedIn} target="_blank" rel="noopener noreferrer">
              <IconButton size="small" sx={{ color: "#cbd5e1" }}>
                <LinkedInIcon fontSize="small" />
              </IconButton>
            </a>

            <a href={details?.twitter} target="_blank" rel="noopener noreferrer">
              <IconButton size="small" sx={{ color: "#cbd5e1" }}>
                <TwitterIcon fontSize="small" />
              </IconButton>
            </a>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <EmailIcon sx={{ mr: 1, color: "#cbd5e1" }} />
            <Typography>{details?.email}</Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <PhoneIcon sx={{ mr: 1, color: "#cbd5e1" }} />
            <Typography>
              {details?.primaryNumber}, {details?.secondaryNumber}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <LocationOnIcon sx={{ mr: 1, color: "#cbd5e1" }} />
            <Typography>{details?.location}</Typography>
          </Box>

          <img src={logo} width={150} style={{ marginTop: "20px" }} alt="logo" />
        </Grid>

        {/* Bottom Buttons */}
        <Grid item xs={12}>
          <VendorPartnershipButton />

          <Box sx={{ mt: 2 }}>
            <Button
              component={RouterLink}
              to="/agent-contact"
              variant="contained"
              sx={{
                backgroundColor: "#fff",
                color: "#000",
                textTransform: "none",
                fontFamily: "poppins",
                fontWeight: "600",
                "&:hover": {
                  backgroundColor: "#e0e0e0",
                },
              }}
            >
              Become an Agent
            </Button>
          </Box>
        </Grid>
      </Grid>

      <Box
        sx={{
          textAlign: "center",
          mt: 4,
          fontSize: "0.8rem",
          color: "#cbd5e1",
          fontFamily: "poppins",
        }}
      >
        ©2025 ZoDeals All Rights Reserved | Designed by Aptapace
      </Box>
    </Box>
  );
}
