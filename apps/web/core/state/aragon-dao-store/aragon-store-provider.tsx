'use client';

import { Client, Context, ContextParams, TokenVotingClient } from '@aragon/sdk-client';

import * as React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

import { useNetwork } from 'wagmi';

import { GeoPluginContext } from '~/core/governance-space-plugin';
import { GeoPluginClient } from '~/core/governance-space-plugin/client';
import { useEthersSigner } from '~/core/wallet/ethers-adapters';

export interface AragonSDKContextValue {
  context?: Context;
  baseClient?: Client;
  GeoPluginClient?: GeoPluginClient;
}

const AragonSDKContext = createContext({});

export const AragonSDKProvider = ({ children }: { children: React.ReactNode }) => {
  const [context, setContext] = useState<Context | undefined>(undefined);
  const { chain } = useNetwork();
  const ethersSigner = useEthersSigner({ chainId: chain?.id || 5 });
  // const [geoPluginClient, setGeoPluginClient] = useState<GeoPluginClient | undefined>(undefined);

  // @TODO use our Environment.options here once we finalize -- don't want to add Goerli to Environment.options if we don't need to
  useEffect(() => {
    const aragonSDKContextParams: ContextParams = {
      network: 'goerli', // mainnet, mumbai, etc
      signer: ethersSigner,
      daoFactoryAddress: '0x1E4350A3c9aFbDbd70FA30B9B2350B9E8182449a',
      web3Providers: ['https://rpc.ankr.com/eth_goerli'], // feel free to use the provider of your choosing: Alchemy, Infura, etc.
      ipfsNodes: [
        {
          url: 'https://testing-ipfs-0.aragon.network/api/v0',
          // headers: { 'X-API-KEY': process.env.NEXT_PUBLIC_IPFS_KEY || '' }, // make sure you have the key for your IPFS node within your .env file
          headers: { 'X-API-KEY': 'b477RhECf8s8sdM7XrkLBs2wHc4kCMwpbcFC55Kt' }, // provided by aragon for testing
        },
      ],
      graphqlNodes: [
        {
          url: 'https://subgraph.satsuma-prod.com/aragon/osx-goerli/api', // this'll be the subgraph for the dao
        },
      ],
    };

    const contextInstance = new Context(aragonSDKContextParams);
    const geoPluginContextInstance = new GeoPluginContext();

    setContext(contextInstance);
    const tokenVotingClient = new TokenVotingClient(contextInstance);
    const geoPluginClient = new GeoPluginClient(geoPluginContextInstance);
    console.log('token voting', tokenVotingClient);
    console.log('geo plugin', geoPluginClient);

    // setBaseClient(new Client(contextInstance));
    // setTokenVotingClient(new TokenVotingClient(contextPlugin));
  }, [ethersSigner]);

  return <AragonSDKContext.Provider value={{ context }}>{children}</AragonSDKContext.Provider>;
};

export const useAragonSDKContext = () => {
  const value = useContext(AragonSDKContext);

  if (!value) {
    throw new Error('useAragonSDKContext must be used within a AragonSDKProvider');
  }
  return useContext(AragonSDKContext);
};
