import { SYSTEM_IDS } from '@geogenesis/ids';

import { options } from '~/core/environment/environment';
import { Subgraph } from '~/core/io';

import { GovernanceViewProposalContentHeader } from './governance-view-proposal-content-header';

interface Props {
  spaceId: string;
  proposalId: string;
}

export async function GovernanceViewProposalContent({ proposalId, spaceId }: Props) {
  // @TODO: get env from cookie
  const [space, proposal] = await Promise.all([
    Subgraph.fetchSpace({ id: spaceId, endpoint: options.production.subgraph }),
    Subgraph.fetchProposal({ id: proposalId, endpoint: options.production.subgraph }),
  ]);

  if (!proposal || !space) {
    return <p>Proposal does not exist</p>;
  }

  return (
    <div>
      <GovernanceViewProposalContentHeader
        spaceName={space.attributes[SYSTEM_IDS.NAME] ?? null}
        spaceImage={space.attributes[SYSTEM_IDS.IMAGE_ATTRIBUTE] ?? null}
      />
    </div>
  );
}
