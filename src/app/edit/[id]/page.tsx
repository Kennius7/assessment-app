"use client";
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useRef, useEffect } from 'react';
import { useParams } from "next/navigation";
import { useRouter } from 'next/navigation';;
import axios from "axios";
import { Container, CircularProgress, Typography, CardMedia, Card, Box, Button, Modal } from '@mui/material';
import * as fabric from "fabric"; // Import Fabric.js
// import { Stage, Layer, Image as KonvaImage, Transformer } from 'react-konva';
// import dynamic from 'next/dynamic';
// import Image from 'next/image';


interface ImageData {
    id: string;
    url: string;
    download_url: string;
    author: string;
}

const ImageEdit = () => {
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [loading, setLoading] = useState(true);
    const imageRef = useRef<any>(null);
    const [dimensions, setDimensions] = useState({ width: 500, height: 300 });
    const { id } = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false); // Track modal open/close state
    const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
    const [canvas, setCanvas] = useState<fabric.Canvas | null>(null); // Fabric.js canvas
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const fetchImage = async () => {
        try {
            const res = await axios.get(`https://picsum.photos/id/${id}/500/300`);
            const img = new window.Image();
            img.src = res.request.responseURL;
            img.onload = () => {
                setImage(img);
                setDimensions({ width: img.width, height: img.height });
            };
            console.log("Response:>>>>>>", res, "Image:>>>>>>", img, "Image State:>>>>>>", image);
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

    const handleEdit = (img: ImageData) => {
        setSelectedImage(img); // Store selected image for editing
        setOpen(true); // Open the modal for editing
    };
    
    const handleClose = () => {
        setOpen(false); // Close the modal
    };
    
      // Initialize Fabric.js canvas after the component has mounted
    useEffect(() => {
        if (canvasRef.current && !canvas) {
            const fabricCanvas = new fabric.Canvas(canvasRef.current, {
                backgroundColor: "#f0f0f0", // Optional background color for the canvas
            });
            setCanvas(fabricCanvas);
        }
    }, [canvas]);
    
      // Load the image inside the modal
    useEffect(() => {
        if (selectedImage && canvas) {
            fabric.Image.fromURL(selectedImage.download_url, (img) => {
                canvas.clear(); // Clear previous objects
                img.set({
                    left: 100,
                    top: 100,
                    angle: 0,
                    scaleX: 1,
                    scaleY: 1,
                });
                canvas.add(img); // Add image to canvas
                canvas.renderAll();
            });
        }
    }, [selectedImage, canvas]);
    
      // Handle save and download
    const handleSave = () => {
        if (canvas) {
            const dataURL = canvas.toDataURL({ format: "png" }); // Get the image as a data URL
            // Create a temporary link for downloading
            const link = document.createElement("a");
            link.href = dataURL;
            link.download = "edited-image.png"; // Specify the download file name
            link.click(); // Trigger download
            handleClose(); // Close the modal after saving
        }
    };

    // const handleSave = () => {
    //     if (imageRef.current) {
    //         const dataURL = imageRef.current.getStage().toDataURL();
    //         console.log("Saved Image Data URL:", dataURL);
    //     }
    // };


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
            <div className='w-[35%] flex justify-start items-center mb-2'>
                <Button variant="contained" color="secondary" onClick={() => router.back()}>
                    ← Go Back
                </Button>
                <Typography variant="h5" component="h2" sx={{ marginLeft: "60px" }} gutterBottom>
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
            <div className='w-[35%] flex justify-between items-center mt-4'>
                <button
                    className="bg-blue-500 text-white px-8 py-2 rounded w-[160px] cursor-pointer"
                    onClick={() => handleEdit(selectedImage)}
                >
                    Edit Image
                </button>
                <button
                    className="bg-green-500 text-white px-8 py-2 rounded w-[160px] cursor-pointer"
                    onClick={handleSave}
                >
                    Save
                </button>
            </div>
            {/* Modal for Editing Image */}
            <Modal open={open} onClose={handleClose}>
                <Box sx={modalStyle}>
                    <Typography variant="h6" component="h2" gutterBottom>
                        Edit Image
                    </Typography>

                    <Box sx={{ position: "relative", marginBottom: 1 }}>
                        <canvas ref={canvasRef} width={500} height={500} />
                    </Box>

                    <Box 
                        sx={{ 
                            display: "flex", 
                            flexDirection: "row", 
                            justifyContent: "space-between", 
                            alignItems: "center" 
                        }}
                    >
                        <Button variant="contained" color="primary" onClick={handleSave}>
                            Save and Download
                        </Button>
                        <Button variant="outlined" color="secondary" onClick={handleClose} sx={{ ml: 2 }}>
                            Cancel
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
};

const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    border: "2px solid #000",
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
    width: "80%",
    height: "80%",
    maxWidth: 800,
};

export default ImageEdit;
