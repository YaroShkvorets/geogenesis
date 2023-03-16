import UniqueID from '@tiptap-pro/extension-unique-id';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { EditorContent, FloatingMenu, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { SquareButton } from '~/modules/design-system/button';
import { useEntityStore } from '~/modules/entity';
import { ConfiguredCommandExtension } from './command-extension';
import { TableNode } from './table-node';

interface Props {
  editable?: boolean;
}

export const tiptapExtensions = [
  StarterKit,
  ConfiguredCommandExtension,
  TableNode,
  Image,
  Placeholder.configure({
    placeholder: ({ node }) => {
      if (node.type.name === 'heading') {
        return 'Heading...';
      }

      return '/ to select content block or write some content...';
    },
  }),
  UniqueID.configure({
    types: ['tableNode', 'paragraph', 'heading'],
  }),
];

export const Editor = ({ editable = true }: Props) => {
  const entityStore = useEntityStore();

  // Content must be undefined for TipTap to show the initial placeholder
  const content = entityStore.editorJson?.content?.length ? entityStore.editorJson : undefined;

  const editor = useEditor(
    {
      extensions: tiptapExtensions,
      editable,
      content,
      onBlur({ editor }) {
        entityStore.updateEditorBlocks(editor);
      },
    },
    [editable, !!content] // Only re-initialize editor when editable content becomes available so we don't trigger flickers
  );

  return editor ? (
    <>
      <EditorContent editor={editor} />
      <FloatingMenu editor={editor}>
        <div className="absolute -left-12 -top-3">
          <SquareButton onClick={() => editor.chain().focus().insertContent('/').run()} icon="plus" />
        </div>
      </FloatingMenu>
    </>
  ) : null;
};
