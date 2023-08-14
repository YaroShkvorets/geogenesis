import { WalletClient } from 'wagmi';

import { Storage } from '../storage';
import { PublishOptions } from './publish';

export interface IPublish {
  publish: (options: PublishOptions) => Promise<void>;
  uploadFile(storageClient: Storage.IStorageClient, file: File): Promise<string>;
  getRole(spaceId: string, role: 'EDITOR_ROLE' | 'ADMIN_ROLE' | 'EDITOR_CONTROLLER_ROLE'): Promise<string>;
  grantRole(options: { spaceId: string; wallet: WalletClient; role: string; userAddress: string }): Promise<string>;
  revokeRole(options: { spaceId: string; wallet: WalletClient; role: string; userAddress: string }): Promise<string>;
}