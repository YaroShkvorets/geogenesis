import styled from '@emotion/styled';
import { useRef } from 'react';
import { CheckCloseSmall } from '../../design-system/icons/check-close-small';
import { Search } from '../../design-system/icons/search';
import { Input } from '../../design-system/input';
import { Spacer } from '../../design-system/spacer';
import { useTables } from '../../state/use-tables';
import { FilterClause } from '../../types';

const SearchIconContainer = styled.div(props => ({
  position: 'absolute',
  left: props.theme.space * 3,
  top: props.theme.space * 2.5,
  zIndex: 100,
}));

const FilterIconContainer = styled.div(props => ({
  display: 'flex',
  alignItems: 'center',
  backgroundColor: props.theme.colors.white,
  border: `1px solid ${props.theme.colors['grey-02']}`,
  borderLeft: 'none',
  color: props.theme.colors['grey-04'],
}));

const PresetIconContainer = styled(FilterIconContainer)<{ showPredefinedQueries: boolean }>(props => ({
  cursor: 'pointer',
  borderRadius: `0 ${props.theme.radius}px ${props.theme.radius}px 0`,
  backgroundColor: props.showPredefinedQueries ? props.theme.colors['grey-01'] : props.theme.colors.white,
  borderLeft: 'none',
  transition: 'colors 0.15s ease-in-out',
  color: props.theme.colors['grey-04'],

  '&:hover': {
    color: props.theme.colors.text,
    backgroundColor: props.theme.colors['grey-01'],
  },

  button: {
    padding: `${props.theme.space * 2.5}px ${props.theme.space * 3}px`,
    color: props.showPredefinedQueries ? props.theme.colors.text : props.theme.colors['grey-04'],

    '&:active': {
      color: props.theme.colors.text,
      outlineColor: props.theme.colors.ctaPrimary,
    },

    '&:focus': {
      color: props.theme.colors.text,
      outlineColor: props.theme.colors.ctaPrimary,
    },
  },
}));

const InputContainer = styled.div({
  overflow: 'hidden',
  display: 'flex',
  width: '100%',
  position: 'relative',
});

const TriplesInputField = styled(Input)(props => ({
  width: '100%',
  borderRadius: `${props.theme.radius}px 0 0 ${props.theme.radius}px`,
  paddingLeft: props.theme.space * 10,
}));

const AdvancedFilters = styled.div(props => ({
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  gap: props.theme.space,
  width: '100%',
  borderRadius: `${props.theme.radius}px 0 0 ${props.theme.radius}px`,
  boxShadow: `inset 0 0 0 1px ${props.theme.colors['grey-02']}`,
  paddingLeft: props.theme.space * 10,
  backgroundColor: props.theme.colors.white,
}));

export function EntityInput() {
  const tableStore = useTables();
  const inputContainerRef = useRef<HTMLDivElement>(null);
  const showBasicFilter = tableStore.filterState.length === 1 && tableStore.filterState[0].field === 'entity-name';

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    tableStore.setQuery(event.target.value);
  };

  const onAdvancedFilterClick = (field: FilterClause['field']) => {
    const filteredFilters = tableStore.filterState.filter(filter => filter.field !== field);
    tableStore.setFilterState(filteredFilters);
  };

  return (
    <InputContainer ref={inputContainerRef}>
      <SearchIconContainer>
        <Search />
      </SearchIconContainer>
      {showBasicFilter ? (
        <TriplesInputField
          disabled={true}
          placeholder="Search entities..."
          value={tableStore.query}
          onChange={onChange}
        />
      ) : (
        <AdvancedFilters>
          {tableStore.filterState.map(filter => (
            <AdvancedFilterPill
              key={filter.field}
              filterClause={filter}
              onClick={() => onAdvancedFilterClick(filter.field)}
            />
          ))}
        </AdvancedFilters>
      )}
      {/* <FilterIconContainer>
        <FilterDialog
          inputContainerWidth={inputRect?.width || 578}
          filterState={tableStore.filterState}
          setFilterState={tableStore.setFilterState}
        />
      </FilterIconContainer> */}
    </InputContainer>
  );
}

const AdvancedFilterPillContainer = styled.button(props => ({
  ...props.theme.typography.metadataMedium,
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  display: 'flex',
  alignItems: 'center',
  padding: `${props.theme.space}px ${props.theme.space * 2}px`,
  borderRadius: props.theme.space,
  backgroundColor: props.theme.colors.white,
  boxShadow: `inset 0 0 0 1px ${props.theme.colors['grey-02']}`,

  '&:hover': {
    backgroundColor: props.theme.colors.bg,
    boxShadow: `inset 0 0 0 1px ${props.theme.colors.text}`,
    cursor: 'pointer',
  },

  '&:focus': {
    backgroundColor: props.theme.colors.bg,
    boxShadow: `inset 0 0 0 2px ${props.theme.colors.text}`,
    outline: 'none',
  },
}));

interface AdvancedFilterPillprops {
  filterClause: FilterClause;
  onClick: () => void;
}

function getFilterLabel(field: FilterClause['field']) {
  switch (field) {
    case 'entity-id':
      return 'Entity ID is';
    case 'entity-name':
      return 'Entity name contains';
    case 'attribute-name':
      return 'Attribute name contains';
    case 'attribute-id':
      return 'Attribute ID is';
    case 'value':
      return 'Value contains';
    case 'linked-to':
      return 'Entity contains reference to';
  }
}

function AdvancedFilterPill({ filterClause, onClick }: AdvancedFilterPillprops) {
  const { field, value } = filterClause;
  const label = getFilterLabel(field);

  return (
    <AdvancedFilterPillContainer onClick={onClick}>
      {label} {value}
      <Spacer width={8} />
      <CheckCloseSmall />
    </AdvancedFilterPillContainer>
  );
}
