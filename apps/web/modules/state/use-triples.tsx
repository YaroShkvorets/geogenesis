import { useSelector } from '@legendapp/state/react';
import { useTripleStore } from '../services';

export const useTriples = () => {
  const {
    create,
    update,
    publish,
    triples$,
    actions$,
    entityNames$,
    setQuery,
    setPageNumber,
    setNextPage,
    setPreviousPage,
    pageNumber$,
    hasPreviousPage$,
    hasNextPage$,
  } = useTripleStore();
  const triples = useSelector(triples$);
  const actions = useSelector(actions$);
  const entityNames = useSelector(entityNames$);
  const pageNumber = useSelector(pageNumber$);
  const hasPreviousPage = useSelector(hasPreviousPage$);
  const hasNextPage = useSelector(hasNextPage$);

  return {
    triples,
    actions,
    entityNames,
    create,
    update,
    publish,
    setQuery,
    setPageNumber,
    setNextPage,
    setPreviousPage,
    pageNumber,
    hasPreviousPage,
    hasNextPage,
  };
};