import {
  ClientCore,
  PrepareInstallationParams,
  PrepareInstallationStepValue,
  prepareGenericInstallation,
} from '@aragon/sdk-client-common';
import { Effect } from 'effect';

import { prepareWriteContract, readContract, waitForTransaction, writeContract } from 'wagmi/actions';

import { InitializePersonalSpaceAdminPluginOptions } from '~/core/io/personal-space-plugin';
import {
  TransactionPrepareFailedError,
  TransactionRevertedError,
  TransactionWriteFailedError,
  WaitForTransactionBlockError,
} from '~/core/io/publish';

import {
  mainVotingPluginAbi,
  memberAccessPluginAbi,
  personalSpaceAdminPluginAbi,
  spacePluginAbi,
  spacePluginSetupAbi,
} from '../../abis';
import { GeoPluginContext } from '../../context';
import * as SPACE_PLUGIN_BUILD_METADATA from '../../metadata/space-build-metadata.json';
import {
  CancelMainVotingPluginProposalOptions,
  CreateMainVotingPluginProposalOptions,
  ExecuteMainVotingPluginProposalOptions,
  InitializeMainVotingPluginOptions,
  InitializeSpacePluginOptions,
  SetContentSpacePluginOptions,
  VoteMainVotingPluginProposalOptions,
} from '../../types';

export class GeoPluginClientMethods extends ClientCore {
  private geoSpacePluginAddress: string;
  private geoMemberAccessPluginAddress: string;
  private geoMainVotingPluginAddress: string;

  private geoSpacePluginRepoAddress: string;
  private geoMemberAccessPluginRepoAddress: string;
  private geoMainVotingPluginRepoAddress: string;

  constructor(pluginContext: GeoPluginContext) {
    super(pluginContext);

    // Plugin Addresses
    this.geoSpacePluginAddress = pluginContext.geoSpacePluginAddress;
    this.geoMemberAccessPluginAddress = pluginContext.geoMemberAccessPluginAddress;
    this.geoMainVotingPluginAddress = pluginContext.geoMainVotingPluginAddress;

    // Plugin Repo Addresses
    this.geoSpacePluginRepoAddress = pluginContext.geoSpacePluginRepoAddress;
    this.geoMemberAccessPluginRepoAddress = pluginContext.geoMemberAccessPluginRepoAddress;
    this.geoMainVotingPluginRepoAddress = pluginContext.geoMainVotingPluginRepoAddress;
  }

  // Space Plugin: Initialize on a fresh DAO

  // Space Plugin: Write Functions

  // Initialize Space Plugin for an already existing DAO
  public async initializeSpacePlugin({
    wallet,
    daoAddress,
    firstBlockUri,
    onInitStateChange,
  }: InitializeSpacePluginOptions): Promise<void> {
    const prepareInitEffect = Effect.tryPromise({
      try: () =>
        prepareWriteContract({
          abi: spacePluginAbi,
          address: this.geoSpacePluginAddress as `0x${string}`,
          functionName: 'initialize',
          walletClient: wallet,
          args: [daoAddress, firstBlockUri],
        }),
      catch: error => new TransactionPrepareFailedError(`Transaction prepare failed: ${error}`),
    });

    const writeInitEffect = Effect.gen(function* (awaited) {
      const contractConfig = yield* awaited(prepareInitEffect);

      onInitStateChange('initializing-plugin');

      return yield* awaited(
        Effect.tryPromise({
          try: () => writeContract(contractConfig),
          catch: error => new TransactionWriteFailedError(`Initialization failed: ${error}`),
        })
      );
    });

    const initializePluginProgram = Effect.gen(function* (awaited) {
      const writeInitResult = yield* awaited(writeInitEffect);

      console.log('Transaction hash: ', writeInitResult.hash);
      onInitStateChange('waiting-for-transaction');

      const waitForTransactionEffect = yield* awaited(
        Effect.tryPromise({
          try: () =>
            waitForTransaction({
              hash: writeInitResult.hash,
            }),
          catch: error => new WaitForTransactionBlockError(`Error while waiting for transaction block: ${error}`),
        })
      );

      if (waitForTransactionEffect.status !== 'success') {
        return yield* awaited(
          Effect.fail(
            new TransactionRevertedError(`Transaction reverted: 
        hash: ${waitForTransactionEffect.transactionHash}
        status: ${waitForTransactionEffect.status}
        blockNumber: ${waitForTransactionEffect.blockNumber}
        blockHash: ${waitForTransactionEffect.blockHash}
        ${JSON.stringify(waitForTransactionEffect)}
        `)
          )
        );
      }

      console.log(`Transaction successful. Receipt: 
      hash: ${waitForTransactionEffect.transactionHash}
      status: ${waitForTransactionEffect.status}
      blockNumber: ${waitForTransactionEffect.blockNumber}
      blockHash: ${waitForTransactionEffect.blockHash}
      `);
    });

    await Effect.runPromise(initializePluginProgram);
  }

