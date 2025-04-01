
"use client";

/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Container, Typography } from '@mui/material';
import Grid from "@mui/material/Grid";
// import Grid from '@mui/material/Unstable_Grid2';
import ImageGallery from '../components/ImageGallery';
// import ImageEditor from '../components/ImageEditor';



const Home: React.FC = () => {
  const [images, setImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    // Fetch initial images if needed
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      // Implement API call to fetch images
      // const response = await fetch('/api/images');
      // const data = await response.json();
      // setImages(data);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };


  const handleImageSelect = (image: string) => {
    setSelectedImage(image);
  };

  return (
    <div className='w-full flex flex-col items-center'>
      <Typography variant="h4" component="h1" gutterBottom>
        Image Management
      </Typography>

      <div className='w-full p-4'>
        {/* {selectedImage ? (
          <ImageEditor
            src={selectedImage}
            onSave={() => setSelectedImage(null)}
          />
        ) : (
          <ImageGallery
            // src={images}
            // onImageSelect={handleImageSelect}
          />
        )} */}
        <ImageGallery />
      </div>
    </div>
  );
};

export default Home;
