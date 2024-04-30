import type { ContentProposal } from '../proposals-created/parser';
import type { SpacePluginCreated } from '../spaces-created/parser';
import { getChecksumAddress } from '~/sink/utils/get-checksum-address';

/**
 * If we have a set of "SpacePluginCreated" events in the same block as a set of "ProposalProcessed" events
 * we need to check if any of the processed proposals are because an initial content IPFS URI was passed
 * during space creation.
 *
 * If there are processed proposals as a result of an initial content uri, we need to create the appropriate
 * proposals, proposed versions, actions, etc. before we actually set the proposal as "ACCEPTED"
 */
export function getInitialProposalsForSpaces(spacesCreated: SpacePluginCreated[], proposals: ContentProposal[]) {
  const spaceAddresses = new Set(spacesCreated.map(s => getChecksumAddress(s.daoAddress)));
  return proposals.filter(p => spaceAddresses.has(getChecksumAddress(p.space)));
}
