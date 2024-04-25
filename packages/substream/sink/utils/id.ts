export function generateTripleId({
  space_id,
  entity_id,
  attribute_id,
  value_id,
}: {
  space_id: string;
  entity_id: string;
  attribute_id: string;
  value_id: string;
}): string {
  return `${space_id}:${entity_id}:${attribute_id}:${value_id}`;
}

export function generateActionId({
  space_id,
  entity_id,
  attribute_id,
  value_id,
  cursor,
}: {
  space_id: string;
  entity_id: string;
  attribute_id: string;
  value_id: string;
  cursor: string;
}): string {
  return `${space_id}:${entity_id}:${attribute_id}:${value_id}:${cursor}}`;
}

// @TODO: Deterministic version that maps to proposal
export function generateVersionId({
  entryIndex,
  entityId,
  cursor,
}: {
  entryIndex: number;
  entityId: string;
  cursor: string;
}): string {
  return `${entryIndex}:${entityId}:${cursor}`;
}
