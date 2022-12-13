import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { memo, useEffect, useMemo, useState } from 'react';
import { Chip } from '../design-system/chip';
import { Text } from '../design-system/text';
import { createTripleWithId } from '../services/create-id';
import { useEditable } from '../state/use-editable';
import { EntityGroup, EntityNames, Triple, Value } from '../types';
import { navUtils } from '../utils';
import { TableCell } from './table/cell';
import { CellEditableInput } from './table/cell-editable-input';
import { ChipCellContainer, Container, EmptyTableText, Table, TableHeader, TableRow } from './table/styles';

const columnHelper = createColumnHelper<EntityGroup>();

// Table width, minus cell borders
const COLUMN_SIZE = 1200 / 3;

const getColumns = (entitySchema: string[], entityNames: EntityNames) => {
  const columns = entitySchema.map(attributeId => {
    /*
      Might be worth restructuring EntityGroup to be have a map of triples by attributeId instead of an array.
      This would allow us to use the columnHelper.accessor function to easily get the value rather than having to
      do a find on the array.
    */
    return columnHelper.accessor(row => row.triples.find(triple => triple.attributeId === attributeId)?.value, {
      id: attributeId,
      header: () => <Text variant="smallTitle">{entityNames[attributeId] || attributeId}</Text>,
      size: COLUMN_SIZE,
    });
  });

  return columns;
};

// Give our default column cell renderer editing superpowers!
const defaultColumn: Partial<ColumnDef<EntityGroup>> = {
  cell: ({ getValue, row, column: { id }, table, cell }) => {
    const space = table.options.meta!.space;
    const entityNames = table.options?.meta?.entityNames || {};

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { editable } = useEditable();

    const initialCellData = getValue();
    // We need to keep and update the state of the cell normally
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [cellData, setCellData] = useState<string | Value | unknown>(initialCellData);

    // When the input is blurred, we'll call our table meta's updateData function
    const onBlur = () => table.options.meta?.updateData(row.index, id, cellData);

    // If the initialValue is changed external, sync it up with our state
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      setCellData(initialCellData);
    }, [initialCellData]);

    const cellId = `${row.original.id}-${cell.column.id}`;

    const value = cellData as Value;

    if (!value) {
      return null;
    } else if (value.type === 'entity') {
      return (
        <ChipCellContainer>
          <Chip href={navUtils.toEntity(space, value.id)}>{entityNames[value.id] || value.id}</Chip>
        </ChipCellContainer>
      );
    }

    return (
      <CellEditableInput
        isExpanded={table.options?.meta?.expandedCells[cellId]}
        placeholder="Add text..."
        isEditable={editable}
        value={value.value}
        onChange={e =>
          setCellData({
            id: value.id,
            type: 'string',
            value: e.target.value,
          })
        }
        onBlur={onBlur}
      />
    );
  },
};

interface Props {
  update: (triple: Triple, oldTriple: Triple) => void;
  entityGroups: EntityGroup[];
  space: string;
  entityNames: EntityNames;
  entitySchema: string[];
}

export const EntityTable = memo(function TripleTable({
  update,
  entityGroups,
  entityNames,
  space,
  entitySchema,
}: Props) {
  const [expandedCells, setExpandedCells] = useState<Record<string, boolean>>({});
  const { editable } = useEditable();

  const columns = useMemo(() => getColumns(entitySchema, entityNames), [entitySchema, entityNames]);

  const table = useReactTable({
    data: entityGroups,
    columns,
    defaultColumn,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination: {
        pageIndex: 0,
        pageSize: 100,
      },
    },
    meta: {
      updateData: (rowIndex, columnId, cellValue) => {
        return null;
        const oldEntityId = triples[rowIndex].entityId;
        const oldAttributeId = triples[rowIndex].attributeId;
        const oldValue = triples[rowIndex].value;

        const isEntityIdColumn = columnId === 'entityId';
        const isAttributeColumn = columnId === 'attributeId';
        const isValueColumn = columnId === 'value';

        // TODO: Is this a bug? entityId might be the name instead of the entityId
        const entityId = isEntityIdColumn ? (cellValue as Triple['entityId']) : oldEntityId;
        const attributeId = isAttributeColumn ? (cellValue as Triple['attributeId']) : oldAttributeId;
        const value = isValueColumn ? (cellValue as Triple['value']) : oldValue;

        const newTriple = createTripleWithId(space, entityId, attributeId, value);
        update(newTriple, triples[rowIndex]);
      },
      entityNames,
      expandedCells,
      space,
    },
  });

  return (
    <Container>
      <Table cellSpacing={0} cellPadding={0}>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <TableHeader width={header.column.getSize()} key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </TableHeader>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.length === 0 && (
            <tr style={{ textAlign: 'center' }}>
              <td />
              <EmptyTableText>No results found</EmptyTableText>
              <td />
            </tr>
          )}
          {table.getRowModel().rows.map(row => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map(cell => {
                const cellId = `${row.original.id}-${cell.column.id}`;

                return (
                  <TableCell
                    isEditable={editable}
                    isExpandable={cell.column.id === 'value' && (cell.getValue() as Value).type === 'string'}
                    isExpanded={expandedCells[cellId]}
                    width={cell.column.getSize()}
                    key={cell.id}
                    toggleExpanded={() =>
                      setExpandedCells(prev => ({
                        ...prev,
                        [cellId]: !prev[cellId],
                      }))
                    }
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </tbody>
      </Table>
    </Container>
  );
});
