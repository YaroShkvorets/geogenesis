import {
  ClientCore,

  PluginInstallItem,

  getNamedTypesFromMetadata,

} from '@aragon/sdk-client-common';
import { encodeAbiParameters, encodeFunctionData, hexToBytes } from 'viem';

import {
  DEFAULT_GEO_MAIN_VOTING_PLUGIN_REPO_ADDRESS,
  DEFAULT_GEO_PERSONAL_SPACE_PLUGIN_REPO_ADDRESS,
} from '~/core/constants';

import {
  mainVotingPluginAbi,
  mainVotingPluginSetupAbi,
  memberAccessPluginAbi,
  memberAccessPluginSetupAbi,
  spacePluginAbi,
  spacePluginSetupAbi,
} from '../../abis';
import { GeoPluginContext } from '../../context';
import { SpacePluginSetupAbi } from '@geogenesis/contracts';

type ContractVotingSettings = [
  votingMode: bigint,
  supportThreshold: bigint,
  minParticipation: bigint,
  minDuration: bigint,
  minProposerVotingPower: bigint

]

type ContractAddresslistVotingInitParams = [
  ContractVotingSettings,
  addresses: string[], // addresses
  upgraderAddres: string,
];

export class GeoPluginClientEncoding extends ClientCore {
  private geoSpacePluginAddress: string;
  private geoMemberAccessPluginAddress: string;
  private geoMainVotingPluginAddress: string;

  constructor(pluginContext: GeoPluginContext) {
    super(pluginContext);

    // Plugin Addresses
    this.geoSpacePluginAddress = pluginContext.geoSpacePluginAddress;
    this.geoMemberAccessPluginAddress = pluginContext.geoMemberAccessPluginAddress;
    this.geoMainVotingPluginAddress = pluginContext.geoMainVotingPluginAddress;
  }

  // Space Plugin: Functions

  public getSpacePluginInstallItem(params): PluginInstallItem {
    // const networkName = getNetwork(network).name as SupportedNetwork;
    console.log('incoming params', params);
    // const hexBytes = defaultAbiCoder.encode(getNamedTypesFromMetadata(SpacePluginSetupAbi), [
    //   votingSettingsToContract(params),
    // ]);

    const namedMetadata = getNamedTypesFromMetadata(SpacePluginSetupAbi);
    console.log('named metadata', namedMetadata);
    const hexBytes = '123';

    // const hexBytes = encodeAbiParameters(
    //   getNamedTypesFromMetadata(SpacePluginSetupAbi),
    //   votingSettingsToContract(params)
    // );

    return {
      id: DEFAULT_GEO_PERSONAL_SPACE_PLUGIN_REPO_ADDRESS,
      data: hexToBytes(hexBytes as `0x${string}`),
    };
  }

  // public async getSpacePluginInstallItem(dao: `0x${string}`, payload: `0x${string}`) {
  //   const spacePluginInstallData = encodeFunctionData({
  //     abi: spacePluginSetupAbi,
  //     functionName: 'prepareInstallation',
  //     args: [dao, payload],
  //   });
  //   return spacePluginInstallData;
  // }

  public async initalizeSpacePlugin(daoAddress: `0x${string}`, firstBlockContentUri: string) {
    const initalizeData = encodeFunctionData({
      abi: spacePluginAbi,
      functionName: 'initialize',
      args: [daoAddress, firstBlockContentUri],
    });
    return initalizeData;
  }

  public async setContent(blockIndex: number, itemIndex: number, contentUri: string) {
    const setContentData = encodeFunctionData({
      abi: spacePluginAbi,
      functionName: 'setContent',
      args: [blockIndex, itemIndex, contentUri],
    });
    return setContentData;
  }

  public async acceptSubspace(subspaceDaoAddress: `0x${string}`) {
    const acceptSubspaceData = encodeFunctionData({
      abi: spacePluginAbi,
      functionName: 'acceptSubspace',
      args: [subspaceDaoAddress],
    });
    return acceptSubspaceData;
  }

  public async removeSubspace(subspaceDaoAddress: `0x${string}`) {
    const removeSubspaceData = encodeFunctionData({
      abi: spacePluginAbi,
      functionName: 'removeSubspace',
      args: [subspaceDaoAddress],
    });
    return removeSubspaceData;
  }

