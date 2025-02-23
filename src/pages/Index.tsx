
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import UploadModal from '@/components/UploadModal';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F6F6F7] to-[#F1F0FB]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={() => setIsModalOpen(true)}
            className="px-8 py-6 rounded-xl bg-[#9b87f5] text-white shadow-lg hover:shadow-xl hover:bg-[#7E69AB] transition-all duration-300 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span className="text-lg font-medium">Upload Documents</span>
          </Button>
        </motion.div>
        
        <AnimatePresence>
          {isModalOpen && (
            <UploadModal onClose={() => setIsModalOpen(false)} />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Index;
