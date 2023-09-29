import { SYSTEM_IDS } from '@geogenesis/ids';
import { batch } from '@legendapp/state';
import { Editor, JSONContent, generateHTML } from '@tiptap/core';
import pluralize from 'pluralize';
import showdown from 'showdown';

import * as React from 'react';

import { TableBlockSdk } from '~/core/blocks-sdk';
import { useActionsStore } from '~/core/hooks/use-actions-store';
import { ID } from '~/core/id';
import { CreateTripleAction, EditTripleAction, EntityValue, Triple as ITriple } from '~/core/types';
import { Triple } from '~/core/utils/triple';
import { Value } from '~/core/utils/value';

import { tiptapExtensions } from '~/partials/editor/editor';
import { htmlToPlainText } from '~/partials/editor/editor-utils';

const markdownConverter = new showdown.Converter();

// Returns the id of the first paragraph even if nested inside of a list
function getNodeId(node: JSONContent) {
  return node.attrs?.id ?? node?.content?.[0]?.content?.[0]?.attrs?.id;
}

function getBlockTypeValue(nodeType?: string): EntityValue {
  switch (nodeType) {
    case 'paragraph':
      return { id: SYSTEM_IDS.TEXT_BLOCK, type: 'entity', name: 'Text Block' };
    case 'image':
      return { id: SYSTEM_IDS.IMAGE_BLOCK, type: 'entity', name: 'Image Block' };
    case 'tableNode':
      return { id: SYSTEM_IDS.TABLE_BLOCK, type: 'entity', name: 'Table Block' };
    default:
      return { id: SYSTEM_IDS.TEXT_BLOCK, type: 'entity', name: 'Text Block' };
  }
}

function getTextNodeHtml(node: JSONContent) {
  return generateHTML({ type: 'doc', content: [node] }, tiptapExtensions);
}

function getNodeName(node: JSONContent) {
  const isTableNode = node.type === 'tableNode';

  if (isTableNode) {
    return `${pluralize(node.attrs?.typeName, 2, false)}`;
  }

  const nodeHTML = getTextNodeHtml(node);
  const nodeNameLength = 20;
  return htmlToPlainText(nodeHTML).slice(0, nodeNameLength);
}

function getBlockTypeTriple({
  node,
  existingBlockTypeTriple,
  spaceId,
}: {
  node: JSONContent;
  existingBlockTypeTriple: ITriple | null;
  spaceId: string;
}): CreateTripleAction | null {
  const blockEntityId = getNodeId(node);
  const entityName = getNodeName(node);

  const blockTypeValue: EntityValue = getBlockTypeValue(node.type);

  if (!existingBlockTypeTriple) {
    return {
      type: 'createTriple',
      ...Triple.withId({
        space: spaceId,
        entityId: blockEntityId,
        entityName: entityName,
        attributeId: SYSTEM_IDS.TYPES,
        attributeName: 'Types',
        value: blockTypeValue,
      }),
    };
  }

  return null;
}

function getNewTableBlockMetadataTriples({
  node,
  spaceId,
  existingFilterTriple,
  existingRowTypeTriple,
}: {
  node: JSONContent;
  spaceId: string;
  existingRowTypeTriple: ITriple | null;
  existingFilterTriple: ITriple | null;
}): {
  rowTypeTriple: CreateTripleAction | null;
  filterTriple: CreateTripleAction | null;
} {
  const blockEntityId = getNodeId(node);
  const rowTypeEntityId = node.attrs?.typeId;
  const rowTypeEntityName = node.attrs?.typeName;

  let rowTypeTriple: ITriple | null = null;
  let filterTriple: ITriple | null = null;

  if (!existingRowTypeTriple) {
    rowTypeTriple = Triple.withId({
      space: spaceId,
      entityId: blockEntityId,
      entityName: getNodeName(node),
      attributeId: SYSTEM_IDS.ROW_TYPE,
      attributeName: 'Row Type',
      value: { id: rowTypeEntityId, type: 'entity', name: rowTypeEntityName },
    });

    // Make sure that we only add a filter for new tables by also checking that the row type triple doesn't exist.
    // Typically the row type triple only gets added when the table is created. Otherwise this will create
    // a new filter for every table block that doesn't have one every time the content of the editor is changed.
    // Generally the filter triple _also_ won't exist if the row type doesn't, but we check to be safe.
    if (!existingFilterTriple) {
      filterTriple = Triple.withId({
        space: spaceId,
        entityId: blockEntityId,
        entityName: getNodeName(node),
        attributeId: SYSTEM_IDS.FILTER,
        attributeName: 'Filter',
        value: {
          id: ID.createValueId(),
          type: 'string',
          value: TableBlockSdk.createGraphQLStringFromFilters(
            [
              {
                columnId: SYSTEM_IDS.SPACE,
                valueType: 'string',
                value: spaceId,
              },
            ],
            rowTypeEntityId
          ),
        },
      });
    }
  }

  return {
    rowTypeTriple: rowTypeTriple ? { type: 'createTriple', ...rowTypeTriple } : null,
    filterTriple: filterTriple ? { type: 'createTriple', ...filterTriple } : null,
  };
}

