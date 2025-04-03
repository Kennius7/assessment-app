"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Modal } from '@mui/material';
import EditSection from "../edit/[id]/editSection";
import { ParamValue } from 'next/dist/server/request/params';


const ModalBox = ({ open, onClose, setGrayscale, grayscale, setBlur, blur, setDimensions, dimensions, image, id }: {
    open: boolean,
    onClose: () => void,
    dimensions: { width: number, height: number },
    setDimensions: ({ width, height }: { width: number, height: number }) => void,
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
    const mouseStartRef = useRef({ x: 0, y: 0 });

    const drawCanvas = () => {
        if (!image || !canvasRef.current) {
            console.log("Image or canvas not loaded yet...");
            return;
        }

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = dimensions.width;
        canvas.height = dimensions.height;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(canvas.width / 2 + position.x, canvas.height / 2 + position.y);
        ctx.rotate((angle * Math.PI) / 180);
        ctx.scale(scale, scale);
        ctx.drawImage(image, -image.width / 2, -image.height / 2);
        ctx.restore();
        console.log("canvas drawn...");
    }


    useEffect(() => {
        console.log("useEffect called...");
        const timeout = setTimeout(() => {
            if (!image || !canvasRef.current) {
                console.log("Image or canvas not loaded yet on the useEffect...");
                return;
            }
    
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            if (!ctx) {
                console.log("Canvas context not loaded yet on the useEffect...");
                return;
            }
        
            // Ensure image is fully loaded before drawing
            if (!image.complete) {
                image.onload = () => drawCanvas();
                console.log("Canvas drawn on the useEffect...");
                return;
            }
    
            drawCanvas();
        }, 100);

        return () => clearTimeout(timeout);
    });

    const handleEditedImageDownload = () => {
        if (!canvasRef.current) {
            console.error("Canvas reference is missing!");
            return;
        }
        setTimeout(() => {
            const dataURL = canvasRef?.current?.toDataURL();
            const link = document.createElement("a");
            if (dataURL && link) {
                link.href = dataURL;
                link.download = `edited-image${id}.jpg`;
                link.click();
            }
        }, 500);    
    };


    //?============================================================================================>>

    // const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    //     setIsDragging(true);
    //     mouseStartRef.current = { x: e.clientX, y: e.clientY };
    //     document.addEventListener("mousemove", handleGlobalMouseMove);
    //     document.addEventListener("mouseup", handleGlobalMouseUp);
    // };

    // const handleGlobalMouseDown = (e: MouseEvent) => {
    //     setIsDragging(true);
    //     mouseStartRef.current = { x: e.clientX, y: e.clientY };
    //     document.addEventListener("mousemove", handleMouseMove);
    //     document.addEventListener("mouseup", handleMouseUp);
    // };

    // const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    //     if (!isDragging) return;
        
    //     setPosition(prev => ({
    //         x: prev.x + (mouseStartRef.current.x - e.clientX),
    //         y: prev.y + (mouseStartRef.current.y - e.clientY),
    //     }));
    //     mouseStartRef.current = { x: e.clientX, y: e.clientY };
    //     console.log("Position:>>>>", position);
    // };

    // const handleGlobalMouseMove = (e: MouseEvent) => {
    //     if (!isDragging) return;
        
    //     setPosition(prev => ({
    //         x: prev.x + (mouseStartRef.current.x - e.clientX),
    //         y: prev.y + (mouseStartRef.current.y - e.clientY),
    //     }));
    //     mouseStartRef.current = { x: e.clientX, y: e.clientY };
    //     console.log("Position:>>>>", position);
    // };

    // const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => { 
    //     setIsDragging(false);
    //     document.removeEventListener("mousemove", handleMouseMove);
    //     document.removeEventListener("mouseup", handleMouseUp);
    // };

    // const handleGlobalMouseUp = () => { 
    //     setIsDragging(false);
    //     document.removeEventListener("mousemove", handleGlobalMouseMove);
    //     document.removeEventListener("mouseup", handleGlobalMouseUp);
    // };

    //?============================================================================================>>

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        setIsDragging(true);
        mouseStartRef.current = { x: e.clientX, y: e.clientY };
        // document.addEventListener("mousemove", handleMouseMove);
        // document.addEventListener("mouseup", handleMouseUp);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        if (!isDragging) return;
        
        setPosition(prev => ({
            x: prev.x + (mouseStartRef.current.x - e.clientX),
            y: prev.y + (mouseStartRef.current.y - e.clientY),
        }));
        mouseStartRef.current = { x: e.clientX, y: e.clientY };
        console.log("Position:>>>>", position);
    };

    const handleMouseUp = () => { 
        setIsDragging(false);
        // document.removeEventListener("mousemove", handleMouseMove);
        // document.removeEventListener("mouseup", handleMouseUp);
    };



    //?============================================================================================>>

    const handleTouchStart = (e: React.TouchEvent) => {
        setIsDragging(true);
        const touch = e.touches[0];
        mouseStartRef.current = { x: touch.clientX, y: touch.clientY };
    };
    
    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging) return;
        const touch = e.touches[0];
    
        setPosition(prev => ({
            x: prev.x + (mouseStartRef.current.x - touch.clientX),
            y: prev.y + (mouseStartRef.current.y - touch.clientY),
        }));
        mouseStartRef.current = { x: touch.clientX, y: touch.clientY };
        console.log("Position:>>>>", position);
    };
    
    const handleTouchEnd = () => { setIsDragging(false) };



    return (
        <Modal open={open} onClose={onClose}>
            <div 
                style={{ transform: "translate(-50%, -50%)" }} 
                className='absolute top-[50%] left-[50%] sm:w-[700px] w-[98%] sm:h-[80%] h-fit 
                flex flex-col justify-center items-center bg-slate-200 border-slate-700 
                border-[2px] sm:p-6 p-2 sm:rounded-[6px] rounded-[2px]'
            >
                <div className='w-full flex justify-start items-center'>
                    <div className='sm:text-[20px] text-[18px] font-semibold text-start ml-2'>
                        Edit Image
                    </div>
                </div>
    
                <div className='w-full h-full flex sm:flex-row flex-col sm:justify-between 
                    justify-around items-center m-1'>
                    <div className='sm:w-[360px] w-[98%] sm:h-[350px] h-[200px] flex justify-center 
                        items-center overflow-hidden border-1 border-slate-800'>
                        <canvas 
                            ref={canvasRef}
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                            className="border cursor-pointer w-full h-full touch-none"
                        />
                    </div>
                    <EditSection 
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
