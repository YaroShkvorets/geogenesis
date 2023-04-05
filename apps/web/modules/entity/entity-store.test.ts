import { describe, expect, it } from 'vitest';

import { ActionsStore } from '../action';
import { MockNetworkData } from '../io';
import { createInitialDefaultTriples, EntityStore } from './entity-store/entity-store';

describe('EntityStore', () => {
  it('Initializes to defaults', async () => {
    const network = new MockNetworkData.MockNetwork();
    const store = new EntityStore({
      id: 'e',
      api: network,
      spaceId: 's',
      initialTriples: [],
      initialSchemaTriples: [],
      ActionsStore: new ActionsStore({ api: network }),
      initialBlockIdsTriple: null,
      initialBlockTriples: [],
    });

    const defaultTriples = createInitialDefaultTriples('s', 'e');

    const triples = store.triples$.get();

    expect(triples).toHaveLength(0);
    expect(triples).toStrictEqual([]);
    expect(store.schemaTriples$.get()[0]).toStrictEqual(defaultTriples[0]);
    expect(store.schemaTriples$.get()[1]).toStrictEqual(defaultTriples[1]);
    expect(store.schemaTriples$.get()[2]).toStrictEqual(defaultTriples[2]);
    expect(store.typeTriples$.get()).toStrictEqual([]);
  });

  it('Returns schema placeholders for text attributes', async () => {
    const typeTriple = MockNetworkData.makeStubTripleWithType('SomeTypeId');
    const textAttribute = MockNetworkData.makeStubTextAttribute('Nickname');
    const initialEntityStoreTriples = [typeTriple];

    const network = new MockNetworkData.MockNetwork({ triples: [textAttribute] });

    const store = new EntityStore({
      id: 'e',
      api: network,
      spaceId: 's',
      initialTriples: initialEntityStoreTriples,
      initialSchemaTriples: [],
      ActionsStore: new ActionsStore({ api: network }),
      initialBlockIdsTriple: null,
      initialBlockTriples: [],
    });

    expect(store.schemaTriples$.get()).toHaveLength(3);
    expect(store.schemaTriples$.get()[0].placeholder).toBeTruthy();
    expect(store.schemaTriples$.get()[0].value.type).toStrictEqual('string');
  });
});
