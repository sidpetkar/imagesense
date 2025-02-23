
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import UploadModal from '@/components/UploadModal';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100">
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
            className="px-8 py-6 rounded-xl bg-white text-zinc-800 shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center gap-2 border border-zinc-200"
          >
            <Plus className="w-5 h-5" />
            <span className="text-lg">Upload Documents</span>
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
