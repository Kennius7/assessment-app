/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useRef, useEffect } from 'react';
// import { Stage, Layer, Image as KonvaImage, Transformer } from 'react-konva';
import dynamic from 'next/dynamic';

const Stage = dynamic(() => import('react-konva').then(mod => mod.Stage), { ssr: false });
const Layer = dynamic(() => import('react-konva').then(mod => mod.Layer), { ssr: false });
const Transformer = dynamic(() => import('react-konva').then(mod => mod.Transformer), { ssr: false });
const KonvaImage = dynamic(() => import('react-konva').then(mod => mod.Image), { ssr: false });

interface ImageEditorProps {
  src: string;
  onSave: (editedImage: string) => void;
}

const ImageEditor: React.FC<ImageEditorProps> = ({ src, onSave }) => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const imageRef = useRef<any>(null);
  const transformerRef = useRef<any>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const img = new window.Image();
    img.src = src;
    img.onload = () => {
      setImage(img);
      setDimensions({
        width: img.width,
        height: img.height,
      });
    };
  }, [src]);

  useEffect(() => {
    if (transformerRef.current && imageRef.current) {
      transformerRef.current.nodes([imageRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [image]);

  const handleTransformEnd = () => {
    const node = imageRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    node.scaleX(1);
    node.scaleY(1);
    node.width(node.width() * scaleX);
    node.height(node.height() * scaleY);
  };

  const handleSave = () => {
    if (imageRef.current) {
      const dataURL = imageRef.current.getStage().toDataURL();
      onSave(dataURL);
    }
  };

  return (
    <div className="relative w-full h-full">
      <Stage width={dimensions.width} height={dimensions.height}>
        <Layer>
          {image && (
            <>
              <KonvaImage
                ref={imageRef}
                image={image}
                draggable
                onTransformEnd={handleTransformEnd}
              />
              <Transformer
                ref={transformerRef}
                boundBoxFunc={(oldBox, newBox) => newBox}
              />
            </>
          )}
        </Layer>
      </Stage>
      <button
        className="absolute bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleSave}
      >
        Save
      </button>
    </div>
  );
};

export default ImageEditor;
