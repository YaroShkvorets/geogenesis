'use client';

import { A, D, pipe } from '@mobily/ts-belt';
import { AnimatePresence, motion } from 'framer-motion';
import pluralize from 'pluralize';

import * as React from 'react';

import { useActionsStore } from '~/core/hooks/use-actions-store';
import { useToast } from '~/core/hooks/use-toast';
import { useDiff } from '~/core/state/diff-store/diff-store';
import { useEditable } from '~/core/state/editable-store/editable-store';
import { Action } from '~/core/utils/action';

import { Button } from '~/design-system/button';

export const FlowBar = () => {
  const [toast] = useToast();
  const { editable } = useEditable();
  const { isReviewOpen, setIsReviewOpen } = useDiff();
  const { allActions, allSpacesWithActions } = useActionsStore();

  const allUnpublishedSquashedActions = Action.prepareActionsForPublishing(allActions);
  const actionsCount = allUnpublishedSquashedActions.length;

  const entitiesCount = pipe(
    allUnpublishedSquashedActions,
    A.groupBy(action => {
      if (action.type === 'deleteTriple' || action.type === 'createTriple') return action.entityId;
      return action.after.entityId;
    }),
    D.keys,
    A.length
  );

  const spacesCount = allSpacesWithActions.length;

  // Don't show the flow bar if there are no actions, if the user is not in edit mode, or if there is a toast
  const hideFlowbar = actionsCount === 0 || !editable || toast;

  return (
    <AnimatePresence>
      {!hideFlowbar && (
        <div className="pointer-events-none fixed bottom-0 left-0 right-0 flex w-full justify-center p-4">
          <motion.div
            variants={flowVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={transition}
            custom={!isReviewOpen}
            className="pointer-events-auto inline-flex items-center gap-4 rounded bg-white p-2 pl-3 shadow-card"
          >
            <div className="inline-flex items-center font-medium">
              <span>{pluralize('edit', actionsCount, true)}</span>
              <hr className="mx-2 inline-block h-4 w-px border-none bg-grey-03" />
              <span>
                {pluralize('entity', entitiesCount, true)} in {pluralize('space', spacesCount, true)}
              </span>
            </div>
            <Button onClick={() => setIsReviewOpen(true)} variant="primary">
              Review {pluralize('edit', actionsCount, false)}
            </Button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const flowVariants = {
  hidden: { opacity: 0, y: '4px' },
  visible: (custom: boolean) => ({
    opacity: custom ? 1 : 0,
    y: custom ? '0px' : '4px',
    transition: {
      type: 'spring',
      duration: 0.15,
      bounce: 0,
      delay: custom ? 0.15 : 0,
    },
  }),
};

const transition = { type: 'spring', duration: 0.15, bounce: 0 };