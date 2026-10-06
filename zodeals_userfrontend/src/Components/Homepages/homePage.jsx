import React from 'react';
import {

  Typography,
  Box,

} from '@mui/material';
import BannerPage from './Bannerpage';
import FeaturedStores from './featuredStores';
import TopDeals from './topdeals';
import CategoriesSection from './categorysection';
import LatestDeals from './latestDeals';
import CouponsSection from './coupenscomponent';
import GrabDealsCarousel from './grabdeals';
import MensFashionDeals from './mensfashion';
import WomensFashion from './womensfashion';
import PharmacyCoupens from './pharmacypage';
import ElectronicsPage from './electronicspage';
import SkinCarePage from './skincarepage';
import FlightDealsPage from './flightdealspage';
import FavoriteDealsBanner from './FavouriteDealBanner';
import DealsOfTheDay from './DealsofDay';
import CustomerReviews from './reviewsPage';
import Footer from './footerpage';
import Header from '../MainPage/Header';
import MerchantPrice from './MerchantSource';


export default function HomePage() {

  return (
    <Box sx={{  color: 'white', marginTop:2,  }}>
      {/* <Header/> */}
      <BannerPage/>
      <FeaturedStores/>
      <TopDeals/>
      <CategoriesSection/>
      <LatestDeals/>
      <CouponsSection/>
      <GrabDealsCarousel/>
      <WomensFashion/>
      <MensFashionDeals/>
      <PharmacyCoupens/>
      <ElectronicsPage/>
      <SkinCarePage/>
      <FlightDealsPage/>
      <FavoriteDealsBanner/>
      <DealsOfTheDay/>
      {/* <MerchantPrice/> */}
      <CustomerReviews/>
      {/* <Footer/> */}
    </Box>

  );
}
