import { SYSTEM_IDS } from '@geogenesis/ids';
import { ROLE_ATTRIBUTE } from '@geogenesis/ids/system-ids';
import { redirect } from 'next/navigation';

import * as React from 'react';

import { Subgraph } from '~/core/io';
import { EditorProvider } from '~/core/state/editor-store';
import { EntityStoreProvider } from '~/core/state/entity-page-store/entity-store-provider';
import { TypesStoreServerContainer } from '~/core/state/types-store/types-store-server-container';
import { Entity } from '~/core/utils/entity';
import { NavUtils } from '~/core/utils/utils';
import { Value } from '~/core/utils/value';

import { Skeleton } from '~/design-system/skeleton';
import { Spacer } from '~/design-system/spacer';
import { TabGroup } from '~/design-system/tab-group';

import { EditableHeading } from '~/partials/entity-page/editable-entity-header';
import { EntityPageContentContainer } from '~/partials/entity-page/entity-page-content-container';
import { EntityPageCover } from '~/partials/entity-page/entity-page-cover';
import { SpaceEditors } from '~/partials/space-page/space-editors';
import { SpaceMembers } from '~/partials/space-page/space-members';
import { SpacePageMetadataHeader } from '~/partials/space-page/space-metadata-header';

import { cachedFetchSpace } from './cached-fetch-space';

interface Props {
  params: { id: string };
  children: React.ReactNode;
}

interface EntityType {
  id: string;
  name: string | null;
}

interface TabProps {
  label: string;
  href: string;
  priority: 1 | 2 | 3;
}

async function buildTabsForSpacePage(types: EntityType[], params: Props['params']): Promise<TabProps[]> {
  const typeIds = types.map(t => t.id);
  const tabs = [];

  let teamCount = 0;

  if (typeIds.includes(SYSTEM_IDS.COMPANY_TYPE) || typeIds.includes(SYSTEM_IDS.NONPROFIT_TYPE)) {
    const roleTriples = await Subgraph.fetchTriples({
      space: params.id,
      query: '',
      skip: 0,
      first: 1000,
      filter: [{ field: 'attribute-id', value: ROLE_ATTRIBUTE }],
    });

    if (roleTriples.length > 0) {
      teamCount = roleTriples.length;
    }
  }

  const COMPANY_TABS = [
    {
      label: 'Overview',
      href: `${NavUtils.toSpace(params.id)}`,
      priority: 1 as const,
    },
    {
      label: 'Team',
      href: `${NavUtils.toSpace(params.id)}/team`,
      priority: 1 as const,
      badge: <>{teamCount.toString()}</>,
    },
    {
      label: 'Activity',
      href: `${NavUtils.toSpace(params.id)}/activity`,
      priority: 3 as const,
    },
  ];

  const NONPROFIT_TABS = [
    {
      label: 'Overview',
      href: `${NavUtils.toSpace(params.id)}`,
      priority: 1 as const,
    },
    {
      label: 'Projects',
      href: `${NavUtils.toSpace(params.id)}/projects`,
      priority: 1 as const,
    },
    {
      label: 'Posts',
      href: `${NavUtils.toSpace(params.id)}/posts`,
      priority: 1 as const,
    },
    {
      label: 'Team',
      href: `${NavUtils.toSpace(params.id)}/team`,
      priority: 1 as const,
      badge: <>{teamCount.toString()}</>,
    },
    {
      label: 'Finances',
      href: `${NavUtils.toSpace(params.id)}/finances`,
      priority: 1 as const,
    },
  ];

  const PERSON_TABS = [
    {
      label: 'Overview',
      href: `${NavUtils.toSpace(params.id)}`,
      priority: 1 as const,
    },
    {
      label: 'Activity',
      href: `${NavUtils.toSpace(params.id)}/activity`,
      priority: 3 as const,
    },
  ];

  const SPACE_TABS = [
    {
      label: 'Overview',
      href: `${NavUtils.toSpace(params.id)}`,
      priority: 3 as const,
    },
    {
      label: 'Governance',
      href: `${NavUtils.toSpace(params.id)}/governance`,
      priority: 2 as const,
    },
  ];

  // Order of how we add the tabs matters. We want to
  // show "content-based" tabs first, then "space-based" tabs.
  if (typeIds.includes(SYSTEM_IDS.COMPANY_TYPE)) {
    tabs.push(...COMPANY_TABS);
  }

  if (typeIds.includes(SYSTEM_IDS.NONPROFIT_TYPE)) {
    tabs.push(...NONPROFIT_TABS);
  }

  if (typeIds.includes(SYSTEM_IDS.PERSON_TYPE)) {
    tabs.push(...PERSON_TABS);
  }

  if (typeIds.includes(SYSTEM_IDS.SPACE_CONFIGURATION)) {
    tabs.push(...SPACE_TABS);
  }

  const seen = new Map<string, TabProps>();

  for (const tab of tabs) {
    if (!seen.has(tab.label)) {
      seen.set(tab.label, tab);
    }
  }

  return [...seen.values()].sort((a, b) => a.priority - b.priority);
}

