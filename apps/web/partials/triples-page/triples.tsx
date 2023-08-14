import * as React from 'react';

import { useTriples } from '~/core/hooks/use-triples';
import { Triple } from '~/core/types';

import { Spacer } from '~/design-system/spacer';
import { PageContainer, PageNumberContainer } from '~/design-system/table/styles';
import { NextButton, PageNumber, PreviousButton } from '~/design-system/table/table-pagination';
import { Text } from '~/design-system/text';

import { TripleInput } from './triple-input';
import { TripleTable } from './triple-table';

interface Props {
  spaceId: string;
  initialTriples: Triple[];
}

export function Triples({ spaceId, initialTriples }: Props) {
  const tripleStore = useTriples();

  return (
    <PageContainer>
      <Spacer height={20} />

      <TripleInput />

      <Spacer height={12} />

      <TripleTable space={spaceId} triples={tripleStore.hydrated ? tripleStore.triples : initialTriples} />

      <Spacer height={12} />

      <PageNumberContainer>
        {tripleStore.pageNumber > 1 && (
          <>
            <PageNumber number={1} onClick={() => tripleStore.setPageNumber(0)} />
            {tripleStore.pageNumber > 2 ? (
              <>
                <Spacer width={16} />
                <Text color="grey-03" variant="metadataMedium">
                  ...
                </Text>
                <Spacer width={16} />
              </>
            ) : (
              <Spacer width={4} />
            )}
          </>
        )}
        {tripleStore.hasPreviousPage && (
          <>
            <PageNumber number={tripleStore.pageNumber} onClick={tripleStore.setPreviousPage} />
            <Spacer width={4} />
          </>
        )}
        <PageNumber isActive number={tripleStore.pageNumber + 1} />
        {tripleStore.hasNextPage && (
          <>
            <Spacer width={4} />
            <PageNumber number={tripleStore.pageNumber + 2} onClick={tripleStore.setNextPage} />
          </>
        )}
        <Spacer width={32} />
        <PreviousButton isDisabled={!tripleStore.hasPreviousPage} onClick={tripleStore.setPreviousPage} />
        <Spacer width={12} />
        <NextButton isDisabled={!tripleStore.hasNextPage} onClick={tripleStore.setNextPage} />
      </PageNumberContainer>
    </PageContainer>
  );
}