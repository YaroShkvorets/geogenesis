'use client';

import { ObservableComputed, computed } from '@legendapp/state';
import { useSelector } from '@legendapp/state/react';
import { pipe } from '@mobily/ts-belt';

import * as React from 'react';
import { createContext, useContext, useMemo } from 'react';

import { ActionsStore } from '~/core/state/actions-store/actions-store';
import { Entity as IEntity, Triple as ITriple } from '~/core/types';
import { Action } from '~/core/utils/action';
import { Entity } from '~/core/utils/entity';
import { Triple } from '~/core/utils/triple';
import { makeOptionalComputed } from '~/core/utils/utils';

import { useActionsStoreInstance } from './actions-store/actions-store-provider';

export class LocalStore {
  private store: ActionsStore;
  triples$: ObservableComputed<ITriple[]>;
  triplesByEntityId$: ObservableComputed<Record<string, ITriple[]>>;
  unpublishedTriples$: ObservableComputed<ITriple[]>;
  entities$: ObservableComputed<IEntity[]>;
  unpublishedEntities$: ObservableComputed<IEntity[]>;
  spaces$: ObservableComputed<string[]>;
  unpublishedSpaces$: ObservableComputed<string[]>;

  constructor({ store }: { store: ActionsStore }) {
    this.store = store;

    this.triples$ = makeOptionalComputed(
      [],
      computed(() => {
        const allActions = this.store.allActions$.get();
        const triples = Triple.fromActions(allActions, []);
        return Triple.withLocalNames(allActions, triples);
      })
    );

    this.triplesByEntityId$ = makeOptionalComputed(
      {} as Record<string, ITriple[]>,
      computed(() => {
        const triples = this.triples$.get();

        return triples.reduce<Record<string, ITriple[]>>((acc, triple) => {
          if (!acc[triple.entityId]) acc[triple.entityId] = [];

          // Have to this wonky defensive coding because TypeScript does not type
          // narrow when using noUncheckedIndexedAccess
          acc[triple.entityId] = acc[triple.entityId]?.concat([triple]) ?? [];
          return acc;
        }, {});
      })
    );

    this.entities$ = makeOptionalComputed(
      [],
      computed(() => {
        return pipe(this.triples$.get(), triples => Entity.entitiesFromTriples(triples));
      })
    );

    this.spaces$ = makeOptionalComputed(
      [],
      computed(() => {
        const allSpaces = this.triples$.get().map(t => t.space);
        return [...new Set(allSpaces)];
      })
    );

    this.unpublishedTriples$ = makeOptionalComputed(
      [],
      computed(() => {
        const allActions = this.store.allActions$.get();
        const unpublishedActions = Action.unpublishedChanges(allActions);
        const triples = Triple.fromActions(unpublishedActions, []);
        return Triple.withLocalNames(allActions, triples);
      })
    );

    this.unpublishedEntities$ = makeOptionalComputed(
      [],
      computed(() => {
        return pipe(this.triples$.get(), triples => Entity.entitiesFromTriples(triples));
      })
    );

    this.unpublishedSpaces$ = makeOptionalComputed(
      [],
      computed(() => {
        const allSpaces = this.unpublishedTriples$.get().map(t => t.space);
        return [...new Set(allSpaces)];
      })
    );
  }
}

const LocalStoreContext = createContext<LocalStore | undefined>(undefined);

interface Props {
  children: React.ReactNode;
}

export function LocalStoreProvider({ children }: Props) {
  const ActionsStore = useActionsStoreInstance();

  const store = useMemo(() => {
    return new LocalStore({ store: ActionsStore });
  }, [ActionsStore]);

  return <LocalStoreContext.Provider value={store}>{children}</LocalStoreContext.Provider>;
}

export function useLocalStoreInstance() {
  const value = useContext(LocalStoreContext);

  if (!value) {
    throw new Error(`Missing LocalStoreProvider`);
  }

  return value;
}

export function useLocalStore() {
  const {
    entities$,
    triples$,
    spaces$,
    unpublishedEntities$,
    unpublishedSpaces$,
    unpublishedTriples$,
    triplesByEntityId$,
  } = useLocalStoreInstance();

  const entities = useSelector(entities$);
  const triples = useSelector(triples$);
  const triplesByEntityId = useSelector(triplesByEntityId$);
  const unpublishedEntities = useSelector(unpublishedEntities$);
  const unpublishedTriples = useSelector(unpublishedTriples$);
  const spaces = useSelector(spaces$);
  const unpublishedSpaces = useSelector(unpublishedSpaces$);

  return {
    entities,
    triples,
    triplesByEntityId,
    unpublishedEntities,
    unpublishedTriples,
    spaces,
    unpublishedSpaces,
  };
}
