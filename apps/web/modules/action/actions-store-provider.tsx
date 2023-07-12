import * as React from 'react';
import { createContext, useContext, useMemo } from 'react';

import { Services } from '../services';
import { ActionsStore } from './actions-store';

export const ActionsStoreContext = createContext<ActionsStore | undefined>(undefined);

interface Props {
  children: React.ReactNode;
}

export function ActionsStoreProvider({ children }: Props) {
  const { network } = Services.useServices();

  const store = useMemo(() => {
    return new ActionsStore({ api: network });
  }, [network]);

  return <ActionsStoreContext.Provider value={store}>{children}</ActionsStoreContext.Provider>;
}

export function useActionsStoreInstance() {
  const value = useContext(ActionsStoreContext);

  if (!value) {
    throw new Error(`Missing ActionsStoreProvider`);
  }

  return value;
}
