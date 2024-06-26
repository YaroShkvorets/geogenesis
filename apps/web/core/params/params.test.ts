import { describe, expect, it } from 'vitest';

import {
  parseEntityTableQueryFilterFromParams,
  parseTripleQueryFilterFromParams,
  stringifyQueryParameters,
} from './params';

describe('TripleStore params', () => {
  it('Parses triple store params from search params', () => {
    const params = parseTripleQueryFilterFromParams({
      query: 'banana',
      page: '1',
    });

    expect(params).toEqual({
      query: 'banana',
      pageNumber: 1,
      filterState: [],
    });
  });

  it('Parses triple store params from search params with no params', () => {
    const params = parseTripleQueryFilterFromParams({});
    expect(params).toEqual({
      query: '',
      pageNumber: 0,
      filterState: [],
    });
  });

  it('Stringifies triple store params to url', () => {
    const params = stringifyQueryParameters({
      query: 'banana',
      pageNumber: 1,
      filterState: [
        { field: 'attribute-id', value: 'banana' },
        { field: 'entity-id', value: 'banana' },
        { field: 'linked-to', value: 'banana' },
        { field: 'attribute-name', value: 'banana' },
        { field: 'value', value: 'banana' },
      ],
    });

    expect(params).toBe(
      'query=banana&page=1&attribute-id=banana&entity-id=banana&linked-to=banana&attribute-name=banana&value=banana'
    );
  });

  it('Stringifies triple store params for entity-name into the regular query param', () => {
    const params = stringifyQueryParameters({
      query: 'banana',
      pageNumber: 0,
      filterState: [{ field: 'entity-name', value: 'banana' }],
    });

    expect(params).toBe('query=banana');
  });

  it('Stringifies triple store params to url with empty query', () => {
    const params = stringifyQueryParameters({
      query: '',
      pageNumber: 0,
      filterState: [],
    });
    expect(params).toBe('');
  });
});

describe('EntityTableStore params', () => {
  it('Parses triple store params from search params', () => {
    const params = parseEntityTableQueryFilterFromParams({
      page: '1',
      typeId: 'banana',
      query: 'name',
    });

    expect(params).toEqual({
      query: 'name',
      pageNumber: 1,
      typeId: 'banana',
      filterState: [],
    });
  });

  it('Parses triple store params from search params with no params', () => {
    const params = parseEntityTableQueryFilterFromParams({});

    expect(params).toEqual({
      query: '',
      pageNumber: 0,
      typeId: '',
      filterState: [],
    });
  });
});
