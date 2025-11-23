import React from "react";

const Skeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="h-4 bg-gray-300 rounded mb-4"></div>
      <div className="h-4 bg-gray-300 rounded mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-5/6"></div>
    </div>
  );
};

const PostCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
      <div className="h-6 bg-gray-300 rounded mb-4 w-3/4"></div>
      <div className="h-4 bg-gray-300 rounded mb-2"></div>
      <div className="h-4 bg-gray-300 rounded mb-4 w-5/6"></div>
      <div className="flex gap-4">
        <div className="h-10 bg-gray-300 rounded w-1/4"></div>
        <div className="h-10 bg-gray-300 rounded w-1/4"></div>
      </div>
    </div>
  );
};

const ProfileSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-8 animate-pulse">
      <div className="flex items-center gap-6 mb-8">
        <div className="w-24 h-24 bg-gray-300 rounded-full"></div>
        <div className="flex-1">
          <div className="h-8 bg-gray-300 rounded mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i}>
            <div className="h-8 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export { Skeleton, PostCardSkeleton, ProfileSkeleton };
