"use client";
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useRef, useEffect } from 'react';
import { useParams } from "next/navigation";
import { useRouter } from 'next/navigation';;
import axios from "axios";
import { Container, CircularProgress, Typography, CardMedia, Card, Box, Button, Modal } from '@mui/material';
// import dynamic from 'next/dynamic';
import { Stage, Layer, Image as KonvaImage, Transformer } from "react-konva";
import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import EditSection from "./editSection";

// const Stage = dynamic(() => import("react-konva").then((mod) => mod.Stage), { ssr: false });
// const Layer = dynamic(() => import("react-konva").then((mod) => mod.Layer), { ssr: false });
// const Transformer = dynamic(() => import("react-konva").then((mod) => mod.Transformer), { ssr: false });
// const KonvaImage = dynamic(() => import("react-konva").then((mod) => mod.Image), { ssr: false });


// interface ImageData {
//     id: string;
//     url: string;
//     download_url: string;
//     author: string;
// }

const ImageEdit = () => {
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [loading, setLoading] = useState(true);
    const [dimensions, setDimensions] = useState({ width: 500, height: 300 });
    const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
    const [selected, setSelected] = useState(false);
    const { id } = useParams();
    const router = useRouter();

    const imageRef = useRef<Konva.Image>(null);
    const transformerRef = useRef<Konva.Transformer>(null);
    const stageRef = useRef<any>(null);
    const [open, setOpen] = useState(false);
    const [modalWidth, setModalWidth] = useState(0);
    const [grayscale, setGrayscale] = useState(false);
    const [blur, setBlur] = useState(0);
    // const [resolvedURL, setResolvedURL] = useState("");

    useEffect(() => {
        if (typeof window !== "undefined") {
            setModalWidth(window.innerWidth > 500 ? (dimensions.width * 2) : (dimensions.width * 1.4));
        }
    }, [])

    const fetchImage = async () => {
        const imageURL = `https://picsum.photos/id/${id}`;
        const widthURL = dimensions.width;
        const heightURL = dimensions.height;
        const grayscaleURL = grayscale ? "?grayscale" : "";
        // const ampersand = grayscale && blur ? "&" : "";
        const blurURL = blur > 0 && !grayscale ? `?blur=${blur}` : blur > 0 && grayscale ? `&blur=${blur}` : "";
        // setResolvedURL(`${imageURL}/${widthURL}/${heightURL}${grayscaleURL}${ampersand}${blurURL}`);
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
            // console.log("Response:>>>>>>", res, "Image:>>>>>>", img, "Image State:>>>>>>", image);
        } catch (error) {
            console.error("Error fetching image:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { 
        console.log("About to fetch image...");
        if (!id) return;
        console.log("Fetching image:>>>>>>", id);
        fetchImage() 
        console.log("Image fetched...");
    }, [id, grayscale, blur]);

    useEffect(() => {
        if (selected && imageRef.current && transformerRef.current) {
            transformerRef.current.nodes([imageRef.current]);
            transformerRef?.current?.getLayer()?.batchDraw();
        }
    }, [selected]);

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

    const handleEditedImageDownload = () => {
        if (!stageRef.current) {
            console.error("Stage reference is missing!");
            return;
        }
        // console.log("Stage Ref:>>>>>>", stageRef.current);
        stageRef.current.draw();
        setTimeout(() => {
            const dataURL = stageRef.current.toDataURL({ pixelRatio: 2 });
            // console.log("Data URL:>>>>", dataURL);
            const link = document.createElement("a");
            link.href = dataURL;
            link.download = `edited-image${id}.jpg`;
            link.click();
        }, 500);
    };

    const handleTransformEnd = (e: KonvaEventObject<Event>) => {
        // const node = e.target;
        const node = e.target as Konva.Node;

        setDimensions({
            width: node.width() * node.scaleX(),
            height: node.height() * node.scaleY(),
        });
        node.scaleX(1);
        node.scaleY(1);
    }

    const handleDragMove = (e: KonvaEventObject<DragEvent>) => {
        // const node = e.target;
        const node = e.target as Konva.Node;
        setImagePosition({
            x: node.x(),
            y: node.y(),
        });
    };
    
    const handleDragEnd = (e: KonvaEventObject<DragEvent>) => {
        // const node = e.target;
        const node = e.target as Konva.Node;
        setImagePosition({
            x: node.x(),
            y: node.y(),
        });
    };
    
    const handleEdit = () => { setOpen(true) };
    const handleClose = () => { setOpen(false) };

    const modalStyle = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        // bgcolor: "background.paper",
        bgcolor: "#bbb",
        border: "2px solid #000",
        borderRadius: 2,
        boxShadow: 24,
        p: 4,
        width: modalWidth,
        height: "80%",
        maxWidth: 800,
        display: "flex", 
        flexDirection: "column", 
        justifyContent: "center", 
        alignItems: "center",
    };


    return (
        <div className="w-full h-[100dvh] flex flex-col justify-center items-center">
            <div className='w-full flex justify-center items-center mb-2'>
                <Typography variant="h5" component="h2" gutterBottom>
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
                                sx={{ width: dimensions.width, height: dimensions.height }} 
                            />
                        )
                    }
                </Card>
            </div>
            <div className='w-[35%] flex justify-between items-center mt-4'>
                <button
                    className="bg-purple-700 text-white px-8 py-2 rounded w-[140px] cursor-pointer text-[14px]"
                    onClick={() => router.back()}
                >
                    ← Go Back
                </button>
                <button
                    className="bg-blue-500 text-white px-8 py-2 rounded w-[140px] cursor-pointer text-[14px]"
                    onClick={handleEdit}
                >
                    Edit Image
                </button>
                <button
                    className="bg-green-500 text-white px-8 py-2 rounded w-[140px] cursor-pointer text-[14px]"
                    onClick={handleImageDownload}
                >
                    Download
                </button>
            </div>





            {/* Modal for Editing Image */}
            <Modal open={open} onClose={handleClose}>
                <Box sx={modalStyle}>
                    <Typography variant="h6" component="h2" gutterBottom>
                        Edit Image
                    </Typography>

                    <Container 
                        sx={{ 
                            width: "100%", 
                            height: "100%", 
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            margin: 1,
                        }}
                    >
                        <Stage 
                            ref={stageRef} 
                            width={dimensions.width} 
                            height={dimensions.height} 
                            // style={{ 
                            //     border: "3px solid #700fff", 
                            //     objectFit: "cover", 
                            //     width: "100%", 
                            //     height: "100%" 
                            // }}
                        >
                            <Layer>
                                {image && (
                                    <>
                                        {/* <Rect 
                                            x={imagePosition.x} 
                                            y={imagePosition.y} 
                                            width={dimensions.width} 
                                            height={dimensions.height} 
                                            stroke="red" 
                                            strokeWidth={10} 
                                        /> */}
                                        <KonvaImage
                                            ref={imageRef}
                                            image={image}
                                            draggable
                                            onTransformEnd={handleTransformEnd}
                                            onClick={() => setSelected(!selected)}
                                            onTap={() => setSelected(!selected)}
                                            onDragMove={handleDragMove}
                                            onDragEnd={handleDragEnd}
                                            x={imagePosition.x} 
                                            y={imagePosition.y}
                                            width={dimensions.width}
                                            height={dimensions.height}
                                        />
                                        { selected && <Transformer borderEnabled={true} ref={transformerRef} /> }
                                    </>
                                )}
                            </Layer>
                        </Stage>
                        <EditSection 
                            settingHeight={dimensions.height} 
                            settingWidth={dimensions.width} 
                            setGrayscale={setGrayscale}
                            grayscale={grayscale}
                            setBlur={setBlur}
                            blur={blur}
                            setDimensions={setDimensions}
                            dimensions={dimensions}
                        />
                    </Container>

                    <Box 
                        sx={{ 
                            display: "flex", 
                            flexDirection: "row", 
                            justifyContent: "space-between", 
                            alignItems: "center",
                            width: "60%",
                            mt: 2,
                        }}
                    >
                        <Button variant="contained" color="primary" onClick={handleEditedImageDownload}>
                            Download
                        </Button>
                        <Button variant="outlined" color="secondary" onClick={handleClose}>
                            Cancel
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
};

export default ImageEdit;
