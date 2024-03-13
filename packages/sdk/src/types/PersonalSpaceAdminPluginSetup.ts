/* Autogenerated file. Do not edit manually. */

/* tslint:disable */

/* eslint-disable */
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from './common'
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

export declare namespace PermissionLib {
  export type MultiTargetPermissionStruct = {
    operation: PromiseOrValue<BigNumberish>
    where: PromiseOrValue<string>
    who: PromiseOrValue<string>
    condition: PromiseOrValue<string>
    permissionId: PromiseOrValue<BytesLike>
  }

  export type MultiTargetPermissionStructOutput = [
    number,
    string,
    string,
    string,
    string
  ] & {
    operation: number
    where: string
    who: string
    condition: string
    permissionId: string
  }
}

export declare namespace IPluginSetup {
  export type PreparedSetupDataStruct = {
    helpers: PromiseOrValue<string>[]
    permissions: PermissionLib.MultiTargetPermissionStruct[]
  }

  export type PreparedSetupDataStructOutput = [
    string[],
    PermissionLib.MultiTargetPermissionStructOutput[]
  ] & {
    helpers: string[]
    permissions: PermissionLib.MultiTargetPermissionStructOutput[]
  }

  export type SetupPayloadStruct = {
    plugin: PromiseOrValue<string>
    currentHelpers: PromiseOrValue<string>[]
    data: PromiseOrValue<BytesLike>
  }

  export type SetupPayloadStructOutput = [string, string[], string] & {
    plugin: string
    currentHelpers: string[]
    data: string
  }
}

export interface PersonalSpaceAdminPluginSetupInterface
  extends utils.Interface {
  functions: {
    'decodeInstallationParams(bytes)': FunctionFragment
    'encodeInstallationParams(address)': FunctionFragment
    'implementation()': FunctionFragment
    'prepareInstallation(address,bytes)': FunctionFragment
    'prepareUninstallation(address,(address,address[],bytes))': FunctionFragment
    'prepareUpdate(address,uint16,(address,address[],bytes))': FunctionFragment
    'supportsInterface(bytes4)': FunctionFragment
  }

  getFunction(
    nameOrSignatureOrTopic:
      | 'decodeInstallationParams'
      | 'encodeInstallationParams'
      | 'implementation'
      | 'prepareInstallation'
      | 'prepareUninstallation'
      | 'prepareUpdate'
      | 'supportsInterface'
  ): FunctionFragment

  encodeFunctionData(
    functionFragment: 'decodeInstallationParams',
    values: [PromiseOrValue<BytesLike>]
  ): string
  encodeFunctionData(
    functionFragment: 'encodeInstallationParams',
    values: [PromiseOrValue<string>]
  ): string
  encodeFunctionData(
    functionFragment: 'implementation',
    values?: undefined
  ): string
  encodeFunctionData(
    functionFragment: 'prepareInstallation',
    values: [PromiseOrValue<string>, PromiseOrValue<BytesLike>]
  ): string
  encodeFunctionData(
    functionFragment: 'prepareUninstallation',
    values: [PromiseOrValue<string>, IPluginSetup.SetupPayloadStruct]
  ): string
  encodeFunctionData(
    functionFragment: 'prepareUpdate',
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      IPluginSetup.SetupPayloadStruct
    ]
  ): string
  encodeFunctionData(
    functionFragment: 'supportsInterface',
    values: [PromiseOrValue<BytesLike>]
  ): string

  decodeFunctionResult(
    functionFragment: 'decodeInstallationParams',
    data: BytesLike
  ): Result
  decodeFunctionResult(
    functionFragment: 'encodeInstallationParams',
    data: BytesLike
  ): Result
  decodeFunctionResult(
    functionFragment: 'implementation',
    data: BytesLike
  ): Result
  decodeFunctionResult(
    functionFragment: 'prepareInstallation',
    data: BytesLike
  ): Result
  decodeFunctionResult(
    functionFragment: 'prepareUninstallation',
    data: BytesLike
  ): Result
  decodeFunctionResult(
    functionFragment: 'prepareUpdate',
    data: BytesLike
  ): Result
  decodeFunctionResult(
    functionFragment: 'supportsInterface',
    data: BytesLike
  ): Result

  events: {}
}

