import React, { useRef, useState } from 'react';

interface ImageUploaderProps {
  onImageSelected: (base64: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) processFile(file);
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      onImageSelected(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div 
      className={`w-full max-w-md aspect-[4/5] rounded-3xl border-4 border-dashed flex flex-col items-center justify-center p-8 transition-colors cursor-pointer bg-white
        ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-400'}`}
      onClick={() => fileInputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept="image/*" 
      />
      
      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6 text-4xl">
        📸
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-2">Upload a Selfie</h3>
      <p className="text-slate-500 text-center mb-6">
        Drag & drop or click to browse.<br/>
        <span className="text-sm text-slate-400">Works best with good lighting.</span>
      </p>
      
      <span className="text-blue-600 font-semibold text-sm bg-blue-50 px-4 py-2 rounded-full">
        Select Photo
      </span>
    </div>
  );
};
