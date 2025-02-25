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
    <div className={`min-h-screen flex items-center justify-center px-4 md:px-6 ${
      isDark 
        ? 'bg-gradient-to-b from-background via-background/80 to-background/60' 
        : 'bg-gradient-to-b from-background via-muted to-muted/80'
    }`}>
      <Button
        variant="ghost"
        size="icon"
        onClick={toggle}
        className="fixed top-6 right-6 rounded-full"
      >
        {isDark ? (
          <Sun className="h-5 w-5 text-muted-foreground" />
        ) : (
          <Moon className="h-5 w-5 text-muted-foreground" />
        )}
      </Button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center w-full max-w-3xl space-y-12 py-8 md:py-12"
      >
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            ImageSense
          </h1>
          <h2 className="text-xl md:text-2xl text-muted-foreground">
            Instant Image Analysis & Smart Descriptions
          </h2>
        </div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="border-2 border-dashed rounded-xl p-10 text-center transition-all duration-300 cursor-pointer hover:border-muted-foreground bg-card"
          onClick={() => setIsModalOpen(true)}
        >
          <Upload className="w-12 h-12 mx-auto mb-6 text-muted-foreground" />
          <p className="mb-3 text-lg text-card-foreground">
            Upload Image
          </p>
          <p className="text-sm text-muted-foreground">
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
