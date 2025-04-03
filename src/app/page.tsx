"use client";
import React from 'react';
import { Typography, CircularProgress } from '@mui/material';
import ImageGallery from './ImageGallery';
import { Suspense } from 'react'


const Home: React.FC = () => {

  return (
    <div className='w-full flex flex-col items-center'>
      <Typography variant="h4" component="h1" mt={2} gutterBottom>
        Image Gallery
      </Typography>

      <div className='w-full sm:p-4 p-2'>
        <Suspense fallback={<CircularProgress/>}>
          <ImageGallery />
        </Suspense>
      </div>
    </div>
  );
};

export default Home;