  // Space Plugin: Inherited Functions
  public async upgradeToSpacePlugin(pluginAddress: `0x${string}`) {
    const upgradeToData = encodeFunctionData({
      abi: spacePluginAbi,
      functionName: 'upgradeTo',
      args: [pluginAddress],
    });
    return upgradeToData;
  }

  public async upgradeToAndCallSpacePlugin(pluginAddress: `0x${string}`, calldata: `0x${string}`) {
    const upgradeToData = encodeFunctionData({
      abi: spacePluginAbi,
      functionName: 'upgradeToAndCall',
      args: [pluginAddress, calldata],
    });
    return upgradeToData;
  }

  // Member Access: Functions
  // public async initalizeMemberAccessPlugin(daoAddress: `0x${string}`, firstBlockContentUri: string) {
  //   const initalizeData = encodeFunctionData({
  //     abi: memberAccessPluginAbi,
  //     functionName: 'initialize',
  //     args: [daoAddress, firstBlockContentUri],
  //   });
  //   return initalizeData;
  // }

  public async getMemberAccessPluginInstallItem(dao: `0x${string}`, payload: `0x${string}`) {
    const spacePluginInstallData = encodeFunctionData({
      abi: memberAccessPluginSetupAbi,
      functionName: 'prepareInstallation',
      args: [dao, payload],
    });
    return spacePluginInstallData;
  }

  public async updateMultisigSettings(proposalDuration: bigint, mainVotingPluginAddress: `0x${string}`) {
    const updateMultisigSettingsData = encodeFunctionData({
      abi: memberAccessPluginAbi,
      functionName: 'updateMultisigSettings',
      args: [{ proposalDuration, mainVotingPlugin: mainVotingPluginAddress }],
    });
    return updateMultisigSettingsData;
  }

  public async proposeNewMember(metadataUri: `0x${string}`, memberAddress: `0x${string}`) {
    const proposeNewMemberData = encodeFunctionData({
      abi: memberAccessPluginAbi,
      functionName: 'proposeNewMember',
      args: [metadataUri, memberAddress],
    });
    return proposeNewMemberData;
  }

  public async proposeRemoveMember(metadataUri: `0x${string}`, memberAddress: `0x${string}`) {
    const proposeRemoveMemberData = encodeFunctionData({
      abi: memberAccessPluginAbi,
      functionName: 'proposeRemoveMember',
      args: [metadataUri, memberAddress],
    });
    return proposeRemoveMemberData;
  }

  public async approve(proposalId: bigint, earlyExecution = true) {
    const approveData = encodeFunctionData({
      abi: memberAccessPluginAbi,
      functionName: 'approve',
      args: [proposalId, earlyExecution],
    });
    return approveData;
  }

  public async reject(proposalId: bigint) {
    const rejectData = encodeFunctionData({
      abi: memberAccessPluginAbi,
      functionName: 'reject',
      args: [proposalId],
    });
    return rejectData;
  }

  public async executeMemberAccessPlugin(proposalId: bigint) {
    const executeData = encodeFunctionData({
      abi: memberAccessPluginAbi,
      functionName: 'execute',
      args: [proposalId],
    });
    return executeData;
  }

  // Member Access Plugin: Inherited Functions
  public async upgradeToMemberAccessPlugin(pluginAddress: `0x${string}`) {
    const upgradeToData = encodeFunctionData({
      abi: memberAccessPluginAbi,
      functionName: 'upgradeTo',
      args: [pluginAddress],
    });
    return upgradeToData;
  }

  public async upgradeToAndCallMemberAccessPlugin(pluginAddress: `0x${string}`, calldata: `0x${string}`) {
    const upgradeToData = encodeFunctionData({
      abi: memberAccessPluginAbi,
      functionName: 'upgradeToAndCall',
      args: [pluginAddress, calldata],
    });
    return upgradeToData;
  }

  // Main Voting: Functions
  // public async initalizeMainVotingPlugin(daoAddress: `0x${string}`, firstBlockContentUri: string) {
  //   const initalizeData = encodeFunctionData({
  //     abi: mainVotingPluginAbi,
  //     functionName: 'initialize',
  //     // args: [daoAddress, firstBlockContentUri],
  //   });
  //   return initalizeData;
  // }

