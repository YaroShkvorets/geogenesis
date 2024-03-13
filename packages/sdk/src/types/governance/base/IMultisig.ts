/* Autogenerated file. Do not edit manually. */

/* tslint:disable */

/* eslint-disable */
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from '../../common'
import type { FunctionFragment, Result } from '@ethersproject/abi'
import type { Listener, Provider } from '@ethersproject/providers'
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from 'ethers'

export interface IMultisigInterface extends utils.Interface {
  functions: {
    'approve(uint256)': FunctionFragment
    'canApprove(uint256,address)': FunctionFragment
    'canExecute(uint256)': FunctionFragment
    'execute(uint256)': FunctionFragment
    'hasApproved(uint256,address)': FunctionFragment
  }

  getFunction(
    nameOrSignatureOrTopic:
      | 'approve'
      | 'canApprove'
      | 'canExecute'
      | 'execute'
      | 'hasApproved'
  ): FunctionFragment

  encodeFunctionData(
    functionFragment: 'approve',
    values: [PromiseOrValue<BigNumberish>]
  ): string
  encodeFunctionData(
    functionFragment: 'canApprove',
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<string>]
  ): string
  encodeFunctionData(
    functionFragment: 'canExecute',
    values: [PromiseOrValue<BigNumberish>]
  ): string
  encodeFunctionData(
    functionFragment: 'execute',
    values: [PromiseOrValue<BigNumberish>]
  ): string
  encodeFunctionData(
    functionFragment: 'hasApproved',
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<string>]
  ): string

  decodeFunctionResult(functionFragment: 'approve', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'canApprove', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'canExecute', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'execute', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'hasApproved', data: BytesLike): Result

  events: {}
}

export interface IMultisig extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this
  attach(addressOrName: string): this
  deployed(): Promise<this>

  interface: IMultisigInterface

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>
  listeners(eventName?: string): Array<Listener>
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this
  removeAllListeners(eventName?: string): this
  off: OnEvent<this>
  on: OnEvent<this>
  once: OnEvent<this>
  removeListener: OnEvent<this>

  functions: {
    approve(
      _proposalId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>

    canApprove(
      _proposalId: PromiseOrValue<BigNumberish>,
      _account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[boolean]>

    canExecute(
      _proposalId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[boolean]>

    execute(
      _proposalId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>

    hasApproved(
      _proposalId: PromiseOrValue<BigNumberish>,
      _account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[boolean]>
  }

  approve(
    _proposalId: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>

  canApprove(
    _proposalId: PromiseOrValue<BigNumberish>,
    _account: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<boolean>

  canExecute(
    _proposalId: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<boolean>

  execute(
    _proposalId: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>

  hasApproved(
    _proposalId: PromiseOrValue<BigNumberish>,
    _account: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<boolean>

  callStatic: {
    approve(
      _proposalId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>

    canApprove(
      _proposalId: PromiseOrValue<BigNumberish>,
      _account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<boolean>

    canExecute(
      _proposalId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<boolean>

    execute(
      _proposalId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>

    hasApproved(
      _proposalId: PromiseOrValue<BigNumberish>,
      _account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<boolean>
  }

  filters: {}

  estimateGas: {
    approve(
      _proposalId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>

    canApprove(
      _proposalId: PromiseOrValue<BigNumberish>,
      _account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>

    canExecute(
      _proposalId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>

    execute(
      _proposalId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>

    hasApproved(
      _proposalId: PromiseOrValue<BigNumberish>,
      _account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>
  }

  populateTransaction: {
    approve(
      _proposalId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>

    canApprove(
      _proposalId: PromiseOrValue<BigNumberish>,
      _account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>

    canExecute(
      _proposalId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>

    execute(
      _proposalId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>

    hasApproved(
      _proposalId: PromiseOrValue<BigNumberish>,
      _account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>
  }
}
