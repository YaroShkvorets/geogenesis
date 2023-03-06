import { autoUpdate, flip, offset, useFloating } from '@floating-ui/react-dom';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { Editor, isNodeSelection, posToDOMRect } from '@tiptap/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ReactNode, useLayoutEffect } from 'react';

type Props = {
  editor: Editor;
  open: boolean;
  children: ReactNode;
};

const containerWidth = 600;
// Adapted from https://github.com/ueberdosis/tiptap/issues/2305#issuecomment-1020665146
export const ControlledBubbleMenu = ({ editor, children, open }: Props) => {
  const { x, y, strategy, reference, floating } = useFloating({
    strategy: 'fixed',
    whileElementsMounted: autoUpdate,
    placement: 'top',
    middleware: [
      offset({ mainAxis: 8 }),
      flip({
        padding: 8,
        boundary: editor.options.element,
        fallbackPlacements: ['bottom', 'top-start', 'bottom-start', 'top-end', 'bottom-end'],
      }),
    ],
  });

  useLayoutEffect(() => {
    const { ranges } = editor.state.selection;
    const from = Math.min(...ranges.map(range => range.$from.pos));
    const to = Math.max(...ranges.map(range => range.$to.pos));

    reference({
      getBoundingClientRect() {
        if (isNodeSelection(editor.state.selection)) {
          const node = editor.view.nodeDOM(from) as HTMLElement;

          if (node) {
            return node.getBoundingClientRect();
          }
        }

        return posToDOMRect(editor.view, from, to);
      },
    });
  }, [reference, editor]);

  return (
    <PopoverPrimitive.Root>
      <AnimatePresence mode="wait">
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            exit={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.1,
              ease: 'easeInOut',
            }}
            className="relative z-[1] rounded border border-grey-02 bg-white p-3 shadow-button md:mx-auto md:w-[98vw] md:self-start"
            style={{ width: `calc(${containerWidth}px / 2)`, top: y ?? 0, left: x ?? 0 }}
          >
            {children}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </PopoverPrimitive.Root>
  );
};