  // Set Space Content
  public async setContent({
    wallet,
    blockIndex,
    itemIndex,
    contentUri,
    onProposalStateChange,
  }: SetContentSpacePluginOptions): Promise<void> {
    const prepareExecutionEffect = Effect.tryPromise({
      try: () =>
        prepareWriteContract({
          address: this.geoSpacePluginAddress as `0x${string}`,
          abi: spacePluginAbi,
          functionName: 'setContent',
          walletClient: wallet,
          args: [blockIndex, itemIndex, contentUri],
        }),
      catch: error => new TransactionPrepareFailedError(`Transaction prepare failed: ${error}`),
    });

    const writeExecutionEffect = Effect.gen(function* (awaited) {
      const contractConfig = yield* awaited(prepareExecutionEffect);

      onProposalStateChange('initializing-proposal-plugin');

      return yield* awaited(
        Effect.tryPromise({
          try: () => writeContract(contractConfig),
          catch: error => new TransactionWriteFailedError(`Execution failed: ${error}`),
        })
      );
    });

    const executeProgram = Effect.gen(function* (awaited) {
      const writeExecutionResult = yield* awaited(writeExecutionEffect);

      console.log('Transaction hash: ', writeExecutionResult.hash);
      onProposalStateChange('waiting-for-transaction');

      const waitForTransactionEffect = yield* awaited(
        Effect.tryPromise({
          try: () =>
            waitForTransaction({
              hash: writeExecutionResult.hash,
            }),
          catch: error => new WaitForTransactionBlockError(`Error while waiting for transaction block: ${error}`),
        })
      );

      if (waitForTransactionEffect.status !== 'success') {
        return yield* awaited(
          Effect.fail(
            new TransactionRevertedError(`Transaction reverted: 
        hash: ${waitForTransactionEffect.transactionHash}
        status: ${waitForTransactionEffect.status}
        blockNumber: ${waitForTransactionEffect.blockNumber}
        blockHash: ${waitForTransactionEffect.blockHash}
        ${JSON.stringify(waitForTransactionEffect)}
        `)
          )
        );
      }

      console.log(`Transaction successful. Receipt: 
      hash: ${waitForTransactionEffect.transactionHash}
      status: ${waitForTransactionEffect.status}
      blockNumber: ${waitForTransactionEffect.blockNumber}
      blockHash: ${waitForTransactionEffect.blockHash}
      `);
    });

    await Effect.runPromise(executeProgram);
  }

  // Space Plugin: Read Functions

  // Member Access Plugin: Initialize

  // Member Access Plugin: Write Functions

  // Initialize Member Access Plugin for an already existing DAO

  // Member Access Plugin: Read Functions
  public async isMember(address: `0x${string}`): Promise<boolean> {
    const isMemberRead = await readContract({
      address: this.geoMemberAccessPluginAddress as `0x${string}`,
      abi: memberAccessPluginAbi,
      functionName: 'isMember',
      args: [address],
    });
    return isMemberRead;
  }

  public async isEditor(address: `0x${string}`): Promise<boolean> {
    const isEditorRead = await readContract({
      address: this.geoMemberAccessPluginAddress as `0x${string}`,
      abi: memberAccessPluginAbi,
      functionName: 'isEditor',
      args: [address],
    });
    return isEditorRead;
  }

  public async canApprove(proposalId: bigint, address: `0x${string}`): Promise<boolean> {
    const canApproveRead = await readContract({
      address: this.geoMemberAccessPluginAddress as `0x${string}`,
      abi: memberAccessPluginAbi,
      functionName: 'canApprove',
      args: [proposalId, address],
    });
    return canApproveRead;
  }

  public async canExecute(proposalId: bigint): Promise<boolean> {
    const canApproveRead = await readContract({
      address: this.geoMemberAccessPluginAddress as `0x${string}`,
      abi: memberAccessPluginAbi,
      functionName: 'canExecute',
      args: [proposalId],
    });
    return canApproveRead;
  }

