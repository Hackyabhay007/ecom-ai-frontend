import React from 'react';
import Image from 'next/image';

function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80">
      <div className="relative w-32 h-32 flex items-center justify-center">
        {/* <Image
          src="/images/logo/logo.png"
          alt="Logo"
          width={500}
          height={500}
          className="absolute w-32 opacity-80 animate-[fade_1.5s_ease-in-out_infinite]"
          style={{
            animation: 'fade 1.5s ease-in-out infinite'
          }}
        /> */}
        <Image
          src="/images/logo/logo2.png"
          alt="Logo 2"
          width={500}
          height={500}
          className="absolute w-16 mix-blend-multiply animate-[scale_1.5s_ease-in-out_infinite]"
          style={{
            animation: 'scale 1.5s ease-in-out infinite'
          }}
        />
      </div>
      <style jsx global>{`
        @keyframes fade {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        @keyframes scale {
          0%, 100% { transform: scale(0.8); }
          50% { transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}

export default Loader;
