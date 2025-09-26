import { useState, useEffect } from "react";

const AuthImagePattern = ({ title, subtitle }) => {
  const [animatedSquares, setAnimatedSquares] = useState(new Set());

  // Create staggered animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedSquares(prev => {
        const newSet = new Set();
        // Randomly animate 3-5 squares
        const numAnimated = Math.floor(Math.random() * 3) + 3;
        const indices = [];
        
        while (indices.length < numAnimated) {
          const randomIndex = Math.floor(Math.random() * 9);
          if (!indices.includes(randomIndex)) {
            indices.push(randomIndex);
          }
        }
        
        indices.forEach(index => newSet.add(index));
        return newSet;
      });
    }, 2000); // Change animation every 2 seconds

    return () => clearInterval(interval);
  }, []);

  // Enhanced gradient patterns for variety
  const getSquareStyle = (index) => {
    const patterns = [
      'bg-gradient-to-br from-primary/20 to-primary/5',
      'bg-gradient-to-tr from-secondary/20 to-secondary/5', 
      'bg-gradient-to-bl from-accent/20 to-accent/5',
      'bg-gradient-to-tl from-info/20 to-info/5',
      'bg-gradient-to-br from-success/20 to-success/5',
      'bg-gradient-to-tr from-warning/20 to-warning/5',
      'bg-gradient-to-bl from-error/20 to-error/5',
      'bg-gradient-to-tl from-primary/15 to-secondary/10',
      'bg-gradient-to-br from-accent/15 to-primary/10'
    ];
    
    return patterns[index];
  };

  // Different animation styles for variety
  const getAnimationClass = (index) => {
    const animations = [
      'animate-pulse',
      'animate-bounce',
      'animate-pulse',
      'animate-ping',
      'animate-pulse',
      'animate-bounce', 
      'animate-pulse',
      'animate-ping',
      'animate-pulse'
    ];
    
    return animatedSquares.has(index) ? animations[index] : '';
  };

  return (
    <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-base-200 to-base-300 p-12 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-secondary rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-accent rounded-full blur-2xl"></div>
      </div>
      
      <div className="max-w-md text-center relative z-10">
        {/* Enhanced grid pattern */}
        <div className="relative mb-8">
          <div className="grid grid-cols-3 gap-4">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className={`
                  aspect-square rounded-3xl transition-all duration-700 ease-in-out
                  hover:scale-110 hover:rotate-6 cursor-pointer
                  ${getSquareStyle(i)}
                  ${getAnimationClass(i)}
                  shadow-lg hover:shadow-xl
                  border border-white/10
                  backdrop-blur-sm
                `}
                style={{
                  animationDelay: `${i * 200}ms`,
                  transform: animatedSquares.has(i) 
                    ? `scale(1.05) rotate(${(i % 2) * 5 - 2.5}deg)` 
                    : 'scale(1) rotate(0deg)'
                }}
              >
                {/* Inner glow effect */}
                <div className="w-full h-full rounded-3xl bg-white/5 backdrop-blur-sm"></div>
              </div>
            ))}
          </div>
          
          {/* Floating connection lines */}
          <div className="absolute inset-0 pointer-events-none">
            <svg className="w-full h-full opacity-20" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="currentColor" stopOpacity="0.1"/>
                  <stop offset="50%" stopColor="currentColor" stopOpacity="0.3"/>
                  <stop offset="100%" stopColor="currentColor" stopOpacity="0.1"/>
                </linearGradient>
              </defs>
              
              {/* Connecting lines between squares */}
              <path 
                d="M 16 16 Q 33 25 50 16 T 84 16" 
                stroke="url(#lineGradient)" 
                strokeWidth="0.5" 
                fill="none"
                className="animate-pulse"
              />
              <path 
                d="M 16 50 Q 33 41 50 50 T 84 50" 
                stroke="url(#lineGradient)" 
                strokeWidth="0.5" 
                fill="none"
                className="animate-pulse"
                style={{ animationDelay: '1s' }}
              />
              <path 
                d="M 16 84 Q 33 75 50 84 T 84 84" 
                stroke="url(#lineGradient)" 
                strokeWidth="0.5" 
                fill="none"
                className="animate-pulse"
                style={{ animationDelay: '2s' }}
              />
            </svg>
          </div>
        </div>

        {/* Enhanced text content */}
        <div className="space-y-4">
          <div className="relative">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-base-content to-base-content/80 bg-clip-text text-transparent mb-4 leading-tight">
              {title}
            </h2>
            {/* Subtle underline decoration */}
            <div className="w-12 h-1 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto opacity-60"></div>
          </div>
          
          <p className="text-base-content/70 leading-relaxed max-w-sm mx-auto text-lg font-medium">
            {subtitle}
          </p>

          {/* Additional decorative elements */}
          <div className="flex justify-center gap-2 mt-6 opacity-40">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
            <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>

        {/* Floating particles effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-primary/30 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Custom CSS for floating animation */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) translateX(0px) rotate(0deg);
            opacity: 0;
          }
          25% { 
            transform: translateY(-20px) translateX(10px) rotate(90deg);
            opacity: 1;
          }
          50% { 
            transform: translateY(-40px) translateX(-5px) rotate(180deg);
            opacity: 0.7;
          }
          75% { 
            transform: translateY(-20px) translateX(15px) rotate(270deg);
            opacity: 1;
          }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default AuthImagePattern;