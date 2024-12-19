import React from "react";
import Link from "next/link";

const ProfileArea = () => {
  return (
    <div className="flex items-center gap-4">
      <img
        src="/profile-placeholder.png"
        alt="Profile Icon"
        className="w-8 h-8 rounded-full"
      />
      <div>
        <Link href="/auth/dashboard">
          <p className="text-blue-500 hover:underline">My Dashboard</p>
        </Link>
      </div>
    </div>
  );
};

export default ProfileArea;