function getNewBlockImageTriple({ node, spaceId }: { node: JSONContent; spaceId: string }): CreateTripleAction | null {
  const blockEntityId = getNodeId(node);

  if (!node.attrs?.src) {
    return null;
  }

  const { src } = node.attrs;

  return {
    type: 'createTriple',
    ...Triple.withId({
      space: spaceId,
      entityId: blockEntityId,
      entityName: getNodeName(node),
      attributeId: SYSTEM_IDS.IMAGE_ATTRIBUTE,
      attributeName: 'Image',
      value: { id: ID.createValueId(), type: 'image', value: Value.toImageValue(src) },
    }),
  };
}

function upsertBlockMarkdownTriple({
  node,
  spaceId,
  existingBlockTriple,
}: {
  node: JSONContent;
  spaceId: string;
  existingBlockTriple: ITriple | null;
}): CreateTripleAction | EditTripleAction | null {
  const blockEntityId = getNodeId(node);
  const isList = node.type === 'bulletList';

  const nodeHTML = getTextNodeHtml(node);

  const entityName = getNodeName(node);
  let markdown = markdownConverter.makeMarkdown(nodeHTML);

  //  Overrides Showdown's unwanted "consecutive list" behavior found in
  //  `src/subParsers/makeMarkdown/list.js`
  if (isList) {
    markdown = markdown.replaceAll('\n<!-- -->\n', '');
  }

  const isUpdated = existingBlockTriple && Value.stringValue(existingBlockTriple) !== markdown;

  if (!existingBlockTriple) {
    return {
      type: 'createTriple',
      ...Triple.withId({
        space: spaceId,
        entityId: blockEntityId,
        entityName: entityName,
        attributeId: SYSTEM_IDS.MARKDOWN_CONTENT,
        attributeName: 'Markdown Content',
        value: { id: ID.createValueId(), type: 'string', value: markdown },
      }),
    };
  } else if (isUpdated) {
    return {
      type: 'editTriple',
      before: { type: 'deleteTriple', ...existingBlockTriple },
      after: {
        type: 'createTriple',
        ...Triple.ensureStableId({
          ...existingBlockTriple,
          value: { ...existingBlockTriple.value, type: 'string', value: markdown },
        }),
      },
    };
  }

  return null;
}

/*
  Helper function for upserting a new block name triple for TABLE_BLOCK, TEXT_BLOCK, or IMAGE_BLOCK
  */
function upsertBlockNameTriple({
  node,
  spaceId,
  existingNameTriple,
}: {
  node: JSONContent;
  spaceId: string;
  existingNameTriple: ITriple | null;
}): CreateTripleAction | EditTripleAction | null {
  const blockEntityId = getNodeId(node);
  const entityName = getNodeName(node);

  const isUpdated = existingNameTriple && Value.stringValue(existingNameTriple) !== entityName;
  const isTableNode = node.type === 'tableNode';

  if (!existingNameTriple) {
    return {
      type: 'createTriple',
      ...Triple.withId({
        space: spaceId,
        entityId: blockEntityId,
        entityName: entityName,
        attributeId: SYSTEM_IDS.NAME,
        attributeName: 'Name',
        value: { id: ID.createValueId(), type: 'string', value: entityName },
      }),
    };
  } else if (!isTableNode && isUpdated) {
    return {
      type: 'editTriple',
      before: { type: 'deleteTriple', ...existingNameTriple },
      after: {
        type: 'createTriple',
        ...Triple.ensureStableId({
          ...existingNameTriple,
          entityName,
          value: { ...existingNameTriple.value, type: 'string', value: entityName },
        }),
      },
    };
  }

  return null;
}

function getParentEntityTriple({
  node,
  existingParentEntityTriple,
  spaceId,
  entityPageId,
  entityPageName,
}: {
  node: JSONContent;
  existingParentEntityTriple: ITriple | null;
  spaceId: string;
  entityPageId: string;
  entityPageName: string | null;
}): CreateTripleAction | null {
  const blockEntityId = getNodeId(node);

  if (!existingParentEntityTriple) {
    Triple.withId({
      space: spaceId,
      entityId: blockEntityId,
      entityName: getNodeName(node),
      attributeId: SYSTEM_IDS.PARENT_ENTITY,
      attributeName: 'Parent Entity',
      value: { id: entityPageId, type: 'entity', name: entityPageName },
    });
  }

  return null;
}

/**
 * Blocks store has a few jobs
 * 1. Get all the blocks for a given entity
 *    1a. Fetches all of the Content Blocks that reference the collection id
 *        for the triple whose attribute is Block Ids. (SYSTEM_IDS.BLOCKS)
 *    1b. Fetches all of the Join Blocks that reference the collection id
 *        for the triple whose attribute is Block Ids. (SYSTEM_IDS.BLOCKS)
 * 2. Create new content blocks when the editor has new blocks
 * 3. Create new join blocks when the editor has new blocks
 * 4. Keep block content in sync when the editor changes (Content Blocks)
 * 5. Keep block ordering in sync when the editor changes (Join Blocks)
 *
 * @TODO
 * 3. Fetch all blocks
 * 4. Fetch all join blocks
 * 5. Keep fetched blocks in sync when editor changes
 * 6. Set ordering on join block(s) when editor changes
 */

