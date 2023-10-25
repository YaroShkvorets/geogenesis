import { SYSTEM_IDS } from '@geogenesis/ids';
import Image from 'next/legacy/image';

import { Suspense } from 'react';

import { Environment } from '~/core/environment';
import { Subgraph } from '~/core/io';
import { fetchProposalsByUser } from '~/core/io/fetch-proposals-by-user';
import { Action as IAction } from '~/core/types';
import { Action } from '~/core/utils/action';
import { GeoDate, formatShortAddress, getImagePath } from '~/core/utils/utils';
import { Value } from '~/core/utils/value';

import { Spacer } from '~/design-system/spacer';

import Loading from './loading';

export const runtime = 'edge';

interface Props {
  params: { id: string; entityId: string };
  searchParams: {
    spaceId?: string;
  };
}

export default async function ActivityPage({ searchParams, params }: Props) {
  return (
    // loading.tsx only runs on the server the first time you load the page. Subsequent loads
    // require a manually defined suspense boundary.
    // https://github.com/vercel/next.js/issues/43548
    <Suspense key={`?spaceId=${searchParams?.spaceId}`} fallback={<Loading />}>
      {/* @ts-expect-error async JSX */}
      <ActivityList params={params} searchParams={searchParams} />
    </Suspense>
  );
}

async function ActivityList({ params, searchParams }: Props) {
  const config = Environment.getConfig(process.env.NEXT_PUBLIC_APP_ENV);

  const [personEntity, spaces] = await Promise.all([
    Subgraph.fetchEntity({
      endpoint: config.subgraph,
      id: params.entityId,
    }),
    Subgraph.fetchSpaces({
      endpoint: config.subgraph,
    }),
  ]);

  const firstWalletsTriple = personEntity?.triples.find(t => t.attributeId === SYSTEM_IDS.WALLETS_ATTRIBUTE);

  // Right now wallets are associated with an Entity. The name of the Entity is the address associated with
  // the wallet. Eventually this will get replaced by a proper Profile system.
  const userId = Value.nameOfEntityValue(firstWalletsTriple);

  if (!userId) return <p className="text-body text-grey-04">There is no information here yet.</p>;

  const proposals = await fetchProposalsByUser({
    endpoint: config.subgraph,
    userId,
    spaceId: searchParams.spaceId,
    api: {
      fetchProfile: Subgraph.fetchProfile,
    },
  });

  const spaceNames = Object.fromEntries(spaces.map(space => [space.id, space.attributes[SYSTEM_IDS.NAME]]));

  return (
    <div className="divide-y divide-divider">
      {proposals.length === 0 ? (
        <>
          <Spacer height={20} />
          <p className="py-3 text-body text-grey-04">There is no information here yet.</p>
        </>
      ) : (
        proposals.map(p => {
          const space = spaces.find(s => s.id === p.space);
          const spaceImage = space?.attributes[SYSTEM_IDS.IMAGE_ATTRIBUTE] ?? '';

          const lastEditedDate = GeoDate.fromGeoTime(p.createdAt);
          const proposalChangeCount = Action.getChangeCount(
            p.proposedVersions.reduce<IAction[]>((acc, version) => acc.concat(version.actions), [])
          );

          const proposedEntitiesCount = p.proposedVersions.length;

          // e.g. Mar 12, 2023
          const formattedLastEditedDate = new Date(lastEditedDate).toLocaleDateString(undefined, {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          });

          const proposalName = p.name ? p.name : `${formatShortAddress(p.createdBy.id)} – ${formattedLastEditedDate}`;

          return (
            <div key={p.id} className="flex flex-col gap-2 py-3">
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="relative h-4 w-4 overflow-hidden rounded-sm">
                    <Image objectFit="cover" priority layout="fill" src={getImagePath(spaceImage)} />
                  </div>
                  <p className="text-metadataMedium">{proposalName}</p>
                </div>
                <p className="text-breadcrumb tabular-nums text-grey-04">{formattedLastEditedDate}</p>
              </div>

              <p className="pl-6 text-breadcrumb">
                {proposalChangeCount} edits on {proposedEntitiesCount} pages in {spaceNames[p.space]}
              </p>
            </div>
          );
        })
      )}
    </div>
  );
}