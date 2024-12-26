import React from 'react';
import Image from 'next/image';

function Loader() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="animate-pulse">
        <Image
          src="/images/logo/logo2.png"
          alt="Loading"
          width={100}
          height={100}
          priority
          className="rounded-full"
        />
        <h1>Loading..</h1>
      </div>
    </div>
  );
}

export default Loader;
