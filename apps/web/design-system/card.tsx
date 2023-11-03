import Image from 'next/legacy/image';
import Link from 'next/link';

import * as React from 'react';

import { NavUtils, getImagePath } from '~/core/utils/utils';

import { Text } from '~/design-system/text';

interface Props {
  spaceId: string;
  name?: string;
  image?: string;
}

export function Card({ spaceId, name = spaceId, image = 'https://via.placeholder.com/600x600/FF00FF/FFFFFF' }: Props) {
  return (
    <Link href={NavUtils.toSpace(spaceId)} className="group animate-fade-in cursor-pointer overflow-hidden rounded-lg">
      <div className="relative aspect-video w-full overflow-hidden rounded-lg object-cover transition-all duration-150 ease-in-out">
        <Image
          src={getImagePath(image)}
          alt={`Cover image for ${name}`}
          className="transition-transform duration-150 ease-in-out group-hover:scale-105"
          objectFit="cover"
          priority
          layout="fill"
        />
      </div>
      <div className="py-3">
        <Text variant="smallTitle">{name}</Text>
      </div>
    </Link>
  );
}
