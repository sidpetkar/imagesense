
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload } from 'lucide-react';
import ImageEnhancer from '@/components/ImageEnhancer';

const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F6F6F7] to-[#F1F0FB] p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl w-full font-['Inter_Tight']"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-[#1A1F2C] mb-4">
          ImageSense
        </h1>
        <h2 className="text-xl md:text-2xl text-[#1A1F2C]/80 mb-6">
          Instant Image Analysis & Smart Descriptions
        </h2>
        <p className="text-[#8E9196] mb-8 max-w-2xl mx-auto">
          Upload any image and let our AI-powered tool generate detailed, accurate, and meaningful descriptions in seconds
        </p>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors hover:border-[#9b87f5] hover:bg-[#F1F0FB] border-[#E5DEFF] cursor-pointer`}
          onClick={() => setIsModalOpen(true)}
        >
          <Upload className="w-12 h-12 mx-auto mb-6 text-[#9b87f5]" />
          <p className="text-[#1A1F2C] mb-3 text-lg">
            Upload Image
          </p>
          <p className="text-sm text-[#8E9196]">Drag and drop or click to browse</p>
        </motion.div>
        
        <AnimatePresence>
          {isModalOpen && (
            <ImageEnhancer onClose={() => setIsModalOpen(false)} />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Index;