export interface PersonalSpaceAdminPluginSetup extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this
  attach(addressOrName: string): this
  deployed(): Promise<this>

  interface: PersonalSpaceAdminPluginSetupInterface

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
    decodeInstallationParams(
      _data: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<[string] & { initialEditor: string }>

    encodeInstallationParams(
      _initialEditor: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[string]>

    implementation(overrides?: CallOverrides): Promise<[string]>

    prepareInstallation(
      _dao: PromiseOrValue<string>,
      _data: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>

    prepareUninstallation(
      _dao: PromiseOrValue<string>,
      _payload: IPluginSetup.SetupPayloadStruct,
      overrides?: CallOverrides
    ): Promise<
      [PermissionLib.MultiTargetPermissionStructOutput[]] & {
        permissions: PermissionLib.MultiTargetPermissionStructOutput[]
      }
    >

    prepareUpdate(
      _dao: PromiseOrValue<string>,
      _currentBuild: PromiseOrValue<BigNumberish>,
      _payload: IPluginSetup.SetupPayloadStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>

    supportsInterface(
      _interfaceId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<[boolean]>
  }

  decodeInstallationParams(
    _data: PromiseOrValue<BytesLike>,
    overrides?: CallOverrides
  ): Promise<string>

  encodeInstallationParams(
    _initialEditor: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<string>

  implementation(overrides?: CallOverrides): Promise<string>

  prepareInstallation(
    _dao: PromiseOrValue<string>,
    _data: PromiseOrValue<BytesLike>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>

  prepareUninstallation(
    _dao: PromiseOrValue<string>,
    _payload: IPluginSetup.SetupPayloadStruct,
    overrides?: CallOverrides
  ): Promise<PermissionLib.MultiTargetPermissionStructOutput[]>

  prepareUpdate(
    _dao: PromiseOrValue<string>,
    _currentBuild: PromiseOrValue<BigNumberish>,
    _payload: IPluginSetup.SetupPayloadStruct,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>

  supportsInterface(
    _interfaceId: PromiseOrValue<BytesLike>,
    overrides?: CallOverrides
  ): Promise<boolean>

  callStatic: {
    decodeInstallationParams(
      _data: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<string>

    encodeInstallationParams(
      _initialEditor: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<string>

    implementation(overrides?: CallOverrides): Promise<string>

    prepareInstallation(
      _dao: PromiseOrValue<string>,
      _data: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<
      [string, IPluginSetup.PreparedSetupDataStructOutput] & {
        plugin: string
        preparedSetupData: IPluginSetup.PreparedSetupDataStructOutput
      }
    >

    prepareUninstallation(
      _dao: PromiseOrValue<string>,
      _payload: IPluginSetup.SetupPayloadStruct,
      overrides?: CallOverrides
    ): Promise<PermissionLib.MultiTargetPermissionStructOutput[]>

    prepareUpdate(
      _dao: PromiseOrValue<string>,
      _currentBuild: PromiseOrValue<BigNumberish>,
      _payload: IPluginSetup.SetupPayloadStruct,
      overrides?: CallOverrides
    ): Promise<
      [string, IPluginSetup.PreparedSetupDataStructOutput] & {
        initData: string
        preparedSetupData: IPluginSetup.PreparedSetupDataStructOutput
      }
    >

    supportsInterface(
      _interfaceId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<boolean>
  }

  filters: {}

  estimateGas: {
    decodeInstallationParams(
      _data: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<BigNumber>

    encodeInstallationParams(
      _initialEditor: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>

    implementation(overrides?: CallOverrides): Promise<BigNumber>

    prepareInstallation(
      _dao: PromiseOrValue<string>,
      _data: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>

    prepareUninstallation(
      _dao: PromiseOrValue<string>,
      _payload: IPluginSetup.SetupPayloadStruct,
      overrides?: CallOverrides
    ): Promise<BigNumber>

    prepareUpdate(
      _dao: PromiseOrValue<string>,
      _currentBuild: PromiseOrValue<BigNumberish>,
      _payload: IPluginSetup.SetupPayloadStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>

    supportsInterface(
      _interfaceId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<BigNumber>
  }

  populateTransaction: {
    decodeInstallationParams(
      _data: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>

    encodeInstallationParams(
      _initialEditor: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>

    implementation(overrides?: CallOverrides): Promise<PopulatedTransaction>

    prepareInstallation(
      _dao: PromiseOrValue<string>,
      _data: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>

    prepareUninstallation(
      _dao: PromiseOrValue<string>,
      _payload: IPluginSetup.SetupPayloadStruct,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>

    prepareUpdate(
      _dao: PromiseOrValue<string>,
      _currentBuild: PromiseOrValue<BigNumberish>,
      _payload: IPluginSetup.SetupPayloadStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>

    supportsInterface(
      _interfaceId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>
  }
}