export function useBlocksStore({
  spaceId,
  entityId,
  entityName,
}: {
  spaceId: string;
  entityId: string;
  entityName: string | null;
}) {
  const { create, update } = useActionsStore();

  const updateEditorBlocks = React.useCallback(
    async (editor: Editor) => {
      const { content = [] } = editor.getJSON();

      // Don't make block entities for empty paragraphs.
      const populatedContent = content.filter(node => {
        const isNonParagraph = node.type !== 'paragraph';

        if (isNonParagraph) {
          return true;
        }

        const isParagraphWithValidContent =
          node.content &&
          node.content.length > 0 &&
          node.content[0].text &&
          // Don't create a block if the text node starts with a slash command
          !node.content[0].text.startsWith('/');

        return isParagraphWithValidContent;
      });

      const blockIds = populatedContent.map(node => getNodeId(node));

      // @TODO: How do we do this efficiently?
      // get all block entities by id
      const mockContentBlockEntities = (await Promise.all(blockIds.map(node => node))) as {
        id: string;
        triples: ITriple[];
      }[];

      // get all join blocks by id
      const mockJoinBlockEntities = (await Promise.all(blockIds.map(node => node))) as {
        id: string;
        entityPointer: string;
      }[];

      const actions: (CreateTripleAction | EditTripleAction)[] = [];

      // Build the actions to perform for each block in the editor.
      // Later on we execute these actions using the APIs from the
      // ActionsStore (create, update, remove).
      //
      // Each block requires a name, type, and parent entity.
      //
      // Table blocks need row type and filter triples.
      // Image blocks need an image url triple.
      // Paragraph blocks need a markdown triple.
      for (const node of populatedContent) {
        const blockEntity = mockContentBlockEntities.find(entity => entity.id === getNodeId(node));

        // Create a block type triple for this block entity if it doesn't exist.
        const existingBlockTypeTriple = blockEntity?.triples.find(t => t.attributeId === SYSTEM_IDS.TYPES) ?? null;
        const blockTypeTriple = getBlockTypeTriple({
          node,
          existingBlockTypeTriple,
          spaceId,
        });

        if (blockTypeTriple) {
          actions.push(blockTypeTriple);
        }

        // Create a block name triple for this block entity if it doesn't exist.
        const existingNameTriple = blockEntity?.triples.find(t => t.attributeId === SYSTEM_IDS.NAME) ?? null;
        const blockNameTriple = upsertBlockNameTriple({
          node,
          existingNameTriple,
          spaceId,
        });

        if (blockNameTriple) {
          actions.push(blockNameTriple);
        }

        // Create a parent entity triple for this block entity if it doesn't exist.
        const existingParentEntityTriple =
          blockEntity?.triples.find(t => t.attributeId === SYSTEM_IDS.PARENT_ENTITY) ?? null;
        const parentEntityTriple = getParentEntityTriple({
          node,
          existingParentEntityTriple,
          spaceId,
          entityPageId: entityId,
          entityPageName: entityName,
        });

        if (parentEntityTriple) {
          actions.push(parentEntityTriple);
        }

        // Build required actions based on the block type.
        const blockType = node.type as 'tableNode' | 'image' | 'paragraph' | undefined;

        switch (blockType) {
          case 'tableNode': {
            const existingRowTypeTriple = blockEntity?.triples.find(t => t.attributeId === SYSTEM_IDS.ROW_TYPE) ?? null;
            const existingFilterTriple = blockEntity?.triples.find(t => t.attributeId === SYSTEM_IDS.FILTER) ?? null;

            const { rowTypeTriple, filterTriple } = getNewTableBlockMetadataTriples({
              node,
              spaceId,
              existingFilterTriple,
              existingRowTypeTriple,
            });

            if (rowTypeTriple) {
              actions.push(rowTypeTriple);
            }

            if (filterTriple) {
              actions.push(filterTriple);
            }

            break;
          }

          case 'image': {
            // There's no UI to update an image block once it's been created, so we don't need
            // to check if there's an existing image triple or not.
            const imageTriple = getNewBlockImageTriple({
              node,
              spaceId,
            });

            if (imageTriple) {
              actions.push(imageTriple);
            }

            break;
          }

          case 'paragraph': {
            const result = upsertBlockMarkdownTriple({
              node,
              spaceId,
              existingBlockTriple: null,
            });

            if (result) {
              actions.push(result);
            }

            break;
          }

          default:
            break;
        }
      }

      batch(() => {
        actions.forEach(action => {
          if (action.type === 'createTriple') {
            create(action);
          } else if (action.type === 'editTriple') {
            update(action.after, action.before);
          }
        });
      });
    },
    [create, update, spaceId, entityId, entityName]
  );

  // for each block id we need to update the content block
  // we need to check the ordering of blocks and update the join blocks

  return { updateEditorBlocks };
}
