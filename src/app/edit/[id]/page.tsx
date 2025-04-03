"use client";

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useRef, useEffect } from 'react';
import { useParams } from "next/navigation";
import { useRouter } from 'next/navigation';;
import axios from "axios";
import { Container, CircularProgress, Typography, Card } from '@mui/material';
import ModalBox from "@/app/modal";


const ImageEdit = () => {
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [loading, setLoading] = useState(true);
    const [dimensions, setDimensions] = useState({ width: 500, height: 300 });
    // const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
    // const [selected, setSelected] = useState(false);
    const { id } = useParams();
    const router = useRouter();

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [scale, setScale] = useState(1);
    const [angle, setAngle] = useState(0);
    const [mouseStart, setMouseStart] = useState({ x: 0, y: 0 });

    const stageRef = useRef<any>(null);
    const [open, setOpen] = useState(false);
    const [modalWidth, setModalWidth] = useState(0);
    const [grayscale, setGrayscale] = useState(false);
    const [blur, setBlur] = useState(0);

    useEffect(() => {
        if (typeof window !== "undefined") {
            setModalWidth(window.innerWidth > 500 ? (dimensions.width * 2) : (dimensions.width * 1.4));
            setDimensions({ width: window.innerWidth > 500 ? 500 : 300, height: window.innerWidth > 500 ? 300 : 200 });
        }
    }, [])

    const fetchImage = async () => {
        const imageURL = `https://picsum.photos/id/${id}`;
        const widthURL = dimensions.width;
        const heightURL = dimensions.height;
        const grayscaleURL = grayscale ? "?grayscale" : "";
        const blurURL = blur > 0 && !grayscale ? `?blur=${blur}` : blur > 0 && grayscale ? `&blur=${blur}` : "";
        const resolvedURL = `${imageURL}/${widthURL}/${heightURL}${grayscaleURL}${blurURL}`;
        console.log("Image:>>>>>>", image, "Resolved URL:>>>>>>", resolvedURL);

        try {
            const res = await axios.get(resolvedURL);
            console.log("Response:>>>>>>", res, "Image:>>>>>>", image, "Resolved URL:>>>>>>", resolvedURL);
            const img = new window.Image();
            img.crossOrigin = "anonymous";
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
    }, [id, grayscale, blur]);

    useEffect(() => {
        if (!image || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = 500;
        canvas.height = 300;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(position.x + image.width / 2, position.y + image.height / 2);
        ctx.rotate(angle * (Math.PI / 180));
        ctx.scale(scale, scale);
        ctx.drawImage(image, -image.width / 2, -image.height / 2);
        ctx.restore();
    }, [image, position, scale, angle]);

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setMouseStart({ x: e.clientX, y: e.clientY });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;

        setPosition(prev => ({
            x: prev.x + (e.clientX - mouseStart.x),
            y: prev.y + (e.clientY - mouseStart.y),
        }));
        setMouseStart({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleScaleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setScale(parseFloat(event.target.value));
    };

    const handleRotateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAngle(parseFloat(event.target.value));
    };

    const handleImageDownload = async () => {
        if (!image?.src) {
            console.error("No image source found for download.");
            return;
        }
        
        try {
            const response = await fetch(image.src, { mode: "cors" });
            const blob = await response.blob();
            const blobURL = URL.createObjectURL(blob);
            
            const link = document.createElement("a");
            link.href = blobURL;
            link.download = `edited-image${id}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            URL.revokeObjectURL(blobURL);
        } catch (error) {
            console.error("Error downloading image:", error);
        }
    };

    const handleEdit = () => { setOpen(true) };
    const handleClose = () => { setOpen(false) };





    return (
        <div className="w-full h-[100dvh] flex flex-col justify-center items-center">
            <div className='w-full flex justify-center items-center sm:mb-2 mb-0'>
                <Typography variant="h5" component="h2" gutterBottom>
                    EDIT IMAGE
                </Typography>
            </div>
            <div className='w-full flex justify-center items-center sm:p-0 p-2'>
                <Card 
                    sx={{ 
                        display: "flex", 
                        justifyContent: "center", 
                        alignItems: "center", 
                        width: dimensions.width, 
                        height: dimensions.height,
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
                            <div>
                                <canvas 
                                    ref={canvasRef}
                                    onMouseDown={handleMouseDown}
                                    onMouseMove={handleMouseMove}
                                    onMouseUp={handleMouseUp}
                                    onMouseLeave={handleMouseUp}
                                    className="border cursor-pointer"
                                />
                            </div>
                        )
                    }
                </Card>
            </div>
            <div className='sm:w-[35%] w-[96%] flex justify-between items-center mt-4'>
                <button
                    className="bg-purple-700 text-white sm:px-8 px-4 py-2 rounded sm:w-[140px] w-[100px] 
                    cursor-pointer sm:text-[14px] text-[12px]"
                    onClick={() => router.back()}
                >
                    ← Go Back
                </button>
                <button
                    className="bg-blue-500 text-white sm:px-8 px-4 py-2 rounded sm:w-[140px] w-[100px] 
                    cursor-pointer sm:text-[14px] text-[12px]"
                    onClick={handleEdit}
                >
                    Edit Image
                </button>
                <button
                    className="bg-green-500 text-white sm:px-8 px-4 py-2 rounded sm:w-[140px] w-[100px] 
                    cursor-pointer sm:text-[14px] text-[12px]"
                    onClick={handleImageDownload}
                >
                    Download
                </button>
            </div>

            <ModalBox 
                open={open} 
                onClose={handleClose}
                modalWidth={modalWidth}
                settingHeight={dimensions.height}
                settingWidth={dimensions.width}
                setGrayscale={setGrayscale}
                grayscale={grayscale}
                setBlur={setBlur}
                blur={blur}
                setDimensions={setDimensions}
                dimensions={dimensions}
                image={image}
                id={id}
            />
        </div>
    );
};

export default ImageEdit;
