import styled from '@emotion/styled';
import { Log__factory } from '@geogenesis/contracts';
import debounce from 'lodash.debounce';
import { useState } from 'react';
import { useSigner } from 'wagmi';
import { TripleTable } from '~/modules/components/triple-table';
import { Button } from '~/modules/design-system/button';
import { Input } from '~/modules/design-system/input';
import { Spacer } from '~/modules/design-system/spacer';
import { Text } from '~/modules/design-system/text';
import { AddressLoader } from '~/modules/services/address-loader';
import { createEntityId, createTripleId } from '~/modules/services/create-id';
import { Network } from '~/modules/services/network';
import { StorageClient } from '~/modules/services/storage';
import { useTriples } from '~/modules/state/hook';
import { TripleStore } from '~/modules/state/triple-store';

const PageHeader = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
});

const PageContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
});

const tripleStore = new TripleStore({
  api: new Network(Log__factory, AddressLoader, StorageClient),
  initialtriples: [],
});

export default function Triples() {
  const { data: signer } = useSigner();
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const { triples, createTriple } = useTriples(tripleStore);

  const debouncedFilter = debounce(setGlobalFilter, 150);

  const onAddTriple = async () => {
    if (!signer) return;

    const entityId = createEntityId();
    const attributeId = 'Died in';
    const value = { type: 'string' as const, value: '0' };

    createTriple(
      {
        id: createTripleId(entityId, attributeId, value),
        entityId,
        attributeId,
        value,
      },
      signer
    );
  };

  return (
    <PageContainer>
      <PageHeader>
        <Text variant="largeTitle" as="h1">
          Facts
        </Text>
        <Button icon="create" onClick={onAddTriple}>
          Add
        </Button>
      </PageHeader>

      <Spacer height={12} />

      <Input placeholder="Search facts..." onChange={e => debouncedFilter(e.target.value)} />

      <Spacer height={12} />

      <TripleTable triples={triples} globalFilter={globalFilter} />
    </PageContainer>
  );
}
