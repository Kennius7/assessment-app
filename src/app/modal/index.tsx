"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Container, Typography, Box, Button, Modal } from '@mui/material';
import EditSection from "../edit/[id]/editSection";
import { ParamValue } from 'next/dist/server/request/params';




const ModalBox = ({ 
    open, onClose, modalWidth, settingHeight, settingWidth, setGrayscale, grayscale, 
    setBlur, blur, setDimensions, dimensions, image, id,
}: {
    open: boolean,
    onClose: () => void,
    dimensions: { width: number, height: number },
    setDimensions: ({ width, height }: { width: number, height: number }) => void,
    modalWidth: number,
    settingHeight: number,
    settingWidth: number,
    setGrayscale: (value: boolean) => void, 
    grayscale: boolean,
    setBlur: (value: number) => void, 
    blur: number,
    image: HTMLImageElement | null,
    id: ParamValue | string,
}) => {

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [scale, setScale] = useState(1);
    const [angle, setAngle] = useState(0);
    const [mouseStart, setMouseStart] = useState({ x: 0, y: 0 });


    useEffect(() => {
        if (!image || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = 500;
        canvas.height = 300;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, -image.width / 2, -image.height / 2);
    }, [image, position, scale, angle]);

    const handleEditedImageDownload = () => {
        if (!canvasRef.current) {
            console.error("Canvas reference is missing!");
            return;
        }
        // console.log("Stage Ref:>>>>>>", canvasRef.current);
        // canvasRef.current.draw();
        setTimeout(() => {
            const dataURL = canvasRef?.current?.toDataURL();
            // console.log("Data URL:>>>>", dataURL);
            const link = document.createElement("a");
            if (dataURL && link) {
                link.href = dataURL;
                link.download = `edited-image${id}.jpg`;
                link.click();
            }
        }, 500);    
    };

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

    // const handleScaleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     setScale(parseFloat(event.target.value));
    // };

    // const handleRotateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     setAngle(parseFloat(event.target.value));
    // };

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
        width: window.innerWidth > 500 ? modalWidth : "98%",
        height: "80%",
        maxWidth: 800,
        display: "flex", 
        flexDirection: "column", 
        justifyContent: "center", 
        alignItems: "center",
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle}>
                <Typography variant="h6" component="h2" gutterBottom>
                    Edit Image
                </Typography>
    
                <Container 
                    sx={{ 
                        width: "100%", 
                        height: "100%", 
                        display: "flex",
                        flexDirection: window.innerWidth > 500 ? "row" :  "column",
                        justifyContent: window.innerWidth > 500 ? "space-between" : "center",
                        alignItems: window.innerWidth > 500 ? "center" : "center",
                        margin: 1,
                    }}
                >
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
                    <EditSection 
                        settingHeight={settingHeight} 
                        settingWidth={settingWidth} 
                        setGrayscale={setGrayscale}
                        grayscale={grayscale}
                        setBlur={setBlur}
                        blur={blur}
                        setDimensions={setDimensions}
                        dimensions={dimensions}
                        image={image}
                        scale={scale}
                        setScale={setScale}
                        angle={angle}
                        setAngle={setAngle}
                        canvasRef={canvasRef}
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
                    <Button variant="outlined" color="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                </Box>
            </Box>
        </Modal>
    )
}

export default ModalBox;








