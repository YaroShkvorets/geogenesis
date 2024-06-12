'use client';

import * as React from 'react';

import { useRequestToBeMember } from './use-request-to-be-member';

interface Props {
  spaceId: string;
  memberAccessPluginAddress: string | null;
}

export function SpaceMembersJoinButton({ memberAccessPluginAddress }: Props) {
  const [hasRequested, setHasRequested] = React.useState(false);
  const { requestToBeMember } = useRequestToBeMember(memberAccessPluginAddress);

  const onClick = async () => {
    await requestToBeMember();
    setHasRequested(true);
  };

  return (
    <button
      onClick={onClick}
      className="text-grey-04 transition-colors duration-75 hover:cursor-pointer hover:text-text"
    >
      {hasRequested ? 'Requested' : 'Join'}
    </button>
  );
}
