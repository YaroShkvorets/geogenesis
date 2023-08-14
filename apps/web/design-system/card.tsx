'use client';

import Image from 'next/legacy/image';
import Link from 'next/link';

import * as React from 'react';
import { useState } from 'react';

import { NavUtils, getImagePath } from '~/core/utils/utils';

import { Text } from '~/design-system/text';

import { RightArrowDiagonal } from './icons/right-arrow-diagonal';

interface Props {
  spaceId: string;
  name?: string;
  image?: string;
}

export function Card({ spaceId, name = spaceId, image = 'https://via.placeholder.com/600x600/FF00FF/FFFFFF' }: Props) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={NavUtils.toSpace(spaceId)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group animate-fade-in cursor-pointer overflow-hidden rounded border border-grey-02 shadow-button transition-shadow duration-150 ease-in-out hover:shadow-card"
    >
      <div className="flex items-center justify-between bg-white p-4">
        <Text variant="smallTitle">{name}</Text>
        <RightArrowDiagonal color={hovered ? 'text' : 'grey-04'} />
      </div>
      {image && (
        <div className="relative aspect-video w-full object-cover transition-all duration-150 ease-in-out">
          <Image
            src={getImagePath(image)}
            alt={`Cover image for ${name}`}
            className="transition-all duration-150 ease-in-out group-hover:scale-105"
            objectFit="cover"
            priority
            layout="fill"
          />
        </div>
      )}
    </Link>
  );
}