import Image from 'next/legacy/image';

import * as React from 'react';

import { getImagePath } from '~/core/utils/utils';

import { Spacer } from './spacer';
import { Text } from './text';

interface BreadcrumbProps {
  children: string;
  img: string | null;
}

export function Breadcrumb({ children, img }: BreadcrumbProps) {
  return (
    <span className="flex cursor-pointer items-center whitespace-nowrap py-px no-underline">
      {img && (
        <>
          <div className="relative h-3 w-3 overflow-hidden rounded-sm">
            <Image
              priority
              layout="fill"
              objectFit="cover"
              src={getImagePath(img)}
              alt="Image representing the current Space"
            />
          </div>
          <Spacer width={4} />
        </>
      )}
      <Text variant="tag" color={'text'}>
        {children}
      </Text>
    </span>
  );
}
