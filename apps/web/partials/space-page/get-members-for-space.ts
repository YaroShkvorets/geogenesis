import { cache } from 'react';

import { Subgraph } from '~/core/io';
import { OmitStrict, Profile } from '~/core/types';

import { cachedFetchSpace } from '~/app/space/[id]/cached-fetch-space';

type MembersForSpace = {
  allMembers: OmitStrict<Profile, 'coverUrl'>[];
  totalMembers: number;
  votingPluginAddress: string | null;
  spacePluginAddress: string | null;
  memberPluginAddress: string | null;
};

export const getMembersForSpace = cache(async (spaceId: string): Promise<MembersForSpace> => {
  const space = await cachedFetchSpace(spaceId);

  if (!space) {
    throw new Error("Space doesn't exist");
  }

  const maybeMembersProfiles = await Promise.all(
    space.members.map(editor => Subgraph.fetchProfile({ address: editor }))
  );

  const allMembers = maybeMembersProfiles.map(profile => {
    if (!profile) {
      return null;
    }

    return {
      id: profile.id,
      avatarUrl: profile.avatarUrl,
      name: profile.name,
      address: profile.address,
      profileLink: profile.profileLink,
    };
  });

  const allMembersWithProfiles = allMembers.filter((editor): editor is Profile => editor !== null);

  return {
    allMembers: allMembersWithProfiles,
    totalMembers: space.members.length,
    votingPluginAddress: space.mainVotingPluginAddress,
    spacePluginAddress: space.spacePluginAddress,
    memberPluginAddress: space.memberAccessPluginAddress,
  };
});
