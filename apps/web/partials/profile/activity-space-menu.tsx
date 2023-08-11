'use client';

import { SYSTEM_IDS } from '@geogenesis/ids';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import * as React from 'react';

import { useSpaces } from '~/core/hooks/use-spaces';
import { NavUtils } from '~/core/utils/utils';

import { SmallButton } from '~/design-system/button';
import { Menu } from '~/design-system/menu';

interface Props {
  spaceId: string;
  entityId: string;
}

export function ActivitySpaceMenu({ entityId, spaceId }: Props) {
  const { spaces } = useSpaces();

  const initialSpace = spaces.find(space => space.id === spaceId);
  console.log('initialSpace', { initialSpace, spaceId });

  const router = useRouter();
  const [open, onOpenChange] = React.useState(false);
  const [name, setName] = React.useState(initialSpace?.attributes[SYSTEM_IDS.NAME] ?? 'All');

  const spacesWithAll = [
    {
      id: 'all',
      attributes: {
        name: 'All',
      },
    },
    ...spaces,
  ];

  const onSelect = (spaceIdToFilter: string) => {
    onOpenChange(false);
    setName(spacesWithAll.find(space => space.id === spaceIdToFilter)?.attributes[SYSTEM_IDS.NAME] ?? 'All');
    router.push(
      NavUtils.toProfileActivity(spaceIdToFilter, entityId, spaceIdToFilter === 'all' ? undefined : spaceIdToFilter)
    );
  };

  return (
    <Menu
      open={open}
      onOpenChange={onOpenChange}
      trigger={
        <SmallButton variant="secondary" icon="chevronDownSmall">
          {name}
        </SmallButton>
      }
      className="flex flex-col gap-2 max-h-[300px] overflow-y-auto bg-white"
    >
      {spacesWithAll.map(space => (
        <button onClick={() => onSelect(space.id)} key={space.id}>
          {space.attributes[SYSTEM_IDS.NAME]}
        </button>
      ))}
    </Menu>
  );
}
