import { Avatar } from '~/design-system/avatar';
import { Text } from '~/design-system/text';

import { VoteProposal } from './types';

/*
Going to mock the data for this, but will change when we have the backend in place
Proposal type:  id: string;
  name: string | null;
  description: string | null;
  createdBy: Profile;
  createdAt: number;
  createdAtBlock: string;
  proposedVersions: ProposedVersion[]; 
props:
  name: string | null;
  description: string | null;
  createdBy: Profile;  
  status: 'pending' | 'approved' | 'rejected' | 'canceled'
    - can extend Proposal type with status
  time: will need a time/timeRemaining for rendering a timer
  votes: depends on how we'll track votes
    - each vote likely object with person id, proposal id, vote type
    - votesYes
    - votesNo
*/

export function PersonalHomeProposalCard({ name, description, createdBy, createdAt, status, time }: VoteProposal) {
  return (
    <div className="flex flex-col border border-grey-02 rounded-[12px] grey-02 p-4 shadow-light">
      <Text variant="smallTitle">Proposal Title</Text>
      <div className="flex flex-row items-center gap-4 mt-2">
        <div className="relative rounded-sm overflow-hidden">
          <Avatar size={12} />
        </div>
        <Text variant="breadcrumb">Jonathan Prozzi</Text>
      </div>
      <div className="flex flex-row  justify-between w-full ">
        <div />
        <div className="flex flex-row items-center gap-2">
          <div className="w-3 h-3 bg-purple rounded-sm" />
          <Text variant="breadcrumb" color="grey-04">
            Space Name
          </Text>
        </div>
      </div>
    </div>
  );
}
