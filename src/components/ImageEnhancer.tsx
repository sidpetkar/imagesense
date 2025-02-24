import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, Copy, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ImageEnhancerProps {
  onClose: () => void;
  isDark: boolean;
}

const ImageEnhancer = ({ onClose, isDark }: ImageEnhancerProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [description, setDescription] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isHoveringImage, setIsHoveringImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

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

  const copyDescription = async () => {
    try {
      await navigator.clipboard.writeText(description);
      toast({
        title: "Description copied!",
        duration: 2000
      });
    } catch (err) {
      toast({
        title: "Failed to copy description",
        variant: "destructive",
        duration: 2000
      });
    }
  };

  const SkeletonLoader = () => (
    <div className="space-y-3 animate-pulse">
      <div className={`h-4 ${isDark ? 'bg-[#1E2833]' : 'bg-[#EAEAEB]'} rounded w-full animate-shimmer`} />
      <div className={`h-4 ${isDark ? 'bg-[#1E2833]' : 'bg-[#EAEAEB]'} rounded w-5/6 animate-shimmer`} />
      <div className={`h-4 ${isDark ? 'bg-[#1E2833]' : 'bg-[#EAEAEB]'} rounded w-4/5 animate-shimmer`} />
      <div className="space-y-2">
        <div className={`h-3 ${isDark ? 'bg-[#1E2833]' : 'bg-[#EAEAEB]'} rounded w-3/4 animate-shimmer`} />
        <div className={`h-3 ${isDark ? 'bg-[#1E2833]' : 'bg-[#EAEAEB]'} rounded w-2/3 animate-shimmer`} />
      </div>
      <div className="space-y-2">
        <div className={`h-3 ${isDark ? 'bg-[#1E2833]' : 'bg-[#EAEAEB]'} rounded w-5/6 animate-shimmer`} />
        <div className={`h-3 ${isDark ? 'bg-[#1E2833]' : 'bg-[#EAEAEB]'} rounded w-3/4 animate-shimmer`} />
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      style={{
        backgroundColor: isDark ? 'rgba(13, 17, 22, 0.4)' : 'rgba(26, 31, 44, 0.4)'
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className={`rounded-2xl shadow-2xl w-full max-w-5xl mx-auto h-[90vh] flex flex-col ${
          isDark ? 'bg-[#0D1116] border border-[#1E2833]' : 'bg-white border border-[#EAEAEB]'
        }`}
        onClick={e => e.stopPropagation()}
      >
        <div className={`flex justify-between items-center p-6 border-b ${
          isDark ? 'border-[#1E2833]' : 'border-[#EAEAEB]'
        }`}>
          <h2 className={`text-2xl font-semibold ${
            isDark ? 'text-white' : 'text-[#1A1F2C]'
          }`}>
            Image Analysis
          </h2>
          <div className="flex gap-2 items-center">
            {image && (
              <Button
                variant="ghost"
                onClick={() => {
                  setImage(null);
                  setDescription('');
                  fileInputRef.current && (fileInputRef.current.value = '');
                }}
                className={`rounded-full flex items-center gap-2 ${
                  isDark ? 'hover:bg-[#1E2833] text-white/60' : 'hover:bg-[#F4F4F5] text-[#8E9196]'
                }`}
              >
                <RotateCcw className="w-4 h-4" />
                Try New
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className={`rounded-full ${
                isDark ? 'hover:bg-[#1E2833]' : 'hover:bg-[#F4F4F5]'
              }`}
            >
              <X className={`w-5 h-5 ${
                isDark ? 'text-white/60' : 'text-[#8E9196]'
              }`} />
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 p-6 flex-1 overflow-hidden">
          <div className={`rounded-xl flex flex-col ${
            isDark ? 'bg-[#131920] border border-[#1E2833]' : 'bg-[#F4F4F5] border border-[#EAEAEB]'
          }`}>
            {!image ? (
              <motion.div
                className="border-2 border-dashed rounded-xl p-10 text-center transition-colors flex-1 flex flex-col items-center justify-center"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  className="hidden"
                  accept="image/*"
                />
                
                <Upload className={`w-12 h-12 mx-auto mb-6 ${
                  isDark ? 'text-[#D4D4D6]' : 'text-[#8E9196]'
                }`} />
                <p className={`mb-3 text-lg ${
                  isDark ? 'text-white' : 'text-[#1A1F2C]'
                }`}>
                  Drag and drop your image here, or{' '}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className={`underline underline-offset-4 ${
                      isDark ? 'text-[#D4D4D6] hover:text-white' : 'text-[#8E9196] hover:text-[#1A1F2C]'
                    }`}
                  >
                    browse
                  </button>
                </p>
                <p className={
                  isDark ? 'text-sm text-white/60' : 'text-sm text-[#8E9196]'
                }>
                  Supported formats: PNG, JPG, JPEG
                </p>
              </motion.div>
            ) : (
              <div 
                className="relative flex-1"
                onMouseEnter={() => setIsHoveringImage(true)}
                onMouseLeave={() => setIsHoveringImage(false)}
              >
                <img 
                  src={image} 
                  alt="Uploaded image"
                  className="w-full h-full object-contain"
                />
                {isHoveringImage && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="text-white flex flex-col items-center">
                      <Upload className="w-8 h-8 mb-2" />
                      <span className="text-sm">Upload New Image</span>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </div>
          
          <div className={`rounded-xl flex flex-col ${
            isDark ? 'bg-[#131920] border border-[#1E2833]' : 'bg-[#F4F4F5] border border-[#EAEAEB]'
          }`}>
            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-inherit z-10">
              <h3 className={`text-lg font-medium ${
                isDark ? 'text-white' : 'text-[#1A1F2C]'
              }`}>
                Image Description
              </h3>
              {description && !isProcessing && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={copyDescription}
                  className={`rounded-full ${
                    isDark ? 'hover:bg-[#1E2833]' : 'hover:bg-white/50'
                  }`}
                  title="Copy description"
                >
                  <Copy className={`w-4 h-4 ${
                    isDark ? 'text-white/60' : 'text-[#8E9196]'
                  }`} />
                </Button>
              )}
            </div>
            <div className="flex-1 overflow-y-auto p-6 pt-0">
              {isProcessing ? (
                <SkeletonLoader />
              ) : description ? (
                <p className={`whitespace-pre-line text-left ${
                  isDark ? 'text-white/90' : 'text-[#1A1F2C]'
                }`}>
                  {description}
                </p>
              ) : (
                <div className={`flex items-center justify-center h-full ${
                  isDark ? 'text-white/60' : 'text-[#8E9196]'
                }`}>
                  Upload an image to see its description
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ImageEnhancer;
