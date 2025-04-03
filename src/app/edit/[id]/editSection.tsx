/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Switch, Box } from '@mui/material';


export default function ImageEditor({
    settingHeight, settingWidth, setGrayscale, grayscale, setBlur, blur, setDimensions, dimensions,
}: {
        settingHeight: number, 
        settingWidth: number, 
        setGrayscale: (value: boolean) => void, 
        grayscale: boolean,
        setBlur: (value: number) => void, 
        blur: number,
        setDimensions: (value: { width: number, height: number }) => void,
        dimensions: { width: number, height: number }
    }) {

    const [width, setWidth] = useState(300);
    const [height, setHeight] = useState(200);

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


    return (
        <div 
            style={{ height: settingHeight, width: settingWidth/2 }} 
            className="flex flex-col items-center p-4 bg-gray-100 rounded-lg shadow-lg m-2"
        >
            <h2 className="text-xl font-bold mb-4">
                Edit Settings:
            </h2>
            <div className="w-full mb-4 flex justify-between items-center">
                <label className="text-sm font-semibold">
                    Grayscale
                </label>
                <Switch checked={grayscale} onChange={handleGrayscaleToggle} />
            </div>
            <div className="mb-4 w-full">
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
                    className="border px-2 py-1 w-16 rounded-md"
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
                    className="border px-2 py-1 w-16 rounded-md"
                />
            </div>
            <Box className="flex flex-col items-center gap-2 w-full">
                <label className="text-gray-600">Scale: {scale.toFixed(2)}</label>
                <input 
                    type="range" min="0.5" max="2" step="0.1" 
                    value={scale} onChange={handleScaleChange} 
                    className="w-full"
                />

                <label className="text-gray-600">Rotate: {angle}°</label>
                <input 
                    type="range" min="0" max="360" step="1" 
                    value={angle} onChange={handleRotateChange} 
                    className="w-full"
                />
            </Box>
        </div>
    );
}



