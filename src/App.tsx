
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import { useTheme } from './hooks/use-theme';

function App() {
  const { isDark } = useTheme();

  return (
    <div className={isDark ? 'dark' : ''}>
      <Toaster
        theme={isDark ? 'dark' : 'light'}
        toastOptions={{
          classNames: {
            success: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100',
          }
        }}
      />
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
