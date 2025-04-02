/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Image from "next/image";
import { useState, useEffect } from "react";
import axios from "axios";
import { CircularProgress, Box, Pagination } from '@mui/material';
import Link from "next/link";
import { useRouter, useSearchParams } from 'next/navigation';;


interface ImageData {
    id: string;
    url: string;
    download_url: string;
    author: string;
}

const ImageGallery = () => {
    const [images, setImages] = useState<ImageData[]>([]);
    const [loading, setLoading] = useState(true);
    const [isClient, setIsClient] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    
    const getStoredPage = () => {
        if (typeof window !== "undefined") {
            const urlPage = Number(searchParams.get("page"));
            const storedPage = Number(localStorage.getItem("imageGalleryPage"));
            return urlPage || storedPage || 1;
        } else return 1;
    };

    // const currentPage = Number(searchParams.get("page")) || 1;
    const [page, setPage] = useState(getStoredPage());

    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("imageGalleryPage", page.toString());
        }
    }, [page]);

    const [totalPages, setTotalPages] = useState(10);
    const IMAGES_PER_PAGE = window.innerWidth > 500 ? 9 : 8;


    const fetchImages = async (pageNumber: number) => {
        setIsClient(true);
        try {
            const res = await axios.get(`https://picsum.photos/v2/list?page=${pageNumber}&limit=${IMAGES_PER_PAGE}`);
            console.log("Response:>>>>>>", res.data);
            setImages(res.data);
        } catch (error) {
            console.error("Error:>>>>>", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { fetchImages(page) }, [page]);

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
        router.push(`?page=${value}`, { scroll: false });
    };

    if (!isClient) { return null }

    return (
        <div className="w-full">
            {
                loading ? (
                    <div className="flex flex-row justify-center items-center w-full h-[80dvh]">
                        <CircularProgress size={"6rem"} />
                    </div>
                ) : (
                    <div className="flex flex-col justify-center items-center w-full">
                        {/* Pagination Controls */}
                        <Box display="flex" justifyContent="center" mb={4}>
                            <Pagination
                                count={totalPages}
                                page={page}
                                onChange={handlePageChange}
                                color="primary"
                            />
                        </Box>
                        <div className="grid sm:grid-cols-3 grid-cols-2 sm:gap-4 gap-3">
                            {
                                images.length > 0 &&
                                    images.map(({id, download_url, author}) => (
                                        <div key={id} className="cursor-pointer">
                                            <Link href={`/edit/${id}`} passHref>
                                                <Image 
                                                    src={download_url} 
                                                    alt={`Image ${author}`} 
                                                    width={400}
                                                    height={300}
                                                    className="rounded-[7px] shadow-md object-cover 
                                                    sm:w-[500px] sm:h-[300px] w-[150px] h-[120px]" 
                                                />
                                            </Link>
                                            <div className="sm:text-[16px] text-[14px] mt-1 italic">
                                                {author}
                                            </div>
                                        </div>
                                    ))
                            }
                        </div>
                        {/* Pagination Controls */}
                        <Box display="flex" justifyContent="center" mt={4}>
                            <Pagination
                                count={totalPages}
                                page={page}
                                onChange={handlePageChange}
                                color="primary"
                            />
                        </Box>
                    </div>
                )
            }
        </div>
    );
};

export default ImageGallery
