import { Effect } from 'effect';
import type * as S from 'zapatos/schema';

import { SpaceWithPluginAddressNotFoundError } from '../errors';
import { generateActionId, generateVersionId } from '../utils/id';
import type { ContentProposal, EditorshipProposal, MembershipProposal, SubspaceProposal } from '../zod';

/**
 * We currently index two sets of contracts representing spaces:
 * 1. The original Space contract with simple permissions rules and no proposals.
 * 2. The new (as of January 23rd, 2024) DAO-based contracts with Plugins representing
 *    the Space and any governance and permissions rules.
 *
 * Having multiple sets of contracts means that we support multiple methods for
 * indexing data from these contracts, including the data representing the contracts
 * themselves like the address of the contract and any plugins (if they exist).
 *
 * This file represents mapping Proposals emitted by the DAO-based contracts. Currently
 * we map proposals from the old contracts in `map-entries.ts.` Since the the old
 * contracts don't have governance, we automatically set those to APPROVED.
 *
 * The new contracts have a more complex governance system, so we need to map the
 * proposals and track the status of the proposal for the duration of the voting period.
 */

export function groupProposalsByType(
  proposals: (ContentProposal | MembershipProposal | SubspaceProposal | EditorshipProposal)[]
): {
  contentProposals: ContentProposal[];
  memberProposals: MembershipProposal[];
  editorProposals: EditorshipProposal[];
  subspaceProposals: SubspaceProposal[];
} {
  const contentProposals = proposals.flatMap(p => (p.type === 'CONTENT' ? p : []));
  const memberProposals = proposals.flatMap(p => (p.type === 'ADD_MEMBER' || p.type === 'REMOVE_MEMBER' ? p : []));
  const editorProposals = proposals.flatMap(p => (p.type === 'ADD_EDITOR' || p.type === 'REMOVE_EDITOR' ? p : []));
  const subspaceProposals = proposals.flatMap(p =>
    p.type === 'ADD_SUBSPACE' || p.type === 'REMOVE_SUBSPACE' ? p : []
  );

  return {
    contentProposals,
    memberProposals,
    editorProposals,
    subspaceProposals,
  };
}

export function mapContentProposalsToSchema(
  proposals: ContentProposal[],
  blockNumber: number,
  cursor: string
): {
  proposals: S.proposals.Insertable[];
  proposedVersions: S.proposed_versions.Insertable[];
  actions: S.actions.Insertable[];
} {
  const proposalsToWrite: S.proposals.Insertable[] = [];
  const proposedVersionsToWrite: S.proposed_versions.Insertable[] = [];
  const actionsToWrite: S.actions.Insertable[] = [];

  for (const p of proposals) {
    const spaceId = p.space;

    const proposalToWrite: S.proposals.Insertable = {
      id: p.proposalId,
      onchain_proposal_id: p.onchainProposalId,
      name: p.name,
      type: 'CONTENT',
      created_at: Number(p.startTime),
      created_at_block: blockNumber,
      created_by_id: p.creator,
      start_time: Number(p.startTime),
      end_time: Number(p.endTime),
      space_id: spaceId,
      status: 'proposed',
    };

    proposalsToWrite.push(proposalToWrite);

    p.actions.forEach((action, index) => {
      const string_value =
        action.value.type === 'string' ||
        action.value.type === 'image' ||
        action.value.type === 'url' ||
        action.value.type === 'date'
          ? action.value.value
          : null;
      const entity_value = action.value.type === 'entity' ? action.value.id : null;

      const proposed_version_id = generateVersionId({
        entryIndex: index,
        entityId: action.entityId,
        cursor,
      });

      const action_id = generateActionId({
        space_id: spaceId,
        entity_id: action.entityId,
        attribute_id: action.attributeId,
        value_id: action.value.id,
        cursor,
      });

      const mappedAction: S.actions.Insertable = {
        id: action_id,
        action_type: action.type,
        entity_id: action.entityId,
        attribute_id: action.attributeId,
        value_type: action.value.type,
        value_id: action.value.id,
        string_value,
        entity_value_id: entity_value,
        proposed_version_id,
        created_at: Number(p.startTime),
        created_at_block: blockNumber,
      };

      return actionsToWrite.push(mappedAction);
    });

    const uniqueEntityIds = new Set(p.actions.map(action => action.entityId));

    [...uniqueEntityIds.values()].forEach((entityId, entryIndex) => {
      const mappedProposedVersion: S.proposed_versions.Insertable = {
        id: generateVersionId({ entryIndex, entityId, cursor }),
        entity_id: entityId,
        created_at_block: blockNumber,
        created_at: Number(p.startTime),
        name: p.name,
        created_by_id: p.creator,
        proposal_id: p.proposalId,
        space_id: spaceId,
      };

      proposedVersionsToWrite.push(mappedProposedVersion);
    });
  }

  return {
    proposals: proposalsToWrite,
    proposedVersions: proposedVersionsToWrite,
    actions: actionsToWrite,
  };
}

