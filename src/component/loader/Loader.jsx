import React from 'react';
import Image from 'next/image';

function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="relative w-32 h-32 flex items-center justify-center">
        <Image
          src="/images/logo/logo2.png"
          alt="Logo 2"
          width={500}
          height={500}
          className="absolute w-16 object-contain"
          priority={true}
          style={{
            animation: 'pulse-and-float 2s ease-in-out infinite'
          }}
        />
      </div>
      <style jsx global>{`
        @keyframes pulse-and-float {
          0%, 100% {
            transform: scale(0.95) translateY(0);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.05) translateY(-10px);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

export default Loader;

