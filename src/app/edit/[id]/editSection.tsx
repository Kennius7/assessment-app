/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Switch, Box } from '@mui/material';


export default function ImageEditor({
    settingHeight, settingWidth, setGrayscale, grayscale, setBlur, blur, 
    setDimensions, dimensions, image, setScale, scale, setAngle, angle, canvasRef
}: {
        settingHeight: number, 
        settingWidth: number, 
        setGrayscale: (value: boolean) => void, 
        grayscale: boolean,
        setBlur: (value: number) => void, 
        blur: number,
        setDimensions: (value: { width: number, height: number }) => void,
        dimensions: { width: number, height: number }
        image: HTMLImageElement | null,
        setScale: (value: number) => void,
        scale: number,
        setAngle: (value: number) => void,
        angle: number,
        canvasRef: React.RefObject<HTMLCanvasElement> | null,
    }) {

    // const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [width, setWidth] = useState(300);
    const [height, setHeight] = useState(200);
    // const [scale, setScale] = useState(1);
    // const [angle, setAngle] = useState(0);

    useEffect(() => {
        if (!image || !canvasRef?.current) return;

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
    }, [image, position, scale, angle, canvasRef]);

    const handleGrayscaleToggle = () => {
        setGrayscale(!grayscale);
    };

    const handleBlurChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBlur(Number(e.target.value));
    };

    const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDimensions({ ...dimensions, width: Number(e.target.value) });
    };

    const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDimensions({ ...dimensions, height: Number(e.target.value) });
    };

    const handleScaleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setScale(parseFloat(event.target.value));
    };

    const handleRotateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAngle(parseFloat(event.target.value));
    };


    return (
        <div 
            style={{ height: settingHeight, width: window.innerWidth > 500 ? settingWidth/2 : "98%" }} 
            className="flex flex-col items-center sm:p-4 p-3 bg-gray-100 rounded-lg shadow-lg sm:m-2 m-1"
        >
            <h2 className="text-xl font-bold mb-4">
                Edit Settings:
            </h2>
            <div className="w-full sm:mb-4 mb-1 flex justify-between items-center">
                <label className="text-sm font-semibold">
                    Grayscale
                </label>
                <Switch checked={grayscale} onChange={handleGrayscaleToggle} />
            </div>
            <div className="sm:mb-4 mb-1 w-full">
                <label className="block text-sm font-semibold mb-2">Blur: {blur}</label>
                <input 
                    type="range" 
                    min="0" 
                    max="10" 
                    value={blur} 
                    onChange={handleBlurChange}
                    className="w-full"
                />
            </div>
            <div className='w-full flex justify-between items-center mb-2'>
                <label className="block text-sm font-semibold">
                    Width:
                </label>
                <input 
                    type="number" 
                    value={dimensions.width} 
                    onChange={handleWidthChange}
                    className="border px-2 py-1 sm:w-16 w-10 rounded-md text-[12px]"
                />
            </div>
            <div className='w-full flex justify-between items-center'>
                <label className="block text-sm font-semibold">
                    Height:
                </label>
                <input 
                    type="number" 
                    value={dimensions.height} 
                    onChange={handleHeightChange}
                    className="border px-2 py-1 sm:w-16 w-10 rounded-md text-[12px]"
                />
            </div>
            <div className='w-full'>
                <label className="text-gray-600">
                    Scale: {scale.toFixed(2)}
                </label>
                <input 
                    type="range" min="0.5" max="2" step="0.1" 
                    value={scale} onChange={handleScaleChange} 
                    className="w-full"
                />
            </div>
            <div className='w-full'>
                <label className="text-gray-600">Rotate: {angle}°</label>
                <input 
                    type="range" min="0" max="360" step="1" 
                    value={angle} onChange={handleRotateChange} 
                    className="w-full"
                />
            </div>
            {/* <Box className="flex flex-col items-center gap-2 w-full">

            </Box> */}
        </div>
    );
}



