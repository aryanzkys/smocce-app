import React, { useCallback, useRef, useState } from 'react';
import Cropper from 'react-easy-crop';

export default function CropModal({ open, image, onCancel, onCrop }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const inputRef = useRef(null);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Helper to get cropped image as blob
  const getCroppedImg = async () => {
    const createImage = (url) => {
      return new Promise((resolve, reject) => {
        const img = new window.Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
      });
    };
    const imageEl = await createImage(image);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const { width, height, x, y } = croppedAreaPixels;
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(imageEl, x, y, width, height, 0, 0, width, height);
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/jpeg');
    });
  };

  const handleCrop = async () => {
    const croppedBlob = await getCroppedImg();
    onCrop(croppedBlob);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white p-4 rounded shadow-lg relative w-[90vw] max-w-lg">
        <div className="relative w-full h-72 bg-gray-200">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>
        <div className="flex justify-between mt-4">
          <input
            ref={inputRef}
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-2/3"
          />
          <div className="space-x-2">
            <button
              onClick={onCancel}
              className="px-3 py-2 rounded bg-gray-300 text-gray-700 hover:bg-gray-400"
            >
              Batal
            </button>
            <button
              onClick={handleCrop}
              className="px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Simpan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
