import { SYSTEM_IDS } from '@geogenesis/ids';
import { batch } from '@legendapp/state';
import { Editor, JSONContent, generateHTML } from '@tiptap/core';
import pluralize from 'pluralize';
import showdown from 'showdown';

import { TableBlockSdk } from '~/core/blocks-sdk';
import { useActionsStore } from '~/core/hooks/use-actions-store';
import { ID } from '~/core/id';
import { CreateTripleAction, EditTripleAction, Triple as ITriple } from '~/core/types';
import { Triple } from '~/core/utils/triple';
import { Value } from '~/core/utils/value';

import { tiptapExtensions } from '~/partials/editor/editor';
import { htmlToPlainText } from '~/partials/editor/editor-utils';

const markdownConverter = new showdown.Converter();

// Returns the id of the first paragraph even if nested inside of a list
function getNodeId(node: JSONContent) {
  return node.attrs?.id ?? node?.content?.[0]?.content?.[0]?.attrs?.id;
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

    // Make sure that we only add it for new tables by also checking that the row type triple doesn't exist.
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
      type: 'updateTriple',
      before: existingBlockTriple,
      after: Triple.ensureStableId({
        ...existingBlockTriple,
        value: { ...existingBlockTriple.value, type: 'string', value: markdown },
      }),
    };
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
 */

export function useBlocksStore({ spaceId }: { spaceId: string }) {
  const { create, update } = useActionsStore();
  // get content from editor JSON
  // get all block content from blocks with actual data
  // get all the block ids
  // for each block, update the content
  // for each block, check the previous position in the list and make sure
  //   all Join Blocks' order is correct

  const updateEditorBlocks = async (editor: Editor) => {
    const { content = [] } = editor.getJSON();

    const populatedContent = content.filter(node => {
      const isNonParagraph = node.type !== 'paragraph';
      const isParagraphWithContent =
        node.type === 'paragraph' &&
        node.content &&
        node.content.length > 0 &&
        node.content[0].text &&
        !node.content[0].text.startsWith('/'); // Do not create a block if the text node starts with a slash command

      return isNonParagraph || isParagraphWithContent;
    });

    const blockIds = populatedContent.map(node => getNodeId(node));

    // @TODO: How do we do this efficiently?
    const mockBlockEntities = (await Promise.all(populatedContent.map(node => node))) as {
      id: string;
      triples: ITriple[];
    }[];

    // get all block entities by id
    // get all join blocks by id

    const actions: (CreateTripleAction | EditTripleAction)[] = [];

    for (const node of populatedContent) {
      // do different things based on the type of block
      // all blocks need the following triples
      // - block type
      // - parent entity? (do we still need parent entities?)
      // - name

      // @TODO: upsert block type triple
      // @TODO: upsert parent entity triple
      // @TODO: upsert collection id triple
      const blockType = node.type as 'tableNode' | 'image' | 'paragraph' | undefined;

      // Build actions for the required triples for each block type.
      // Later on we execute these actions using the APIs from the ActionsStore (create, update, remove).
      //
      // Table blocks need a row type and filter triple.
      // Image blocks need an image url triple.
      // Paragraph blocks need a markdown triple.
      switch (blockType) {
        case 'tableNode': {
          const blockEntity = mockBlockEntities.find(entity => entity.id === getNodeId(node));
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
          // We can't update an image block once it's been created, so we don't need
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
          update(action);
        }
      });
    });
  };

  // for each block id we need to update the content block
  // we need to check the ordering of blocks and update the join blocks

  return { updateEditorBlocks };
}