  public async hasApproved(proposalId: bigint, address: `0x${string}`): Promise<boolean> {
    const hasApprovedRead = await readContract({
      address: this.geoMemberAccessPluginAddress as `0x${string}`,
      abi: memberAccessPluginAbi,
      functionName: 'hasApproved',
      args: [proposalId, address],
    });
    return hasApprovedRead;
  }

  public async supportsInterface(interfaceId: `0x${string}`): Promise<boolean> {
    const supportsInterfaceRead = await readContract({
      address: this.geoMemberAccessPluginAddress as `0x${string}`,
      abi: memberAccessPluginAbi,
      functionName: 'supportsInterface',
      args: [interfaceId],
    });
    return supportsInterfaceRead;
  }

  // Main Voting Plugin: Initialize

  // Main Voting Plugin: Write Functions

  // Initialize Main Voting Plugin for an already existing DAO

  public async initializeMainVotingPlugin({
    wallet,
    daoAddress,
    votingSettings,
    initialEditors,
    onInitStateChange,
  }: InitializeMainVotingPluginOptions): Promise<void> {
    const prepareInitEffect = Effect.tryPromise({
      try: () =>
        prepareWriteContract({
          abi: mainVotingPluginAbi,
          address: this.geoMainVotingPluginAddress as `0x${string}`,
          functionName: 'initialize',
          walletClient: wallet,
          args: [daoAddress, votingSettings, initialEditors],
        }),
      catch: error => new TransactionPrepareFailedError(`Transaction prepare failed: ${error}`),
    });

    const writeInitEffect = Effect.gen(function* (awaited) {
      const contractConfig = yield* awaited(prepareInitEffect);

      onInitStateChange('initializing-plugin');

      return yield* awaited(
        Effect.tryPromise({
          try: () => writeContract(contractConfig),
          catch: error => new TransactionWriteFailedError(`Initialization failed: ${error}`),
        })
      );
    });

    const initializePluginProgram = Effect.gen(function* (awaited) {
      const writeInitResult = yield* awaited(writeInitEffect);

      console.log('Transaction hash: ', writeInitResult.hash);
      onInitStateChange('waiting-for-transaction');

      const waitForTransactionEffect = yield* awaited(
        Effect.tryPromise({
          try: () =>
            waitForTransaction({
              hash: writeInitResult.hash,
            }),
          catch: error => new WaitForTransactionBlockError(`Error while waiting for transaction block: ${error}`),
        })
      );

      if (waitForTransactionEffect.status !== 'success') {
        return yield* awaited(
          Effect.fail(
            new TransactionRevertedError(`Transaction reverted: 
        hash: ${waitForTransactionEffect.transactionHash}
        status: ${waitForTransactionEffect.status}
        blockNumber: ${waitForTransactionEffect.blockNumber}
        blockHash: ${waitForTransactionEffect.blockHash}
        ${JSON.stringify(waitForTransactionEffect)}
        `)
          )
        );
      }

      console.log(`Transaction successful. Receipt: 
      hash: ${waitForTransactionEffect.transactionHash}
      status: ${waitForTransactionEffect.status}
      blockNumber: ${waitForTransactionEffect.blockNumber}
      blockHash: ${waitForTransactionEffect.blockHash}
      `);
    });

    await Effect.runPromise(initializePluginProgram);
  }

