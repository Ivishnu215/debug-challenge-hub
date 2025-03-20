
import React, { useEffect, useState } from 'react';
import { Bug } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BugAnimationProps {
  count?: number;
  className?: string;
}

const BugAnimation: React.FC<BugAnimationProps> = ({ 
  count = 6,
  className 
}) => {
  const [bugs, setBugs] = useState<{ id: number; x: number; y: number; size: number; delay: number }[]>([]);

  useEffect(() => {
    // Create random bugs
    const newBugs = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 0.5 + 0.5, // Size between 0.5 and 1
      delay: Math.random() * 4, // Random animation delay
    }));
    
    setBugs(newBugs);
  }, [count]);

  return (
    <div className={cn("fixed inset-0 pointer-events-none z-0 overflow-hidden", className)}>
      {bugs.map((bug) => (
        <div
          key={bug.id}
          className="absolute animate-bug-run"
          style={{
            left: `${bug.x}%`,
            top: `${bug.y}%`,
            opacity: 0.1,
            transform: 'scale(1)',
            animationDelay: `${bug.delay}s`,
          }}
        >
          <Bug 
            size={24 * bug.size} 
            className="text-primary transition-transform" 
          />
        </div>
      ))}
    </div>
  );
};

export default BugAnimation;
