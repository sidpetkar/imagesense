
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, File } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UploadModalProps {
  onClose: () => void;
}

const UploadModal = ({ onClose }: UploadModalProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(prevFiles => [...prevFiles, ...droppedFiles]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(prevFiles => [...prevFiles, ...selectedFiles]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-[#1A1F2C]/40 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-xl mx-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-[#1A1F2C]">Upload Documents</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full hover:bg-[#F1F0FB]"
          >
            <X className="w-5 h-5 text-[#8E9196]" />
          </Button>
        </div>

        <motion.div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
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
            multiple
          />
          
          <Upload className="w-10 h-10 mx-auto mb-4 text-[#9b87f5]" />
          <p className="text-[#1A1F2C] mb-2">
            Drag and drop your documents here, or{' '}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-[#9b87f5] underline underline-offset-4 hover:text-[#7E69AB]"
            >
              browse
            </button>
          </p>
          <p className="text-sm text-[#8E9196]">Supported formats: PDF, DOC, DOCX</p>
        </motion.div>

        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 space-y-2"
          >
            {files.map((file, index) => (
              <motion.div
                key={`${file.name}-${index}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 p-3 bg-[#F1F0FB] rounded-lg"
              >
                <File className="w-5 h-5 text-[#9b87f5]" />
                <span className="text-sm text-[#1A1F2C] truncate">{file.name}</span>
                <span className="text-xs text-[#8E9196] ml-auto">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </motion.div>
            ))}
          </motion.div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="px-4 py-2 text-[#8E9196] hover:text-[#1A1F2C] border-[#E5DEFF] hover:bg-[#F1F0FB]"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              // Handle upload logic here
              console.log('Uploading files:', files);
            }}
            className="px-4 py-2 bg-[#9b87f5] text-white hover:bg-[#7E69AB]"
            disabled={files.length === 0}
          >
            Upload {files.length > 0 && `(${files.length})`}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default UploadModal;
