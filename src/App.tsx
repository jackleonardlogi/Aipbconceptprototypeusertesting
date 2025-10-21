import React, { useState } from 'react';
import { motion } from 'motion/react';
import RadialActionsMenu from './components/RadialActionsMenu';
import { Toaster } from 'sonner';

function App() {
  const [version, setVersion] = useState<1 | 2>(1);

  return (
    <div 
      className="min-h-screen bg-background text-foreground relative overflow-hidden"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1663400182865-c4e2c3e88129?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWMlMjBkZXNrdG9wJTIwd2FsbHBhcGVyJTIwbW91bnRhaW5zfGVufDF8fHx8MTc1ODk4OTk3Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Mac-style desktop overlay */}
      <div className="absolute inset-0 bg-black/10" />

      <RadialActionsMenu version={version} />
      <Toaster position="top-center" richColors />

      {/* Version Toggle Button */}
      <motion.button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setVersion(version === 1 ? 2 : 1);
        }}
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        data-version-button
        className="fixed bottom-6 left-6 z-[100]"
        style={{
          padding: '12px 16px',
          background: 'rgba(242, 242, 242, 0.88)',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--elevation-md)',
          color: 'var(--foreground)',
          fontFamily: 'Brown Logitech Pan',
          fontSize: '14px',
          fontWeight: '400',
          cursor: 'pointer'
        }}
        whileHover={{ 
          scale: 1.05,
          boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)'
        }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 25
        }}
      >
        Version {version}
      </motion.button>
    </div>
  );
}

export default App;