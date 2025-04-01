"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import axios from "axios";
import { CircularProgress } from '@mui/material';


interface ImageData {
    id: string;
    url: string;
    download_url: string;
    author: string;
}

const ImageGallery = () => {
    const [images, setImages] = useState<ImageData[]>([]);
    const [loading, setLoading] = useState(true);
    // const imageFetchUrl1 = "https://picsum.photos/v2/list?limit=10";
    const imageFetchUrl2 = "https://picsum.photos/v2/list";

    const fetchImages = async () => {
        try {
            const res = await axios.get(imageFetchUrl2);
            console.log("Response:>>>>>>", res.data);
            setImages(res.data);
        } catch (error) {
            console.error("Error:>>>>>", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchImages();
    }, []);

    return (
        <div className="w-full">
            {
                loading ? (
                    <div className="flex flex-row justify-center items-center w-full h-[80dvh]">
                        <CircularProgress size={"3rem"} />
                    </div>
                ) : (
                    <div className="grid grid-cols-3 gap-4">
                        {
                            images.length > 0 &&
                                images.map(img => (
                                    <div key={img.id}>
                                        <Image 
                                            src={img.download_url} 
                                            alt={`Image ${img.author}`} 
                                            width={400}
                                            height={300}
                                            className="rounded-sm shadow-md w-full h-auto" 
                                        />
                                        <div>{img.author}</div>
                                    </div>
                                ))
                        }
                    </div>
                )
            }
        </div>
    );
};

export default ImageGallery
