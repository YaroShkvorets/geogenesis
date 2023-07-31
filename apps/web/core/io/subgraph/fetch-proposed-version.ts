import { Effect, Either } from 'effect';
import { v4 as uuid } from 'uuid';

import { ProposedVersion } from '~/core/types';

import { fetchProfile } from './fetch-profile';
import { graphql } from './graphql';
import { NetworkProposedVersion } from './network-local-mapping';

export const getProposedVersionQuery = (id: string) => `query {
  proposedVersion(id: ${JSON.stringify(id)}) {
    id
    name
    createdAt
    createdAtBlock
    createdBy {
      id
    }
    actions {
      actionType
      id
      attribute {
        id
        name
      }
      entity {
        id
        name
      }
      entityValue {
        id
        name
      }
      numberValue
      stringValue
      valueType
      valueId
    }
    entity {
      id
      name
    }
  }
}`;

export interface FetchProposedVersionOptions {
  endpoint: string;
  id: string;
  abortController?: AbortController;
}

interface NetworkResult {
  proposedVersion: NetworkProposedVersion | null;
}

export async function fetchProposedVersion({
  endpoint,
  id,
  abortController,
}: FetchProposedVersionOptions): Promise<ProposedVersion | null> {
  const queryId = uuid();

  const graphqlFetchEffect = graphql<NetworkResult>({
    endpoint: endpoint,
    query: getProposedVersionQuery(id),
    abortController: abortController,
  });

  const graphqlFetchWithErrorFallbacks = Effect.gen(function* (awaited) {
    const resultOrError = yield* awaited(Effect.either(graphqlFetchEffect));

    if (Either.isLeft(resultOrError)) {
      const error = resultOrError.left;

      switch (error._tag) {
        case 'GraphqlRuntimeError':
          console.error(
            `Encountered runtime graphql error in proposedVersion. queryId: ${queryId} id: ${id} endpoint: ${endpoint}
            
            queryString: ${getProposedVersionQuery(id)}
            `,
            error.message
          );

          return {
            proposedVersion: null,
          };
        default:
          console.error(
            `${error._tag}: Unable to fetch proposedVersion. queryId: ${queryId} id: ${id} endpoint: ${endpoint}`
          );

          return {
            proposedVersion: null,
          };
      }
    }

    return resultOrError.right;
  });

  const result = await Effect.runPromise(graphqlFetchWithErrorFallbacks);
  const proposedVersion = result.proposedVersion;

  if (!proposedVersion) {
    return null;
  }

  const maybeProfile = await fetchProfile({ address: proposedVersion.createdBy.id, endpoint });

  return {
    ...proposedVersion,
    createdBy: maybeProfile !== null ? maybeProfile[1] : proposedVersion.createdBy,
  };
}
