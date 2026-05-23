import { useState, useEffect } from 'react';

export const useFramePreload = (path: string, prefix: string, frameCount: number, padStart: number = 3) => {
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const loadImages = async () => {
      let loadedCount = 0;
      const loadedImages = await Promise.all(
        Array.from({ length: frameCount }, (_, i) => {
          return new Promise<HTMLImageElement>((resolve) => {
            const img = new Image();
            img.onload = () => {
              loadedCount++;
              setProgress(loadedCount / frameCount);
              resolve(img);
            };
            img.onerror = () => {
              console.error(`Failed to load image: ${img.src}`);
              // return an empty image to avoid breaking Promise.all
              resolve(new Image());
            };
            // Format: path/prefix-001.jpg
            img.src = `${path}/${prefix}-${String(i + 1).padStart(padStart, '0')}.jpg`;
          });
        })
      );
      setImages(loadedImages);
      setLoaded(true);
    };
    loadImages();
  }, [path, prefix, frameCount, padStart]);

  return { images, loaded, progress };
};
