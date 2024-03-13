/* Autogenerated file. Do not edit manually. */

/* tslint:disable */

/* eslint-disable */
import type {
  MemberAccessExecuteCondition,
  MemberAccessExecuteConditionInterface,
} from '../MemberAccessExecuteCondition'
import type { PromiseOrValue } from '../common'
import type { Provider, TransactionRequest } from '@ethersproject/providers'
import { Signer, utils, Contract, ContractFactory, Overrides } from 'ethers'

const _abi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_targetContract',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: '_data',
        type: 'bytes',
      },
    ],
    name: 'decodeGrantRevokeCalldata',
    outputs: [
      {
        internalType: 'bytes4',
        name: 'sig',
        type: 'bytes4',
      },
      {
        internalType: 'address',
        name: 'where',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'who',
        type: 'address',
      },
      {
        internalType: 'bytes32',
        name: 'permissionId',
        type: 'bytes32',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: '_data',
        type: 'bytes',
      },
    ],
    name: 'getSelector',
    outputs: [
      {
        internalType: 'bytes4',
        name: 'selector',
        type: 'bytes4',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_where',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_who',
        type: 'address',
      },
      {
        internalType: 'bytes32',
        name: '_permissionId',
        type: 'bytes32',
      },
      {
        internalType: 'bytes',
        name: '_data',
        type: 'bytes',
      },
    ],
    name: 'isGranted',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes4',
        name: '_interfaceId',
        type: 'bytes4',
      },
    ],
    name: 'supportsInterface',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const

const _bytecode =
  '0x608060405234801561001057600080fd5b5060405161071038038061071083398101604081905261002f91610054565b600080546001600160a01b0319166001600160a01b0392909216919091179055610084565b60006020828403121561006657600080fd5b81516001600160a01b038116811461007d57600080fd5b9392505050565b61067d806100936000396000f3fe608060405234801561001057600080fd5b506004361061004c5760003560e01c806301ffc9a7146100515780630cbd17c8146100795780632675fdd0146100a757806375a5b2b2146100ba575b600080fd5b61006461005f3660046102fb565b61012a565b60405190151581526020015b60405180910390f35b61008e61008736600461040c565b6020015190565b6040516001600160e01b03199091168152602001610070565b6100646100b5366004610472565b610161565b6100e56100c836600461040c565b602081015160248201516044830151606490930151919390929190565b604080516001600160e01b031995909516855273ffffffffffffffffffffffffffffffffffffffff938416602086015291909216908301526060820152608001610070565b60006001600160e01b031982166302675fdd60e41b148061015b57506301ffc9a760e01b6001600160e01b03198316145b92915050565b604080516020601f84018190048102820181019092528281526000916331c6fcc960e21b916101aa91869086908190840183828082843760009201919091525061008792505050565b6001600160e01b031916146101c1575060006102f2565b60006101d0836004818761050d565b8101906101dd9190610537565b5091505080516001146101f45760009150506102f2565b60008060006102388460008151811061020f5761020f61065a565b602002602001015160400151602081015160248201516044830151606490930151919390929190565b929550909350909150506001600160e01b031983166335a2eb4b60e21b1480159061027457506001600160e01b03198316633658153160e21b14155b156102865760009450505050506102f2565b60005473ffffffffffffffffffffffffffffffffffffffff8381169116146102b55760009450505050506102f2565b7f6fd388bae34ebf69f2f68ae03174c1b3616db3ac7aecc5ce2f8578586736532481146102e95760009450505050506102f2565b60019450505050505b95945050505050565b60006020828403121561030d57600080fd5b81356001600160e01b03198116811461032557600080fd5b9392505050565b634e487b7160e01b600052604160045260246000fd5b6040516060810167ffffffffffffffff811182821017156103655761036561032c565b60405290565b604051601f8201601f1916810167ffffffffffffffff811182821017156103945761039461032c565b604052919050565b600082601f8301126103ad57600080fd5b813567ffffffffffffffff8111156103c7576103c761032c565b6103da601f8201601f191660200161036b565b8181528460208386010111156103ef57600080fd5b816020850160208301376000918101602001919091529392505050565b60006020828403121561041e57600080fd5b813567ffffffffffffffff81111561043557600080fd5b6104418482850161039c565b949350505050565b803573ffffffffffffffffffffffffffffffffffffffff8116811461046d57600080fd5b919050565b60008060008060006080868803121561048a57600080fd5b61049386610449565b94506104a160208701610449565b935060408601359250606086013567ffffffffffffffff808211156104c557600080fd5b818801915088601f8301126104d957600080fd5b8135818111156104e857600080fd5b8960208285010111156104fa57600080fd5b9699959850939650602001949392505050565b6000808585111561051d57600080fd5b8386111561052a57600080fd5b5050820193919092039150565b60008060006060848603121561054c57600080fd5b8335925060208085013567ffffffffffffffff8082111561056c57600080fd5b818701915087601f83011261058057600080fd5b8135818111156105925761059261032c565b8060051b6105a185820161036b565b918252838101850191858101908b8411156105bb57600080fd5b86860192505b83831015610643578235858111156105d857600080fd5b86016060818e03601f190112156105ee57600080fd5b6105f6610342565b610601898301610449565b815260408201358982015260608201358781111561061f5760008081fd5b61062d8f8b8386010161039c565b60408301525083525091860191908601906105c1565b989b989a5050505060409690960135955050505050565b634e487b7160e01b600052603260045260246000fdfea164736f6c6343000811000a'

type MemberAccessExecuteConditionConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>

const isSuperArgs = (
  xs: MemberAccessExecuteConditionConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1

export class MemberAccessExecuteCondition__factory extends ContractFactory {
  constructor(...args: MemberAccessExecuteConditionConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args)
    } else {
      super(_abi, _bytecode, args[0])
    }
  }

  override deploy(
    _targetContract: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<MemberAccessExecuteCondition> {
    return super.deploy(
      _targetContract,
      overrides || {}
    ) as Promise<MemberAccessExecuteCondition>
  }
  override getDeployTransaction(
    _targetContract: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(_targetContract, overrides || {})
  }
  override attach(address: string): MemberAccessExecuteCondition {
    return super.attach(address) as MemberAccessExecuteCondition
  }
  override connect(signer: Signer): MemberAccessExecuteCondition__factory {
    return super.connect(signer) as MemberAccessExecuteCondition__factory
  }

  static readonly bytecode = _bytecode
  static readonly abi = _abi
  static createInterface(): MemberAccessExecuteConditionInterface {
    return new utils.Interface(_abi) as MemberAccessExecuteConditionInterface
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): MemberAccessExecuteCondition {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as MemberAccessExecuteCondition
  }
}
