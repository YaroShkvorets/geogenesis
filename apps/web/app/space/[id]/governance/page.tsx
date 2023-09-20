import { Effect, Either } from 'effect';
import { cookies } from 'next/headers';

import * as React from 'react';

import { graphql } from '~/core/io/subgraph/graphql';
import { Params } from '~/core/params';
import { ServerSideEnvParams } from '~/core/types';

import { SmallButton } from '~/design-system/button';

import { GovernanceProposalsList } from '~/partials/governance/governance-proposals-list';

import { SpaceLayout } from '../space-layout';

interface Props {
  params: { id: string };
  searchParams: ServerSideEnvParams;
}

export default async function GovernancePage({ params, searchParams }: Props) {
  const proposalsCount = await getProposalsCount({ params, searchParams });

  return (
    // @ts-expect-error async JSX function
    <SpaceLayout params={params} searchParams={searchParams}>
      <div className="space-y-4">
        <div className="flex items-center gap-5">
          <GovernanceMetadataBox>
            <h2 className="text-metadata text-grey-04">Voting period</h2>
            <p className="text-mediumTitle">24h</p>
          </GovernanceMetadataBox>
          <GovernanceMetadataBox>
            <h2 className="text-metadata text-grey-04">Pass threshold</h2>
            <p className="text-mediumTitle">51%</p>
          </GovernanceMetadataBox>
          <GovernanceMetadataBox>
            <h2 className="text-metadata text-grey-04">Active proposals</h2>
            <p className="text-mediumTitle">0</p>
          </GovernanceMetadataBox>
          <GovernanceMetadataBox>
            <h2 className="text-metadata text-grey-04">Accepted vs. rejected</h2>
            <div className="flex items-center gap-3 text-mediumTitle">
              <span>{proposalsCount}</span>
              <div className="h-4 w-px bg-grey-02" />
              <span>0</span>
            </div>
          </GovernanceMetadataBox>
        </div>

        <SmallButton variant="secondary" icon="chevronDownSmall">
          All Proposals
        </SmallButton>

        <React.Suspense fallback="Banana sandwich">
          {/* @ts-expect-error async JSX function */}
          <GovernanceProposalsList spaceId={params.id} />
        </React.Suspense>
      </div>
    </SpaceLayout>
  );
}

function GovernanceMetadataBox({ children }: { children: React.ReactNode }) {
  return <div className="flex w-full flex-col items-center gap-1 rounded border border-grey-02 py-3">{children}</div>;
}

interface NetworkResult {
  proposals: {
    id: string;
  }[];
}

async function getProposalsCount({ params, searchParams }: Props) {
  const env = cookies().get(Params.ENV_PARAM_NAME)?.value;
  const config = Params.getConfigFromParams(searchParams, env);

  const graphqlFetchEffect = graphql<NetworkResult>({
    endpoint: config.subgraph,
    query: `
      query {
        proposals(where: { space: "${params.id}" } first: 1000) {
          id
        }
      }`,
  });

  const graphqlFetchWithErrorFallbacks = Effect.gen(function* (awaited) {
    const resultOrError = yield* awaited(Effect.either(graphqlFetchEffect));

    if (Either.isLeft(resultOrError)) {
      const error = resultOrError.left;

      switch (error._tag) {
        case 'AbortError':
          // Right now we re-throw AbortErrors and let the callers handle it. Eventually we want
          // the caller to consume the error channel as an effect. We throw here the typical JS
          // way so we don't infect more of the codebase with the effect runtime.
          throw error;
        case 'GraphqlRuntimeError':
          console.error(`Encountered runtime graphql error in governance/page. spaceId: ${params.id}`, error.message);
          return {
            proposals: [],
          };
        default:
          console.error(`${error._tag}: Unable to fetch proposals count, spaceId: ${params.id}`);
          return {
            proposals: [],
          };
      }
    }

    return resultOrError.right;
  });

  const result = await Effect.runPromise(graphqlFetchWithErrorFallbacks);

  return result.proposals.length;
}