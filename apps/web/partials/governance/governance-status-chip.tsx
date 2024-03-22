import { ProposalStatus } from '@geogenesis/sdk';

import { Vote } from '~/core/types';
import { GeoDate } from '~/core/utils/utils';

import { Avatar } from '~/design-system/avatar';

import { CheckSuccess } from './check-success';

interface Props {
  status: ProposalStatus;
  endTime: number; // UNIX timestamp
}

export function GovernanceStatusChip({ status, endTime }: Props) {
  switch (status) {
    case 'ACCEPTED': {
      return (
        <div className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-metadataMedium text-green">
          {/* Optically align the icon */}
          <div className="mt-[0.75px]">
            <CheckSuccess />
          </div>
          Accepted
        </div>
      );
    }
    case 'PROPOSED': {
      const timeRemaining = Math.floor(endTime - Date.now() / 1000);
      const isAwaitingExecution = timeRemaining <= 0;

      return (
        <div className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-metadataMedium">
          {isAwaitingExecution ? 'Pending execution' : `${timeRemaining} seconds remaining`}
        </div>
      );
    }
    default:
      throw new Error(`${status} proposal status not implemented yet`);
  }
}
