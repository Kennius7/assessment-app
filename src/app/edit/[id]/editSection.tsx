/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import { Switch } from '@mui/material';


export default function ImageEditor({
    setGrayscale, grayscale, setBlur, blur, setDimensions, dimensions, 
    image, setScale, scale, setAngle, angle, canvasRef
}: {
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
        canvasRef: React.RefObject<HTMLCanvasElement | null>,
    }) {

    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [width, setWidth] = useState(300);
    const [height, setHeight] = useState(200);

    useEffect(() => {
        if (!image || !canvasRef?.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = dimensions.width;
        canvas.height = dimensions.height;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(position.x + image.width / 2, position.y + image.height / 2);
        ctx.rotate(angle * (Math.PI / 180));
        ctx.scale(scale, scale);
        // ctx.drawImage(image, -image.width / 2, -image.height / 2);
        ctx.restore();
    }, [image, position, scale, angle, canvasRef, dimensions.width, dimensions.height]);

    const handleGrayscaleToggle = () => {
        setGrayscale(!grayscale);
    };

    const handleBlurChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBlur(Number(e.target.value));
    };

    const handleDimensionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = Number(e.target.value);
        const name = e.target.name;

        if (!isNaN(newValue) && newValue > 0) {
            if (name === "width") {
                setWidth(newValue);
            } else if (name === "height") {
                setHeight(newValue);
            }
            setDimensions({ ...dimensions, [name]: newValue });
        }
    };

    const handleScaleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setScale(parseFloat(event.target.value));
    };

    const handleRotateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAngle(parseFloat(event.target.value));
    };


    return (
        <div className="sm:w-[280px] w-[98%] sm:h-[350px] h-[280px] flex flex-col 
            items-center sm:p-4 p-3 bg-gray-100 rounded-lg shadow-lg sm:m-2 m-1">
            <div className='w-full flex justify-start items-center'>
                <h2 className="sm:text-[18px] text-[16px] font-semibold sm:mb-3 mb-2 text-start">
                    Image Settings
                </h2>
            </div>
            <div className="w-full sm:mb-2 mb-0 flex justify-between items-center">
                <label className="text-sm sm:font-semibold font-normal">
                    Grayscale
                </label>
                <Switch checked={grayscale} onChange={handleGrayscaleToggle} />
            </div>
            <div className="sm:mb-4 mb-0 w-full flex flex-col justify-center items-start">
                <label className="block text-sm font-semibold mb-2">
                    Blur: {blur}
                </label>
                <input 
                    type="range" 
                    min="0" 
                    max="10" 
                    value={blur} 
                    onChange={handleBlurChange}
                    className="w-full"
                />
            </div>
            <div className='w-full flex justify-between items-center sm:mb-2 mb-1'>
                <label className="block text-sm font-semibold">
                    Width:
                </label>
                <input 
                    name="width"
                    type="number" 
                    value={width}
                    onChange={handleDimensionChange}
                    className="border px-2 py-1 sm:w-16 w-10 rounded-md text-[12px]"
                />
            </div>
            <div className='w-full flex justify-between items-center sm:mb-3 mb-0'>
                <label className="block text-sm font-semibold">
                    Height:
                </label>
                <input 
                    name="height"
                    type="number" 
                    value={height} 
                    onChange={handleDimensionChange}
                    className="border px-2 py-1 sm:w-16 w-10 rounded-md text-[12px]"
                />
            </div>
            <div className='w-full flex flex-col justify-center items-start sm:mb-3 mb-0'>
                <label className="block text-sm font-semibold sm:mb-2 mb-0">
                    Scale: {scale.toFixed(2)}
                </label>
                <input 
                    type="range" min="0.5" max="2" step="0.1" 
                    value={scale} onChange={handleScaleChange} 
                    className="w-full"
                />
            </div>
            <div className='w-full flex flex-col justify-center items-start'>
                <label className="block text-sm font-semibold sm:mb-2 mb-0">
                    Rotate: {angle}°
                </label>
                <input 
                    type="range" min="0" max="360" step="1" 
                    value={angle} onChange={handleRotateChange} 
                    className="w-full"
                />
            </div>
        </div>
    );
}



