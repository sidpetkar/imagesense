
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ImageEnhancer from '@/components/ImageEnhancer';
import { useTheme } from '@/hooks/use-theme';

const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isDark, toggle } = useTheme();

  return (
    <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
      isDark 
        ? 'bg-gradient-to-b from-[#0D1116] via-[#131920] to-[#263240]' 
        : 'bg-gradient-to-b from-[#F8F8F8] via-[#EAEAEB] to-[#D4D4D6]'
    }`}>
      <Button
        variant="ghost"
        size="icon"
        onClick={toggle}
        className="fixed top-6 right-6 rounded-full hover:bg-white/10"
      >
        {isDark ? (
          <Sun className="w-5 h-5 text-white" />
        ) : (
          <Moon className="w-5 h-5 text-[#1A1F2C]" />
        )}
      </Button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl w-full font-['Inter_Tight']"
      >
        <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${
          isDark ? 'text-white' : 'text-[#1A1F2C]'
        }`}>
          ImageSense
        </h1>
        <h2 className={`text-xl md:text-2xl mb-8 ${
          isDark ? 'text-white/80' : 'text-[#1A1F2C]/80'
        }`}>
          Instant Image Analysis & Smart Descriptions
        </h2>

        <motion.div
          whileHover={{ 
            scale: 1.02,
            rotate: 1,
            transition: { duration: 0.3 }
          }}
          whileTap={{ scale: 0.98 }}
          className={`border-2 border-dashed rounded-xl p-10 text-center transition-all duration-300 cursor-pointer backdrop-blur-sm ${
            isDark 
              ? 'border-[#9b87f5] bg-white/5 hover:bg-white/10 hover:border-[#7E69AB] shadow-lg shadow-[#9b87f5]/10'
              : 'border-[#9b87f5] bg-white hover:bg-[#F1F0FB] hover:border-[#7E69AB] shadow-lg'
          }`}
          onClick={() => setIsModalOpen(true)}
        >
          <Upload className={`w-12 h-12 mx-auto mb-6 ${
            isDark ? 'text-[#9b87f5]' : 'text-[#9b87f5]'
          }`} />
          <p className={`mb-3 text-lg ${
            isDark ? 'text-white' : 'text-[#1A1F2C]'
          }`}>
            Upload Image
          </p>
          <p className={
            isDark ? 'text-sm text-white/60' : 'text-sm text-[#8E9196]'
          }>
            Drag and drop or click to browse
          </p>
        </motion.div>
        
        <AnimatePresence>
          {isModalOpen && (
            <ImageEnhancer onClose={() => setIsModalOpen(false)} isDark={isDark} />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Index;
