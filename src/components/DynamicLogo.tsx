'use client';
import Image from 'next/image';

interface DynamicLogoProps {
  className?: string;
  withText?: boolean;
  withBackground?: boolean;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
}

export default function DynamicLogo({
  className = '',
  withText = true,
  withBackground = false,
  width,
  height,
  fill = false,
  priority = false,
}: DynamicLogoProps) {
  const src = '/images/logos/logo-original-notext-white-removebg-preview.png';

  if (fill) {
    return (
      <Image
        src={src}
        alt="شعار مركز القدومي الثقافي"
        fill
        className={className}
        priority={priority}
        sizes="(max-width: 768px) 100px, 200px"
      />
    );
  }

  return (
    <Image
      src={src}
      alt="شعار مركز القدومي الثقافي"
      width={width || 120}
      height={height || 120}
      className={className}
      priority={priority}
    />
  );
}
