"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */

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
    // const [mouseStart, setMouseStart] = useState({ x: 0, y: 0 });
    const mouseStartRef = useRef({ x: 0, y: 0 });


    useEffect(() => {
        if (!image || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = dimensions.width;
        canvas.height = dimensions.height;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // ctx.drawImage(image, -image.width / 2, -image.height / 2);

        ctx.save(); // Save current state
        ctx.translate(canvas.width / 2 + position.x, canvas.height / 2 + position.y); // Move center
        ctx.rotate((angle * Math.PI) / 180); // Rotate
        ctx.scale(scale, scale); // Scale
    
        ctx.drawImage(image, -image.width / 2, -image.height / 2);
        ctx.restore(); 
    }, [image, position, scale, angle, dimensions.width, dimensions.height]);

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
        // setMouseStart({ x: e.clientX, y: e.clientY });
        mouseStartRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;

        setPosition(prev => ({
            x: prev.x + (e.clientX - mouseStartRef.current.x),
            y: prev.y + (e.clientY - mouseStartRef.current.y),
        }));
        // setMouseStart({ x: e.clientX, y: e.clientY });
        mouseStartRef.current = { x: e.clientX, y: e.clientY };
        console.log("Position:>>>>", position);
    };

    const handleMouseUp = () => { setIsDragging(false) };

    const handleTouchStart = (e: React.TouchEvent) => {
        setIsDragging(true);
        const touch = e.touches[0];
        mouseStartRef.current = { x: touch.clientX, y: touch.clientY };
    };
    
    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging) return;
    
        const touch = e.touches[0];
    
        setPosition(prev => ({
            x: prev.x + (touch.clientX - mouseStartRef.current.x),
            y: prev.y + (touch.clientY - mouseStartRef.current.y),
        }));
    
        mouseStartRef.current = { x: touch.clientX, y: touch.clientY };
        console.log("Position:>>>>", position);
    };
    
    const handleTouchEnd = () => { setIsDragging(false) };

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
        p: window.innerWidth > 500 ? 4 : 2,
        width: window.innerWidth > 500 ? modalWidth : "98%",
        height: window.innerWidth > 500 ? "80%" : "90%",
        // maxWidth: 800,
        display: "flex", 
        flexDirection: "column", 
        justifyContent: "center", 
        alignItems: "center",
    };

    return (
        <Modal open={open} onClose={onClose}>
            <div 
                style={{ transform: "translate(-50%, -50%)" }} 
                className='absolute top-[50%] left-[50%] sm:w-[600px] w-[98%] sm:h-[80%] h-[90%] 
                flex flex-col justify-center items-center bg-slate-200 rounded-[3px] 
                border-slate-700 border-[2px] sm:p-4 p-2'
            >
                <div className='sm:text-[20px] text-[18px] font-semibold'>
                    Edit Image
                </div>
    
                <div className='w-full h-full flex sm:flex-row flex-col sm:justify-between 
                    justify-center items-center m-1'>
                    <div className='sm:w-full w-[98%] sm:h-full h-[200px] flex justify-center 
                        items-center overflow-hidden border-2 border-black'>
                        <canvas 
                            ref={canvasRef}
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                            className="border cursor-pointer touch-none"
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
                </div>

                <div className="sm:w-[60%] w-full flex justify-between items-center sm:mt-2 mt-0">
                    <button
                        className="bg-green-500 text-white sm:px-8 px-4 py-2 rounded sm:w-[140px] w-[100px] 
                        cursor-pointer sm:text-[14px] text-[12px]"
                        onClick={handleEditedImageDownload}
                    >
                        Download
                    </button>
                    <button
                        className="bg-amber-800 text-white sm:px-8 px-4 py-2 rounded sm:w-[140px] w-[100px] 
                        cursor-pointer sm:text-[14px] text-[12px]"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </Modal>
    )
}

export default ModalBox;