  // Create Main Voting Plugin Proposals
  public async createProposal({
    wallet,
    metadata,
    actions,
    allowFailureMap,
    arg3 = BigInt(0),
    arg4 = BigInt(0),
    voteOption,
    tryEarlyExecution,
    onProposalStateChange,
  }: CreateMainVotingPluginProposalOptions): Promise<void> {
    const prepareExecutionEffect = Effect.tryPromise({
      try: () =>
        prepareWriteContract({
          address: this.geoMainVotingPluginAddress as `0x${string}`,
          abi: mainVotingPluginAbi,
          functionName: 'createProposal',
          walletClient: wallet,
          args: [metadata, actions, allowFailureMap, arg3, arg4, voteOption, tryEarlyExecution],
        }),
      catch: error => new TransactionPrepareFailedError(`Transaction prepare failed: ${error}`),
    });

    const writeExecutionEffect = Effect.gen(function* (awaited) {
      const contractConfig = yield* awaited(prepareExecutionEffect);

      onProposalStateChange('initializing-proposal-plugin');

      return yield* awaited(
        Effect.tryPromise({
          try: () => writeContract(contractConfig),
          catch: error => new TransactionWriteFailedError(`Execution failed: ${error}`),
        })
      );
    });

    const executeProgram = Effect.gen(function* (awaited) {
      const writeExecutionResult = yield* awaited(writeExecutionEffect);

      console.log('Transaction hash: ', writeExecutionResult.hash);
      onProposalStateChange('waiting-for-transaction');

      const waitForTransactionEffect = yield* awaited(
        Effect.tryPromise({
          try: () =>
            waitForTransaction({
              hash: writeExecutionResult.hash,
            }),
          catch: error => new WaitForTransactionBlockError(`Error while waiting for transaction block: ${error}`),
        })
      );

      if (waitForTransactionEffect.status !== 'success') {
        return yield* awaited(
          Effect.fail(
            new TransactionRevertedError(`Transaction reverted: 
        hash: ${waitForTransactionEffect.transactionHash}
        status: ${waitForTransactionEffect.status}
        blockNumber: ${waitForTransactionEffect.blockNumber}
        blockHash: ${waitForTransactionEffect.blockHash}
        ${JSON.stringify(waitForTransactionEffect)}
        `)
          )
        );
      }

      console.log(`Transaction successful. Receipt: 
      hash: ${waitForTransactionEffect.transactionHash}
      status: ${waitForTransactionEffect.status}
      blockNumber: ${waitForTransactionEffect.blockNumber}
      blockHash: ${waitForTransactionEffect.blockHash}
      `);
    });

    await Effect.runPromise(executeProgram);
  }

  // Cancel Main Voting Plugin Proposal
  public async cancelProposal({
    proposalId,
    onProposalStateChange,
  }: CancelMainVotingPluginProposalOptions): Promise<void> {
    const prepareExecutionEffect = Effect.tryPromise({
      try: () =>
        prepareWriteContract({
          address: this.geoMainVotingPluginAddress as `0x${string}`,
          abi: mainVotingPluginAbi,
          functionName: 'cancelProposal',
          args: [proposalId],
        }),
      catch: error => new TransactionPrepareFailedError(`Transaction prepare failed: ${error}`),
    });

    const writeExecutionEffect = Effect.gen(function* (awaited) {
      const contractConfig = yield* awaited(prepareExecutionEffect);

      onProposalStateChange('initializing-proposal-plugin');

      return yield* awaited(
        Effect.tryPromise({
          try: () => writeContract(contractConfig),
          catch: error => new TransactionWriteFailedError(`Execution failed: ${error}`),
        })
      );
    });

    const executeProgram = Effect.gen(function* (awaited) {
      const writeExecutionResult = yield* awaited(writeExecutionEffect);

      console.log('Transaction hash: ', writeExecutionResult.hash);
      onProposalStateChange('waiting-for-transaction');

      const waitForTransactionEffect = yield* awaited(
        Effect.tryPromise({
          try: () =>
            waitForTransaction({
              hash: writeExecutionResult.hash,
            }),
          catch: error => new WaitForTransactionBlockError(`Error while waiting for transaction block: ${error}`),
        })
      );

      if (waitForTransactionEffect.status !== 'success') {
        return yield* awaited(
          Effect.fail(
            new TransactionRevertedError(`Transaction reverted: 
        hash: ${waitForTransactionEffect.transactionHash}
        status: ${waitForTransactionEffect.status}
        blockNumber: ${waitForTransactionEffect.blockNumber}
        blockHash: ${waitForTransactionEffect.blockHash}
        ${JSON.stringify(waitForTransactionEffect)}
        `)
          )
        );
      }

      console.log(`Transaction successful. Receipt: 
      hash: ${waitForTransactionEffect.transactionHash}
      status: ${waitForTransactionEffect.status}
      blockNumber: ${waitForTransactionEffect.blockNumber}
      blockHash: ${waitForTransactionEffect.blockHash}
      `);
    });

    await Effect.runPromise(executeProgram);
  }

  // Main Voting Plugin: Inherited Write Functions

