import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useState } from 'react';
import { ControlledBubbleMenu } from './bubble-menu';
import { CommandList } from './command-list';

interface Props {
  editable?: boolean;
}

const isBrowser = typeof window !== 'undefined';

export const Editor = ({ editable = true }: Props) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Hello World! 🌎️</p>',
    editable,
    editorProps: {
      handleKeyPress: (view, event) => {
        if (event.key === '/') {
          setMenuOpen(true);
          return true;
        } else {
          setMenuOpen(false);
          return false;
        }
      },
      handleKeyDown: (view, event) => {
        if (event.key === 'Escape') {
          setMenuOpen(false);
          return true;
        }
      },
    },
  });

  return (
    <div>
      <EditorContent editor={editor} />
      {editor && isBrowser && (
        <ControlledBubbleMenu editor={editor} open={menuOpen}>
          <CommandList editor={editor} closeMenu={() => setMenuOpen(false)} />
        </ControlledBubbleMenu>
      )}
    </div>
  );
};
