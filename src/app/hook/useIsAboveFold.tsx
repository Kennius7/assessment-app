
import { useState, useEffect, useRef } from "react";



const useImagesAboveFold = (numImages: number, threshold = 0.5) => {
    const [visibleImages, setVisibleImages] = useState<Set<number>>(new Set());
    const imageRefs = useRef<(HTMLImageElement | null)[]>(new Array(numImages).fill(null));

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const updatedVisibleImages = new Set<number>();
                entries.forEach((entry: IntersectionObserverEntry, index: number) => {
                    if (entry.isIntersecting) { updatedVisibleImages.add(index) }
                });
                setVisibleImages(updatedVisibleImages);
            },
            {
                root: null,
                threshold: threshold,
            }
        );

        imageRefs.current.forEach((imgRef) => {
            if (imgRef) observer.observe(imgRef);
        });

        return () => observer.disconnect();
    }, [numImages, threshold]);

    return { imageRefs, visibleImages };
};

export default useImagesAboveFold;



