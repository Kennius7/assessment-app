"use client";
/* eslint-disable react-hooks/exhaustive-deps */
import Image from "next/image";
import { useState, useEffect, Suspense } from "react";
import axios from "axios";
import { CircularProgress, Box, Pagination } from '@mui/material';
import Link from "next/link";
import { useRouter, useSearchParams } from 'next/navigation';
// import useImagesAboveFold from "./hook/useIsAboveFold";


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
    // const { imageRefs, visibleImages } = useImagesAboveFold(images.length);

    const getStoredPage = () => {
        if (typeof window !== "undefined") {
            const urlPage = Number(searchParams.get("page"));
            const storedPage = Number(localStorage.getItem("imageGalleryPage"));
            return urlPage || storedPage || 1;
        } else return 1;
    };

    const [page, setPage] = useState(getStoredPage());

    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("imageGalleryPage", page.toString());
        }
    }, [page]);

    const [totalPages, setTotalPages] = useState(125);
    const [imagesPerPage, setImagesPerPage] = useState(10);

    useEffect(() => {
        if (typeof window !== "undefined") {
            setImagesPerPage(window.innerWidth > 500 ? 12 : 8);
            setTotalPages(window.innerWidth > 500 ? 83 : 125);
            console.log("Images per page:>>>>>>", imagesPerPage);
        }
    }, []);

    const fetchImages = async (pageNumber: number) => {
        setIsClient(true);
        try {
            const res = await axios.get(`https://picsum.photos/v2/list?page=${pageNumber}&limit=${imagesPerPage}`);
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
                        <div className="grid sm:grid-cols-4 grid-cols-2 sm:gap-6 gap-2">
                            {
                                images.length > 0 &&
                                    images.map(({ id, download_url, author }) => (
                                        <Suspense 
                                            key={id}
                                            fallback={<CircularProgress size={"2rem"} />}
                                        >
                                            <div className="cursor-pointer">
                                                <Link href={`/edit/${id}`} passHref>
                                                        <Image 
                                                            // ref={(el) => { if (el) { imageRefs.current[Number(id)] = el } }}
                                                            src={download_url} 
                                                            alt={`Image ${author}`} 
                                                            width={400}
                                                            height={300}
                                                            // priority={visibleImages.has(Number(id))}
                                                            className="rounded-[7px] shadow-md object-cover 
                                                            w-full sm:h-[280px] h-[140px]" 
                                                        />
                                                </Link>
                                                <div className="sm:text-[16px] text-[14px] mt-1 italic">
                                                    {author}
                                                </div>
                                            </div>
                                        </Suspense>
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