export function mapSubspaceProposalsToSchema(
  proposals: SubspaceProposal[],
  blockNumber: number
): {
  proposals: S.proposals.Insertable[];
  proposedSubspaces: S.proposed_subspaces.Insertable[];
} {
  const proposalsToWrite: S.proposals.Insertable[] = [];
  const proposedSubspacesToWrite: S.proposed_subspaces.Insertable[] = [];

  for (const p of proposals) {
    const spaceId = p.space;

    const proposalToWrite: S.proposals.Insertable = {
      id: p.proposalId,
      onchain_proposal_id: p.onchainProposalId,
      name: p.name,
      type: p.type,
      created_at: Number(p.startTime),
      created_at_block: blockNumber,
      created_by_id: p.creator,
      start_time: Number(p.startTime),
      end_time: Number(p.endTime),
      space_id: spaceId,
      status: 'proposed',
    };

    proposalsToWrite.push(proposalToWrite);

    const proposedSubspace: S.proposed_subspaces.Insertable = {
      id: p.proposalId,
      type: p.type,
      parent_space: p.space,
      subspace: p.subspace,
      created_at: Number(p.startTime),
      created_at_block: blockNumber,
      proposal_id: p.proposalId,
    };

    proposedSubspacesToWrite.push(proposedSubspace);
  }

  return {
    proposals: proposalsToWrite,
    proposedSubspaces: proposedSubspacesToWrite,
  };
}

export function mapEditorshipProposalsToSchema(
  proposals: EditorshipProposal[],
  blockNumber: number
): {
  proposals: S.proposals.Insertable[];
  proposedEditors: S.proposed_editors.Insertable[];
  accounts: S.accounts.Insertable[];
} {
  const proposalsToWrite: S.proposals.Insertable[] = [];
  const proposedEditorsToWrite: S.proposed_editors.Insertable[] = [];
  const accountsToWrite: S.accounts.Insertable[] = [];

  for (const p of proposals) {
    const spaceId = p.space;

    const proposalToWrite: S.proposals.Insertable = {
      id: p.proposalId,
      onchain_proposal_id: p.onchainProposalId,
      name: p.name,
      type: p.type,
      created_at: Number(p.startTime),
      created_at_block: blockNumber,
      created_by_id: p.creator,
      start_time: Number(p.startTime),
      end_time: Number(p.endTime),
      space_id: spaceId,
      status: 'proposed',
    };

    proposalsToWrite.push(proposalToWrite);

    const proposedEditor: S.proposed_editors.Insertable = {
      id: p.proposalId,
      type: p.type,
      account_id: p.userAddress,
      space_id: spaceId,
      created_at: Number(p.startTime),
      created_at_block: blockNumber,
      proposal_id: p.proposalId,
    };

    proposedEditorsToWrite.push(proposedEditor);

    const newAccount: S.accounts.Insertable = {
      id: p.userAddress,
    };

    accountsToWrite.push(newAccount);
  }

  return {
    proposals: proposalsToWrite,
    proposedEditors: proposedEditorsToWrite,
    accounts: accountsToWrite,
  };
}

export function mapMembershipProposalsToSchema(
  proposals: MembershipProposal[],
  blockNumber: number
): {
  proposals: S.proposals.Insertable[];
  proposedMembers: S.proposed_members.Insertable[];
  accounts: S.accounts.Insertable[];
} {
  const proposalsToWrite: S.proposals.Insertable[] = [];
  const proposedMembersToWrite: S.proposed_members.Insertable[] = [];
  const accountsToWrite: S.accounts.Insertable[] = [];

  for (const p of proposals) {
    const spaceId = p.space;

    const proposalToWrite: S.proposals.Insertable = {
      id: p.proposalId,
      onchain_proposal_id: p.onchainProposalId,
      name: p.name,
      type: p.type,
      created_at: Number(p.startTime),
      created_at_block: blockNumber,
      created_by_id: p.creator,
      start_time: Number(p.startTime),
      end_time: Number(p.endTime),
      space_id: spaceId,
      status: 'proposed',
    };

    proposalsToWrite.push(proposalToWrite);

    const proposedMember: S.proposed_members.Insertable = {
      id: p.proposalId,
      type: p.type,
      account_id: p.userAddress,
      space_id: spaceId,
      created_at: Number(p.startTime),
      created_at_block: blockNumber,
      proposal_id: p.proposalId,
    };

    proposedMembersToWrite.push(proposedMember);

    const newAccount: S.accounts.Insertable = {
      id: p.userAddress,
    };

    accountsToWrite.push(newAccount);
  }

  return {
    proposals: proposalsToWrite,
    proposedMembers: proposedMembersToWrite,
    accounts: accountsToWrite,
  };
}
