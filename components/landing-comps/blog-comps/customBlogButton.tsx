"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Home } from "lucide-react";
import { useRouter } from "next/navigation";

const BackToHomeButton = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Trigger mount animation
    setIsMounted(true);
  }, []);

  return (
    <div
      className={`fixed left-8 top-32 z-40 transition-all duration-700 ${
        isMounted ? "translate-x-0 opacity-100" : "-translate-x-20 opacity-0"
      }`}
    >
      <button
        onClick={() => router.push("/")}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group flex  justify-between gap-2 rounded-full bg-main-100 px-6 py-3 text-white shadow-lg transition-all duration-300 hover:bg-blue-500"
      >
        <div className="relative w-6">
          <ArrowLeft
            className={`absolute transition-all duration-300 ${
              isHovered
                ? "-translate-x-8 opacity-0"
                : "translate-x-0 opacity-100"
            }`}
            size={24}
          />
          <Home
            className={`absolute transition-all duration-300 ${
              isHovered
                ? "translate-x-0 opacity-100"
                : "translate-x-8 opacity-0"
            }`}
            size={24}
          />
        </div>
        <span className="font-medium">Back Home</span>
      </button>
    </div>
  );
};

export default BackToHomeButton;
