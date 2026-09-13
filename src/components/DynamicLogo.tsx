'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

interface LogoProps {
  className?: string;
  withText?: boolean;
  withBackground?: boolean;
  forceVersion?: 'original' | 'jo';
  width?: number;
  height?: number;
  fill?: boolean;
  alt?: string;
  sizes?: string;
  priority?: boolean;
}

export default function DynamicLogo({
  className = '',
  withText = true,
  withBackground = false,
  forceVersion,
  width,
  height,
  fill,
  alt = 'مركز القدومي الثقافي',
  sizes,
  priority = false,
}: LogoProps) {
  // Use a stable initial state to prevent hydration mismatch, 
  // then update it in useEffect.
  const [version, setVersion] = useState<'original' | 'jo'>('original');

  useEffect(() => {
    if (forceVersion) {
      setVersion(forceVersion);
      return;
    }
    
    // Cycle every 2 days
    // Math.floor(timestamp_in_days / 2) % 2
    const epochDays = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
    const cycle = Math.floor(epochDays / 2) % 2;
    setVersion(cycle === 0 ? 'original' : 'jo');
  }, [forceVersion]);

  // Determine the correct image path
  let imagePath = '';
  
  if (!withText) {
    imagePath = version === 'jo' 
      ? '/images/logos/logo-jo-notext-white.jpg' 
      : '/images/logos/logo-original-notext-white.jpg';
  } else {
    if (withBackground) {
      imagePath = version === 'jo'
        ? '/images/logos/logo-jo-text-white.jpg'
        : '/images/logos/logo-original-text-white.jpg';
    } else {
      imagePath = version === 'jo'
        ? '/images/logos/logo-jo-text-transparent.png'
        : '/images/logos/logo-original-text-transparent.png';
    }
  }

  return (
    <Image
      src={imagePath}
      alt={alt}
      width={width}
      height={height}
      fill={fill}
      className={className}
      sizes={sizes}
      priority={priority}
    />
  );
}
