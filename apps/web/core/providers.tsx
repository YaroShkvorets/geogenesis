'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Provider } from 'react-redux';

import * as React from 'react';

import { Services } from './services';
import { ActionsStoreProvider } from './state/actions-store';
import { DiffProvider } from './state/diff-store/diff-store';
import { LocalStoreProvider } from './state/local-store';
import { store } from './state/root-store';
import { WalletProvider } from './wallet';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        <Services.Provider>
          <ActionsStoreProvider>
            <LocalStoreProvider>
              <Provider store={store}>
                <DiffProvider>{children}</DiffProvider>
              </Provider>
            </LocalStoreProvider>
          </ActionsStoreProvider>
        </Services.Provider>
      </WalletProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
