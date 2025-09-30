'use client';
import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface Props {
  image_urls: string[];
}

export const ProductImages = ({ image_urls }: Props) => {
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  return (
    <div>
      <Image
        src={image_urls[currentImageIdx]}
        alt="product image"
        width={1000}
        height={1000}
        className="min-h-[300px] object-cover object-center"
      />
      <div className="flex">
        {image_urls.map((image_url, i) => (
          <div
            key={image_url}
            onClick={() => setCurrentImageIdx(i)}
            className={cn(
              'border mr-2 cursor-pointer hover:border-orange-600',
              currentImageIdx === i && 'border-orange-500',
            )}
          >
            <Image src={image_url} alt="image" width={100} height={100} />
          </div>
        ))}
      </div>
    </div>
  );
};
