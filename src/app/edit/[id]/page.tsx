"use client";

import { useState, useEffect } from 'react';
import { useParams } from "next/navigation";
import { useRouter } from 'next/navigation';;
import axios from "axios";
import { Container, CircularProgress } from '@mui/material';
import ModalBox from "@/app/modal";
import Image from "next/image";


const ImageEdit = () => {
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [loading, setLoading] = useState(true);
    const [dimensions, setDimensions] = useState({ width: 500, height: 300 });
    const [open, setOpen] = useState(false);
    const [grayscale, setGrayscale] = useState(false);
    const [blur, setBlur] = useState(0);

    const { id } = useParams();
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== "undefined") {
            setDimensions({ width: window.innerWidth > 500 ? 500 : 280, height: window.innerWidth > 500 ? 300 : 180 });
        }
    }, [dimensions.width])

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, grayscale, blur]);

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
        <div className="w-full h-[100dvh] flex flex-col justify-start items-center sm:py-[100px] py-[10px]">
            <div className='w-[78%] flex justify-start items-center mb-[100px]'>
                <button
                    className="bg-purple-700 text-white sm:px-8 px-4 py-2 rounded sm:w-[140px] w-[100px] 
                    cursor-pointer sm:text-[14px] text-[12px]"
                    onClick={() => router.back()}
                >
                    ← Go Back
                </button>
            </div>
            <div className='w-full flex justify-center items-center sm:mb-2 mb-0'>
                <div className='w-full mb-4 sm:text-[25px] text-[20px] font-bold text-center'>
                    IMAGE PREVIEW
                </div>
            </div>
            <div className='w-full flex justify-center items-center sm:p-0 p-2'>
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
                        <div className='w-full h-full flex justify-center items-center overflow-hidden'>
                            <Image 
                                src={image!.src}
                                alt="Image" 
                                width={dimensions.width} 
                                height={dimensions.height} 
                            />
                        </div>
                    )
                }
            </div>
            <div className='sm:w-[35%] w-[78%] flex justify-between items-center mt-4'>
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
