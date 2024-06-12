'use client';

import * as React from 'react';

import { Entities } from '~/core/utils/entity';
import { Triples } from '~/core/utils/triples';

import { useActionsStore } from '../hooks/use-actions-store';

export function useLocalStore() {
  const { allActions } = useActionsStore();

  const triples = React.useMemo(() => {
    return Triples.withLocalNames(allActions, allActions);
  }, [allActions]);

  const entities = React.useMemo(() => {
    return Entities.entitiesFromTriples(triples);
  }, [triples]);

  return {
    triples,
    entities,
  };
}
