/* Autogenerated file. Do not edit manually. */

/* tslint:disable */

/* eslint-disable */
import type { PromiseOrValue } from '../../common'
import type {
  TestMemberAccessExecuteCondition,
  TestMemberAccessExecuteConditionInterface,
} from '../../test/TestMemberAccessExecuteCondition'
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
    name: 'decodeAddRemoveMemberCalldata',
    outputs: [
      {
        internalType: 'bytes4',
        name: 'sig',
        type: 'bytes4',
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
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
  '0x608060405234801561001057600080fd5b506040516106af3803806106af83398101604081905261002f91610054565b600080546001600160a01b0319166001600160a01b0392909216919091179055610084565b60006020828403121561006657600080fd5b81516001600160a01b038116811461007d57600080fd5b9392505050565b61061c806100936000396000f3fe608060405234801561001057600080fd5b506004361061004c5760003560e01c806301ffc9a7146100515780630cbd17c8146100795780632675fdd0146100a55780632b7f520d146100b8575b600080fd5b61006461005f3660046102a7565b6100fd565b60405190151581526020015b60405180910390f35b61008c6100873660046103b8565b610134565b6040516001600160e01b03199091168152602001610070565b6100646100b3366004610411565b610141565b6100d56100c63660046103b8565b60208101516024820151915091565b604080516001600160e01b031990931683526001600160a01b03909116602083015201610070565b60006001600160e01b031982166302675fdd60e41b148061012e57506301ffc9a760e01b6001600160e01b03198316145b92915050565b600061012e826020015190565b604080516020601f84018190048102820181019092528281526000916331c6fcc960e21b9161018a9186908690819084018382808284376000920191909152506102a092505050565b6001600160e01b031916146101a157506000610297565b60006101b083600481876104ac565b8101906101bd91906104d6565b5091505080516001146101d4576000915050610297565b6000805482516001600160a01b039091169183916101f4576101f46105f9565b6020026020010151600001516001600160a01b031614610218576000915050610297565b600061024b82600081518110610230576102306105f9565b60200260200101516040015160208101516024909101519091565b5090506001600160e01b0319811663329b55b760e21b1480159061028057506001600160e01b0319811663058e524d60e11b14155b1561029057600092505050610297565b6001925050505b95945050505050565b6020015190565b6000602082840312156102b957600080fd5b81356001600160e01b0319811681146102d157600080fd5b9392505050565b634e487b7160e01b600052604160045260246000fd5b6040516060810167ffffffffffffffff81118282101715610311576103116102d8565b60405290565b604051601f8201601f1916810167ffffffffffffffff81118282101715610340576103406102d8565b604052919050565b600082601f83011261035957600080fd5b813567ffffffffffffffff811115610373576103736102d8565b610386601f8201601f1916602001610317565b81815284602083860101111561039b57600080fd5b816020850160208301376000918101602001919091529392505050565b6000602082840312156103ca57600080fd5b813567ffffffffffffffff8111156103e157600080fd5b6103ed84828501610348565b949350505050565b80356001600160a01b038116811461040c57600080fd5b919050565b60008060008060006080868803121561042957600080fd5b610432866103f5565b9450610440602087016103f5565b935060408601359250606086013567ffffffffffffffff8082111561046457600080fd5b818801915088601f83011261047857600080fd5b81358181111561048757600080fd5b89602082850101111561049957600080fd5b9699959850939650602001949392505050565b600080858511156104bc57600080fd5b838611156104c957600080fd5b5050820193919092039150565b6000806000606084860312156104eb57600080fd5b8335925060208085013567ffffffffffffffff8082111561050b57600080fd5b818701915087601f83011261051f57600080fd5b813581811115610531576105316102d8565b8060051b610540858201610317565b918252838101850191858101908b84111561055a57600080fd5b86860192505b838310156105e25782358581111561057757600080fd5b86016060818e03601f1901121561058d57600080fd5b6105956102ee565b6105a08983016103f5565b81526040820135898201526060820135878111156105be5760008081fd5b6105cc8f8b83860101610348565b6040830152508352509186019190860190610560565b989b989a5050505060409690960135955050505050565b634e487b7160e01b600052603260045260246000fdfea164736f6c6343000811000a'

type TestMemberAccessExecuteConditionConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>

const isSuperArgs = (
  xs: TestMemberAccessExecuteConditionConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1

export class TestMemberAccessExecuteCondition__factory extends ContractFactory {
  constructor(...args: TestMemberAccessExecuteConditionConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args)
    } else {
      super(_abi, _bytecode, args[0])
    }
  }

  override deploy(
    _targetContract: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<TestMemberAccessExecuteCondition> {
    return super.deploy(
      _targetContract,
      overrides || {}
    ) as Promise<TestMemberAccessExecuteCondition>
  }
  override getDeployTransaction(
    _targetContract: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(_targetContract, overrides || {})
  }
  override attach(address: string): TestMemberAccessExecuteCondition {
    return super.attach(address) as TestMemberAccessExecuteCondition
  }
  override connect(signer: Signer): TestMemberAccessExecuteCondition__factory {
    return super.connect(signer) as TestMemberAccessExecuteCondition__factory
  }

  static readonly bytecode = _bytecode
  static readonly abi = _abi
  static createInterface(): TestMemberAccessExecuteConditionInterface {
    return new utils.Interface(
      _abi
    ) as TestMemberAccessExecuteConditionInterface
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): TestMemberAccessExecuteCondition {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as TestMemberAccessExecuteCondition
  }
}
