import React from 'react';
import Image from 'next/image';

function Loader() {
  return (
    <div className="flex justify-center mt-28 w-screen h-screen">
      {/* Parent logo */}
      <div className="relative w-[200px] h-[200px]">
        {/* Main logo */}
        <Image
          src="/images/logo/logo.png"
          alt="Logo"
          layout="fill"
          objectFit="contain"
          className="relative animate-pulse"
        />
        {/* Child logo */}
        <Image
          src="/images/logo/logo2.png"
          alt="Logo 2"
          width={50}
          height={50}
          className="absolute top-[45%] left-2 w-7"
        />
      </div>
    </div>
  );
}

export default Loader;