export default async function Layout({ children, params }: Props) {
  const props = await getData(params.id);
  const coverUrl = Entity.cover(props.triples);

  const typeNames = props.space?.spaceConfig?.types?.flatMap(t => (t.name ? [t.name] : [])) ?? [];
  const tabs = await buildTabsForSpacePage(props.space?.spaceConfig?.types ?? [], params);

  return (
    <TypesStoreServerContainer spaceId={params.id}>
      <EntityStoreProvider id={props.id} spaceId={props.spaceId} initialTriples={props.triples}>
        <EditorProvider
          id={props.id}
          spaceId={props.spaceId}
          initialBlockIdsTriple={props.blockIdsTriple}
          initialBlockTriples={props.blockTriples}
        >
          <EntityPageCover avatarUrl={null} coverUrl={coverUrl} />
          <EntityPageContentContainer>
            <EditableHeading spaceId={props.spaceId} entityId={props.id} name={props.name} triples={props.triples} />
            <SpacePageMetadataHeader
              typeNames={typeNames}
              spaceId={props.spaceId}
              entityId={props.id}
              membersComponent={
                <React.Suspense fallback={<MembersSkeleton />}>
                  <SpaceEditors spaceId={params.id} />
                  <SpaceMembers spaceId={params.id} />
                </React.Suspense>
              }
            />
            <Spacer height={40} />
            <TabGroup tabs={tabs} />
            <Spacer height={20} />
            {children}
          </EntityPageContentContainer>
        </EditorProvider>
      </EntityStoreProvider>
    </TypesStoreServerContainer>
  );
}

function MembersSkeleton() {
  return (
    <div className="flex items-center gap-2">
      <Skeleton className="h-6 w-24" />
      <Skeleton className="h-6 w-36" />
    </div>
  );
}

const getData = async (spaceId: string) => {
  // @TODO: If there's no space we should 404
  const space = await cachedFetchSpace(spaceId);
  const entity = space?.spaceConfig;

  if (!entity) {
    console.log(`Redirecting to /space/${spaceId}/entities`);
    redirect(`/space/${spaceId}/entities`);
  }

  const spaceName = space?.spaceConfig?.name ? space.spaceConfig?.name : space?.id ?? '';

  const blockIdsTriple = entity?.triples.find(t => t.attributeId === SYSTEM_IDS.BLOCKS) || null;
  const blockIds: string[] = blockIdsTriple ? JSON.parse(Value.stringValue(blockIdsTriple) || '[]') : [];

  const blockTriples = (
    await Promise.all(
      blockIds.map(blockId => {
        return Subgraph.fetchEntity({ id: blockId });
      })
    )
  ).flatMap(entity => entity?.triples ?? []);

  return {
    triples: entity?.triples ?? [],
    id: entity.id,
    name: entity?.name ?? spaceName ?? '',
    description: Entity.description(entity?.triples ?? []),
    spaceId,

    // For entity page editor
    blockIdsTriple,
    blockTriples,

    space,
  };
};
