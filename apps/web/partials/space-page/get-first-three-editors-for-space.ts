import { Environment } from '~/core/environment';
import { API, Subgraph } from '~/core/io';
import { OmitStrict, Profile } from '~/core/types';

type EditorsForSpace = {
  firstThreeEditors: OmitStrict<Profile, 'coverUrl'>[];
  totalEditors: number;
};

export async function getFirstThreeEditorsForSpace(spaceId: string): Promise<EditorsForSpace> {
  let config = Environment.getConfig(process.env.NEXT_PUBLIC_APP_ENV);

  const { isPermissionlessSpace, space } = await API.space(spaceId);

  if (isPermissionlessSpace) {
    config = {
      ...config,
      subgraph: config.permissionlessSubgraph,
    };
  }

  if (!space) {
    throw new Error("Space doesn't exist");
  }

  // For now we use editors for both editors and members until we have the new membership
  // model in place.
  const maybeEditorsProfiles = await Promise.all(
    space.editors.slice(0, 3).map(editor => Subgraph.fetchProfile({ endpoint: config.subgraph, address: editor }))
  );

  const firstThreeEditors = maybeEditorsProfiles.map((profile, i) => {
    if (!profile) {
      return {
        id: space.editors[i],
        avatarUrl: null,
        name: null,
        address: space.editors[i] as `0x${string}`,
        profileLink: '',
      };
    }

    return {
      id: profile[1].id,
      avatarUrl: profile[1].avatarUrl,
      name: profile[1].name,
      address: profile[1].address,
      profileLink: profile[1].profileLink,
    };
  });

  return {
    firstThreeEditors,
    totalEditors: space.editors.length,
  };
}
