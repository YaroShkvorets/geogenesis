import { Editor } from '@tiptap/react';
import classNames from 'classnames';
import { useEffect, useState } from 'react';

export interface CommandListRef {
  onKeyDown: (o: { event: KeyboardEvent }) => boolean;
}

export interface CommandSuggestionItem {
  title: string;
  group?: string;
  icon?: React.ReactElement;
  description?: string;
  command: (editor: Editor) => void;
}

const getRange = (editor: Editor) => {
  const { ranges } = editor.state.selection;
  const from = Math.min(...ranges.map(range => range.$from.pos));
  const to = Math.max(...ranges.map(range => range.$to.pos));
  return { from, to };
};

const commandItems: CommandSuggestionItem[] = [
  {
    // icon: <IoText />,
    title: 'Text',
    description: 'Just start writing with plain text.',
    command: editor => {
      const range = getRange(editor);
      editor.chain().focus().deleteRange(range).setParagraph().run();
    },
  },

  {
    icon: <div className={'flex items-center justify-center text-[1.6em]'}>H1</div>,
    title: 'Heading 1',
    description: 'Big section heading.',
    command: editor => {
      const range = getRange(editor);
      editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run();
    },
  },
  {
    icon: <div className={'flex items-center justify-center text-[1.4em]'}>H2</div>,
    title: 'Heading 2',
    description: 'Medium section heading.',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run();
    },
  },
  {
    icon: <div className={'flex items-center justify-center text-[1.2em]'}>H3</div>,
    title: 'Heading 3',
    description: 'Small section heading.',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode('heading', { level: 3 }).run();
    },
  },
];

export const CommandList = ({ editor, closeMenu }: { editor: Editor; closeMenu: () => void }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectItem = (index: number) => {
    const item = commandItems[index];

    if (item) {
      item.command(editor);
      closeMenu();
    }
  };
  useEffect(() => setSelectedIndex(0), [commandItems]);

  // const ref = useRef<HTMLDivElement>(null);

  // useImperativeHandle(ref, () => ({
  //   onKeyDown: ({ event }) => {
  //     if (event.key === 'ArrowUp') {
  //       setSelectedIndex((selectedIndex + commandItems.length - 1) % commandItems.length);
  //       return true;
  //     }

  //     if (event.key === 'ArrowDown') {
  //       setSelectedIndex((selectedIndex + 1) % commandItems.length);
  //       return true;
  //     }

  //     if (event.key === 'Enter') {
  //       selectItem(selectedIndex);
  //       return true;
  //     }

  //     return false;
  //   },
  // }));

  return (
    <div style={{ width: 600 }} className="items relative flex h-80 flex-col overflow-y-auto">
      {commandItems.map((item, index) => (
        <button
          type={'button'}
          className={classNames(
            `item ${index === selectedIndex ? 'is-selected bg-gray-200' : ''}`,
            'hover:bg-gray-200 flex gap-2 rounded p-1'
          )}
          key={index}
          data-index={index}
          onClick={() => selectItem(index)}
        >
          <div className={'border-gray-300 text-gray-400 h-12 w-12 shrink-0 rounded border p-2'}>
            {/* {!item.icon && <MdImage className={'h-full w-full'} />} */}
            {/* {item.icon &&
              cloneElement(item.icon, { className: classNames('h-full w-full', item.icon.props.className) })} */}
          </div>
          <div className={'flex flex-col '}>
            <span className={'self-start'}>{item.title}</span>
            <small className={'text-gray-500 truncate'}>{item.description}</small>
          </div>
        </button>
      ))}
    </div>
  );
};
