
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, Loader2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from "@/integrations/supabase/client";

interface ImageEnhancerProps {
  onClose: () => void;
}

const ImageEnhancer = ({ onClose }: ImageEnhancerProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [description, setDescription] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      await processImage(file);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await processImage(e.target.files[0]);
    }
  };

  const processImage = async (file: File) => {
    setIsProcessing(true);
    setDescription('');
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result as string;
        setImage(base64Image);
        
        try {
          const { data, error } = await supabase.functions.invoke('analyze-image', {
            body: { image: base64Image }
          });

          if (error) throw error;
          setDescription(data.description);
        } catch (error) {
          console.error('Error analyzing image:', error);
          setDescription('Error analyzing image. Please try again.');
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error processing image:', error);
      setDescription('Error processing image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetImage = () => {
    setImage(null);
    setDescription('');
    fileInputRef.current && (fileInputRef.current.value = '');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-[#1A1F2C]/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl mx-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-semibold text-[#1A1F2C]">Image Analysis</h2>
          <div className="flex gap-2">
            {image && (
              <Button
                variant="ghost"
                size="icon"
                onClick={resetImage}
                className="rounded-full hover:bg-[#F1F0FB]"
                title="Try Another"
              >
                <RotateCcw className="w-5 h-5 text-[#8E9196]" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full hover:bg-[#F1F0FB]"
            >
              <X className="w-5 h-5 text-[#8E9196]" />
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 p-6">
          <div className="flex flex-col">
            {!image ? (
              <motion.div
                className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors h-full flex flex-col items-center justify-center ${
                  isDragging ? 'border-[#9b87f5] bg-[#F1F0FB]' : 'border-[#E5DEFF]'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                animate={{ borderColor: isDragging ? '#9b87f5' : '#E5DEFF' }}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  className="hidden"
                  accept="image/*"
                />
                
                <Upload className="w-12 h-12 mx-auto mb-6 text-[#9b87f5]" />
                <p className="text-[#1A1F2C] mb-3 text-lg">
                  Drag and drop your image here, or{' '}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[#9b87f5] underline underline-offset-4 hover:text-[#7E69AB]"
                  >
                    browse
                  </button>
                </p>
                <p className="text-sm text-[#8E9196]">Supported formats: PNG, JPG, JPEG</p>
              </motion.div>
            ) : (
              <div className="relative rounded-xl overflow-hidden bg-[#F1F0FB] aspect-square">
                <img 
                  src={image} 
                  alt="Uploaded image"
                  className="w-full h-full object-contain"
                />
              </div>
            )}
          </div>
          
          <div className="bg-[#F1F0FB] rounded-xl p-6 min-h-[300px] flex flex-col">
            <h3 className="text-lg font-medium text-[#1A1F2C] mb-4">Image Description</h3>
            {isProcessing ? (
              <div className="flex-1 space-y-3">
                <div className="animate-pulse h-4 bg-[#E5DEFF] rounded w-3/4"></div>
                <div className="animate-pulse h-4 bg-[#E5DEFF] rounded w-1/2"></div>
                <div className="animate-pulse h-4 bg-[#E5DEFF] rounded w-5/6"></div>
                <div className="animate-pulse h-4 bg-[#E5DEFF] rounded w-2/3"></div>
              </div>
            ) : description ? (
              <p className="text-[#8E9196] whitespace-pre-line flex-1">{description}</p>
            ) : (
              <div className="flex items-center justify-center flex-1 text-[#8E9196]">
                Upload an image to see its description
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ImageEnhancer;
