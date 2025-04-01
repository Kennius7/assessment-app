"use client";
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useRef, useEffect } from 'react';
import { useParams } from "next/navigation";
import { useRouter } from 'next/navigation';;
import axios from "axios";
import { Container, CircularProgress, Typography, CardMedia, Card, Box, Button } from '@mui/material';
// import { Stage, Layer, Image as KonvaImage, Transformer } from 'react-konva';
import dynamic from 'next/dynamic';
import Image from 'next/image';


const ImageEdit = () => {
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [loading, setLoading] = useState(true);
    const imageRef = useRef<any>(null);
    const [dimensions, setDimensions] = useState({ width: 500, height: 300 });
    const { id } = useParams();
    const router = useRouter();

    const fetchImage = async () => {
        try {
            const res = await axios.get(`https://picsum.photos/id/${id}/500/300`);
            const img = new window.Image();
            img.src = res.request.responseURL;
            img.onload = () => {
                setImage(img);
                setDimensions({ width: img.width, height: img.height });
            };
        } catch (error) {
            console.error("Error fetching image:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { 
        if (!id) return;
        fetchImage() 
    }, [id]);

    const handleSave = () => {
        if (imageRef.current) {
            const dataURL = imageRef.current.getStage().toDataURL();
            console.log("Saved Image Data URL:", dataURL);
        }
    };


    return (
        <div className="w-full h-[100dvh] flex flex-col justify-center items-center">
            {/* <Stage width={dimensions.width} height={dimensions.height}>
                <Layer>
                    {image && (
                        <>
                            <KonvaImage
                                ref={imageRef}
                                image={image}
                                draggable
                                // onTransformEnd={handleTransformEnd}
                            />
                            <Transformer
                                ref={transformerRef}
                                boundBoxFunc={(oldBox, newBox) => newBox}
                            />
                        </>
                    )}
                </Layer>
            </Stage> */}
            <div className='w-full flex justify-around items-center'>
                <Box mb={2}>
                    <Button variant="contained" color="secondary" onClick={() => router.back()}>
                        ← Go Back
                    </Button>
                </Box>
                <Typography variant="h6" component="h2" gutterBottom>
                    EDIT IMAGE
                </Typography>
            </div>
            <div className='w-full flex justify-center items-center'>
                <Card 
                    sx={{ 
                        display: "flex", 
                        justifyContent: "center", 
                        alignItems: "center", 
                        width: dimensions.width, 
                        height: dimensions.height 
                    }}
                >
                    {
                        loading ? (
                            <Container 
                                sx={{ 
                                    display: "flex", 
                                    justifyContent: "center", 
                                    alignItems: "center", 
                                    width: "100%",
                                    height: "100%" 
                                }}
                            >
                                <CircularProgress />
                            </Container>
                        ) : (
                            <CardMedia 
                                component="img"
                                image={image?.src || ""}
                                // src={image?.src} 
                                sx={{ width: dimensions.width, height: dimensions.height }} 
                            />
                        )
                    }
                </Card>
                {/* <Image 
                    src={image !== null && image !== undefined ? image?.src : null} 
                    alt="Image" 
                    width={dimensions.width} 
                    height={dimensions.height} 
                /> */}
            </div>
            <div className='w-full flex justify-center items-center mt-4'>
                <button
                    className="bg-blue-500 text-white px-8 py-2 rounded"
                    onClick={handleSave}
                >
                    Save
                </button>
            </div>
        </div>
    );
};

export default ImageEdit;
