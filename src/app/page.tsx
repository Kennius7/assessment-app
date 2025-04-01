"use client";
import React from 'react';
import { Typography } from '@mui/material';
import ImageGallery from './ImageGallery';


const Home: React.FC = () => {

  return (
    <div className='w-full flex flex-col items-center'>
      <Typography variant="h4" component="h1" gutterBottom>
        Image Management
      </Typography>

      <div className='w-full p-4'>
        <ImageGallery />
      </div>
    </div>
  );
};

export default Home;
