'use client';

import { useSelector } from '@legendapp/state/react';

import { useEntityTableStoreInstance } from '../state/entity-table-store';

export const useEntityTable = () => {
  const {
    rows$,
    query$,
    setQuery,
    setPageNumber,
    setNextPage,
    setSelectedType,
    setPreviousPage,
    pageNumber$,
    hasPreviousPage$,
    hasNextPage$,
    hydrated$,
    selectedType$,
    columns$,
    unpublishedColumns$,
    createForeignType,
    createType,
    columnRelationTypes$,
  } = useEntityTableStoreInstance();
  const rows = useSelector(rows$);
  const columns = useSelector(columns$);
  const hydrated = useSelector(hydrated$);
  const selectedType = useSelector(selectedType$);
  const pageNumber = useSelector(pageNumber$);
  const hasPreviousPage = useSelector(hasPreviousPage$);
  const unpublishedColumns = useSelector(unpublishedColumns$);
  const hasNextPage = useSelector(hasNextPage$);
  const query = useSelector(query$);
  const columnRelationTypes = useSelector(columnRelationTypes$);

  return {
    rows,
    columns,
    unpublishedColumns,
    query,
    hydrated,
    selectedType,
    setQuery,
    setPageNumber,
    setNextPage,
    setPreviousPage,
    setSelectedType,
    pageNumber,
    hasPreviousPage,
    hasNextPage,
    createType,
    createForeignType,
    columnRelationTypes,
  };
};