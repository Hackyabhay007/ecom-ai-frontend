import React from 'react';
import Image from 'next/image';

function Loader() {
  return (
    <div className="flex justify-center md:mt-28 py-40 md:py-0 w-full h-screen">
      {/* Parent logo */}
       <div className="flex justify-center items-center relative w-28 h-10">
           {/* First logo with fade animation */}
           <Image
             src="/images/logo/logo.png"
             alt="Logo"
             width={500}
             height={500}
             className="absolute w-28 animate-fade1"
           />
           {/* Second logo with delayed fade animation */}
           <Image
             src="/images/logo/logo2.png"
             alt="Logo 2"
             width={500}
             height={500}
             className="absolute w-6 animate-fade2"
           />
         </div>
    </div>
  );
}

export default Loader;
