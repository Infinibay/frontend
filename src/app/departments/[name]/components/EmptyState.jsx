'use client'

import React from "react";
import { LottieAnimation } from '@/components/ui/lottie-animation';
import { getGlassClasses } from '@/utils/glass-effects';

/**
 * Empty state component for when no machines are found
 */
const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <LottieAnimation
        animationPath="/lottie/not-found.json"
        className="w-64 h-64 opacity-80 mb-4"
        loop={true}
        autoplay={true}
      />
      <div className={`text-center p-6 ${getGlassClasses({ glass: 'minimal', elevation: 2, radius: 'lg' })}`}>
        <h2 className="text-xl font-semibold mb-2 text-glass-text-primary">No computers found</h2>
        <p className="text-glass-text-secondary">
          There are no computers in this department yet.
        </p>
      </div>
    </div>
  );
};

export default EmptyState;