  // Vote on a proposal
  public async voteProposal({
    wallet,
    proposalId,
    vote,
    tryEarlyExecution,
    onProposalStateChange,
  }: VoteMainVotingPluginProposalOptions): Promise<void> {
    const prepareExecutionEffect = Effect.tryPromise({
      try: () =>
        prepareWriteContract({
          address: this.geoMainVotingPluginAddress as `0x${string}`,
          abi: mainVotingPluginAbi,
          functionName: 'vote',
          walletClient: wallet,
          args: [proposalId, vote, tryEarlyExecution],
        }),
      catch: error => new TransactionPrepareFailedError(`Transaction prepare failed: ${error}`),
    });

    const writeExecutionEffect = Effect.gen(function* (awaited) {
      const contractConfig = yield* awaited(prepareExecutionEffect);

      onProposalStateChange('initializing-proposal-plugin');

      return yield* awaited(
        Effect.tryPromise({
          try: () => writeContract(contractConfig),
          catch: error => new TransactionWriteFailedError(`Execution failed: ${error}`),
        })
      );
    });

    const executeProgram = Effect.gen(function* (awaited) {
      const writeExecutionResult = yield* awaited(writeExecutionEffect);

      console.log('Transaction hash: ', writeExecutionResult.hash);
      onProposalStateChange('waiting-for-transaction');

      const waitForTransactionEffect = yield* awaited(
        Effect.tryPromise({
          try: () =>
            waitForTransaction({
              hash: writeExecutionResult.hash,
            }),
          catch: error => new WaitForTransactionBlockError(`Error while waiting for transaction block: ${error}`),
        })
      );

      if (waitForTransactionEffect.status !== 'success') {
        return yield* awaited(
          Effect.fail(
            new TransactionRevertedError(`Transaction reverted: 
        hash: ${waitForTransactionEffect.transactionHash}
        status: ${waitForTransactionEffect.status}
        blockNumber: ${waitForTransactionEffect.blockNumber}
        blockHash: ${waitForTransactionEffect.blockHash}
        ${JSON.stringify(waitForTransactionEffect)}
        `)
          )
        );
      }

      console.log(`Transaction successful. Receipt: 
      hash: ${waitForTransactionEffect.transactionHash}
      status: ${waitForTransactionEffect.status}
      blockNumber: ${waitForTransactionEffect.blockNumber}
      blockHash: ${waitForTransactionEffect.blockHash}
      `);
    });

    await Effect.runPromise(executeProgram);
  }

  // Execute a proposal
  public async executeProposal({
    wallet,
    proposalId,
    onProposalStateChange,
  }: ExecuteMainVotingPluginProposalOptions): Promise<void> {
    const prepareExecutionEffect = Effect.tryPromise({
      try: () =>
        prepareWriteContract({
          address: this.geoMainVotingPluginAddress as `0x${string}`,
          abi: mainVotingPluginAbi,
          functionName: 'execute',
          walletClient: wallet,
          args: [proposalId],
        }),
      catch: error => new TransactionPrepareFailedError(`Transaction prepare failed: ${error}`),
    });

    const writeExecutionEffect = Effect.gen(function* (awaited) {
      const contractConfig = yield* awaited(prepareExecutionEffect);

      onProposalStateChange('initializing-proposal-plugin');

      return yield* awaited(
        Effect.tryPromise({
          try: () => writeContract(contractConfig),
          catch: error => new TransactionWriteFailedError(`Execution failed: ${error}`),
        })
      );
    });

    const executeProgram = Effect.gen(function* (awaited) {
      const writeExecutionResult = yield* awaited(writeExecutionEffect);

      console.log('Transaction hash: ', writeExecutionResult.hash);
      onProposalStateChange('waiting-for-transaction');

      const waitForTransactionEffect = yield* awaited(
        Effect.tryPromise({
          try: () =>
            waitForTransaction({
              hash: writeExecutionResult.hash,
            }),
          catch: error => new WaitForTransactionBlockError(`Error while waiting for transaction block: ${error}`),
        })
      );

      if (waitForTransactionEffect.status !== 'success') {
        return yield* awaited(
          Effect.fail(
            new TransactionRevertedError(`Transaction reverted: 
        hash: ${waitForTransactionEffect.transactionHash}
        status: ${waitForTransactionEffect.status}
        blockNumber: ${waitForTransactionEffect.blockNumber}
        blockHash: ${waitForTransactionEffect.blockHash}
        ${JSON.stringify(waitForTransactionEffect)}
        `)
          )
        );
      }

      console.log(`Transaction successful. Receipt: 
      hash: ${waitForTransactionEffect.transactionHash}
      status: ${waitForTransactionEffect.status}
      blockNumber: ${waitForTransactionEffect.blockNumber}
      blockHash: ${waitForTransactionEffect.blockHash}
      `);
    });

    await Effect.runPromise(executeProgram);
  }

  // Main Voting Plugin: Read Functions
}