  public getMainVotingPluginInstallItem(params: {
    votingSettings: {
      minDuration: number;
        votingMode: 'EarlyExecution',
        supportThreshold: number;
        minParticipation: number;
        minProposerVotingPower: bigint;
    };
    addresses: string[];
    upgraderAddress?: string;
}): PluginInstallItem {


    // 1. Define the ABI types
    const types = [
        {
            votingMode: 'uint8',
            supportThreshold: 'uint32',
            minParticipation: 'uint32',
            minDuration: 'uint64',
            minProposerVotingPower: 'uint256'
        },
        'address[]',
        'address'
    ];

    const values = [
        {
            votingMode: params.votingSettings.votingMode,
            supportThreshold: params.votingSettings.supportThreshold,
            minParticipation: params.votingSettings.minParticipation,
            minDuration: params.votingSettings.minDuration,
            minProposerVotingPower: params.votingSettings.minProposerVotingPower
        },
        params.addresses,
        params.upgraderAddress
    ];

    console.log('values', values)

    // 3. Encode the parameters
    const hexBytes = encodeAbiParameters(types, values);

    return {
        id: DEFAULT_GEO_MAIN_VOTING_PLUGIN_REPO_ADDRESS,
        data: hexToBytes(hexBytes as `0x${string}`),
    };
}


  public async addAddresses(addresses: `0x${string}`[]) {
    const addAddressesData = encodeFunctionData({
      abi: mainVotingPluginAbi,
      functionName: 'addAddresses',
      args: [addresses],
    });
    return addAddressesData;
  }

  public async removeAddresses(addresses: `0x${string}`[]) {
    const removeAddressesData = encodeFunctionData({
      abi: mainVotingPluginAbi,
      functionName: 'removeAddresses',
      args: [addresses],
    });
    return removeAddressesData;
  }

  // public async createProposal() {
  //   const createProposalData = encodeFunctionData({
  //     abi: mainVotingPluginAbi,
  //     functionName: 'createProposal',
  //     args: [],
  //   });
  //   return createProposalData;
  // }

  public async cancelProposal(proposalId: bigint) {
    const cancelProposalData = encodeFunctionData({
      abi: mainVotingPluginAbi,
      functionName: 'cancelProposal', // need new abi
      args: [proposalId],
    });
    return cancelProposalData;
  }

  // Main Voting: Inherited Functions
  public async vote(proposalId: bigint, vote: number, tryEarlyExecution: boolean) {
    const voteData = encodeFunctionData({
      abi: mainVotingPluginAbi,
      functionName: 'vote',
      args: [proposalId, vote, tryEarlyExecution],
    });
    return voteData;
  }

  public async executeMainVotingPlugin(proposalId: bigint) {
    const executeData = encodeFunctionData({
      abi: mainVotingPluginAbi,
      functionName: 'execute',
      args: [proposalId],
    });
    return executeData;
  }

  // public async updateVotingSettings() {
  //   const updateVotingSettingsData = encodeFunctionData({
  //     abi: mainVotingPluginAbi,
  //     functionName: 'updateVotingSettings',
  //     args: [
  //       {
  //         // votingMode: 1,
  //         // supportThreshold: 50,
  //         // minParticipation: 10,
  //         // minDuration: BigInt(86400),
  //         // minProposerVotingPower: BigInt(1000),
  //       },
  //     ], // wrap the object in an array
  //   });
  //   return updateVotingSettingsData;
  // }

  public async upgradeToMainVotingPlugin(pluginAddress: `0x${string}`) {
    const upgradeToData = encodeFunctionData({
      abi: mainVotingPluginAbi,
      functionName: 'upgradeTo',
      args: [pluginAddress],
    });
    return upgradeToData;
  }

  public async upgradeToAndCallMainVotingPlugin(pluginAddress: `0x${string}`, calldata: `0x${string}`) {
    const upgradeToData = encodeFunctionData({
      abi: mainVotingPluginAbi,
      functionName: 'upgradeToAndCall',
      args: [pluginAddress, calldata],
    });
    return upgradeToData;
  }
}
