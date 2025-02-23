
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload } from 'lucide-react';
import ImageEnhancer from '@/components/ImageEnhancer';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F6F6F7] to-[#F1F0FB]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center font-['Inter_Tight']"
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={() => setIsModalOpen(true)}
            className="px-8 py-6 rounded-xl bg-[#9b87f5] text-white shadow-lg hover:shadow-xl hover:bg-[#7E69AB] transition-all duration-300 flex items-center gap-2"
          >
            <Upload className="w-5 h-5" />
            <span className="text-lg font-medium">Enhance Image</span>
          </Button>
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
