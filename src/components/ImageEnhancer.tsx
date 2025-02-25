import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, Copy, RotateCcw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
interface ImageEnhancerProps {
  onClose: () => void;
  isDark: boolean;
}
const ImageEnhancer = ({
  onClose,
  isDark
}: ImageEnhancerProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [description, setDescription] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isHoveringImage, setIsHoveringImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    toast
  } = useToast();
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
          const {
            data,
            error
          } = await supabase.functions.invoke('analyze-image', {
            body: {
              image: base64Image
            }
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
  return <motion.div initial={{
    opacity: 0
  }} animate={{
    opacity: 1
  }} exit={{
    opacity: 0
  }} className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-start md:items-center justify-center z-50 p-4 overflow-y-auto md:overflow-hidden" onClick={onClose}>
      <motion.div initial={{
      scale: 0.95,
      opacity: 0
    }} animate={{
      scale: 1,
      opacity: 1
    }} exit={{
      scale: 0.95,
      opacity: 0
    }} transition={{
      duration: 0.2
    }} className="w-full max-w-5xl bg-card rounded-lg border shadow-lg overflow-hidden my-4 md:my-0" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center py-4 px-6 border-b">
          <h2 className="font-semibold text-card-foreground text-xl">
            Image Analysis
          </h2>
          <div className="flex gap-2 items-center">
            {image && <Button variant="ghost" onClick={() => {
            setImage(null);
            setDescription('');
            fileInputRef.current && (fileInputRef.current.value = '');
          }} className="rounded-full" size="sm">
                <RotateCcw className="w-4 h-4 mr-2" />
                Try New
              </Button>}
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 p-6 max-h-[calc(100vh-10rem)] md:max-h-[80vh] overflow-y-auto">
          <div className="bg-muted rounded-lg overflow-hidden h-[300px] md:h-[400px]">
            {!image ? <motion.div className="h-full border-2 border-dashed rounded-lg p-10 text-center transition-colors flex flex-col items-center justify-center" onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
                <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept="image/*" />
                
                <Upload className="w-12 h-12 mx-auto mb-6 text-muted-foreground" />
                <p className="mb-3 text-lg text-card-foreground">
                  Drag and drop your image here, or{' '}
                  <button onClick={() => fileInputRef.current?.click()} className="underline underline-offset-4 text-primary hover:text-primary/90">
                    browse
                  </button>
                </p>
                <p className="text-sm text-muted-foreground">
                  Supported formats: PNG, JPG, JPEG
                </p>
              </motion.div> : <div className="relative h-full" onMouseEnter={() => setIsHoveringImage(true)} onMouseLeave={() => setIsHoveringImage(false)}>
                <img src={image} alt="Uploaded image" className="w-full h-full object-contain" />
                {isHoveringImage && <motion.button initial={{
              opacity: 0
            }} animate={{
              opacity: 1
            }} className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <div className="text-white flex flex-col items-center">
                      <Upload className="w-8 h-8 mb-2" />
                      <span className="text-sm">Upload New Image</span>
                    </div>
                  </motion.button>}
              </div>}
          </div>
          
          <div className="bg-muted rounded-lg flex flex-col h-[300px] md:h-[400px]">
            <div className="flex justify-between items-center py-3 px-6 border-b bg-muted sticky top-0 z-10 rounded">
              <h3 className="font-medium text-card-foreground">
                Image Description
              </h3>
              {description && !isProcessing && <Button variant="ghost" size="icon" onClick={copyDescription} className="rounded-full" title="Copy description">
                  <Copy className="w-4 h-4" />
                </Button>}
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {isProcessing ? <div className="flex flex-col items-center justify-center h-full space-y-4">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <p className="text-muted-foreground">Taking a look at your image...</p>
                </div> : description ? <p className="whitespace-pre-line text-left text-card-foreground">
                  {description}
                </p> : <div className="flex items-center justify-center h-full text-muted-foreground">
                  Upload an image to see its description
                </div>}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>;
};
export default ImageEnhancer;