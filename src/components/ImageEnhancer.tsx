import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Copy, RotateCcw, Speaker, SpeakerOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import TypewriterText from './TypewriterText';

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
  const [showTypewriter, setShowTypewriter] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
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

  const copyDescription = async () => {
    try {
      await navigator.clipboard.writeText(description);
      toast({
        title: "Description copied!",
        description: "Text copied to clipboard",
        variant: "default",
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

  const handleSpeech = async () => {
    if (isGeneratingAudio) return;

    if (isSpeaking && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsSpeaking(false);
      return;
    }

    try {
      if (!audioRef.current) {
        setIsGeneratingAudio(true);
        const { data, error } = await supabase.functions.invoke('text-to-voice', {
          body: { text: description }
        });

        if (error) throw error;

        const audio = new Audio(data.audioUrl);
        audioRef.current = audio;
        
        audio.addEventListener('ended', () => {
          setIsSpeaking(false);
        });
      }

      await audioRef.current.play();
      setIsSpeaking(true);
    } catch (error) {
      console.error('Error generating speech:', error);
      toast({
        title: "Failed to generate speech",
        variant: "destructive",
        duration: 2000
      });
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  const processImage = async (file: File) => {
    setIsProcessing(true);
    setDescription('');
    setShowTypewriter(false);
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
          setShowTypewriter(true);
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

  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-5xl bg-card rounded-lg border shadow-lg relative"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-between items-center py-4 px-6 border-b">
            <h2 className="font-semibold text-card-foreground text-xl">
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
                  size="sm"
                  className="rounded-full text-xs gap-1"
                >
                  <RotateCcw className="w-4 h-4" />
                  Try New
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 p-6 max-h-[calc(100vh-8rem)] overflow-y-auto">
            <div className="bg-muted rounded-lg overflow-hidden h-[300px] md:h-[400px]">
              {!image ? (
                <motion.button
                  className="w-full h-full border-2 border-dashed rounded-lg p-10 text-center transition-colors flex flex-col items-center justify-center"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                    accept="image/*"
                  />
                  
                  <Upload className="w-12 h-12 mx-auto mb-6 text-muted-foreground" />
                  <p className="mb-3 text-card-foreground text-base">
                    Drag and drop your image here, or{' '}
                    <span className="underline underline-offset-4 text-primary">
                      browse
                    </span>
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Supported formats: PNG, JPG, JPEG
                  </p>
                </motion.button>
              ) : (
                <div
                  className="relative h-full cursor-pointer"
                  onMouseEnter={() => setIsHoveringImage(true)}
                  onMouseLeave={() => setIsHoveringImage(false)}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                    accept="image/*"
                  />
                  <img
                    src={image}
                    alt="Uploaded image"
                    className="w-full h-full object-contain"
                  />
                  {isHoveringImage && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-black/50 flex items-center justify-center"
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
            
            <div className="bg-muted rounded-lg flex flex-col h-[300px] md:h-[400px]">
              <div className="flex justify-between items-center py-3 px-6 border-b bg-muted sticky top-0 z-10 rounded-t-lg">
                <h3 className="font-medium text-card-foreground">
                  Description
                </h3>
                {description && !isProcessing && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleSpeech}
                      className="rounded-full"
                      title={isSpeaking ? "Stop speaking" : "Speak description"}
                      disabled={isGeneratingAudio}
                    >
                      {isSpeaking ? (
                        <SpeakerOff className="w-4 h-4" />
                      ) : (
                        <Speaker className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={copyDescription}
                      className="rounded-full"
                      title="Copy description"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                {isProcessing || (!description && image) ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center h-full space-y-4"
                  >
                    <div className="flex items-center space-x-2">
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [1, 0.5, 1]
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          repeatDelay: 0.2
                        }}
                        className="w-2 h-2 rounded-full bg-primary"
                      />
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [1, 0.5, 1]
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          repeatDelay: 0.2,
                          delay: 0.2
                        }}
                        className="w-2 h-2 rounded-full bg-primary"
                      />
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [1, 0.5, 1]
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          repeatDelay: 0.2,
                          delay: 0.4
                        }}
                        className="w-2 h-2 rounded-full bg-primary"
                      />
                    </div>
                    <p className="text-muted-foreground">Give us a moment… Your image description is on its way!</p>
                  </motion.div>
                ) : description ? (
                  <AnimatePresence mode="wait">
                    {showTypewriter && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <TypewriterText text={description} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    Upload an image to see its description
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ImageEnhancer;
