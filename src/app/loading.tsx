import React from "react";

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-xl font-semibold text-gray-700">Loading...</p>
        <p className="mt-2 text-sm text-gray-500">
          Please wait while we set things up for you.
        </p>
      </div>
    </div>
  );
}
