import * as React from 'react';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSigner } from 'wagmi';
import { Signer } from 'ethers';
import pluralize from 'pluralize';

import { Button } from '../design-system/button';
import { Trash } from '../design-system/icons/trash';
import { Spacer } from '../design-system/spacer';
import { Text } from '../design-system/text';
import { Toast } from '../design-system/toast';
import { Action as ActionType, ReviewState } from '../types';
import { Spinner } from '../design-system/spinner';
import { groupBy } from '../utils';
import { Action } from '../action';
import { RetrySmall } from '../design-system/icons/retry-small';

interface Props {
  actions: ActionType[];
  spaceId?: string;
  onPublish: (spaceId: string, signer: Signer, setReviewState: (newState: ReviewState) => void) => void;
  onClear: (spaceId: string) => void;
}

export function FlowBar({ actions, onPublish, onClear, spaceId }: Props) {
  const { data: signer } = useSigner();
  const [reviewState, setReviewState] = useState<ReviewState>('idle');

  // An "edit" is really a delete + create behind the scenes. We don't need to count the
  // deletes since that would double the change count.
  const showFlowBar = reviewState === 'idle';
  const showToast =
    reviewState === 'publishing-ipfs' ||
    reviewState === 'signing-wallet' ||
    reviewState === 'publishing-contract' ||
    reviewState === 'publish-complete';

  const actionsCount = Action.getChangeCount(actions);

  const publish = async () => {
    if (!spaceId || !signer) return;

    await onPublish(spaceId, signer, setReviewState);
  };

  const clear = () => {
    if (!spaceId) return;
    onClear(spaceId);
  };

  return (
    <AnimatePresence mode="wait">
      {/* We let the toast persist during the publish-complete state before it switches to idle state */}
      {actionsCount > 0 || reviewState === 'publish-complete' ? (
        <>
          {showFlowBar && (
            <motion.div
              key="action-bar"
              className="fixed bottom-10 flex items-center justify-between rounded border border-grey-02 bg-white p-2 pl-4 shadow-light"
              initial={{ y: 90 }}
              animate={{ y: 0 }}
              exit={{ y: 90 }}
              transition={{ duration: 0.1, ease: 'easeInOut' }}
            >
              {reviewState === 'idle' && (
                <Review actions={actions} onBack={() => setReviewState('idle')} onNext={publish} onClear={clear} />
              )}
            </motion.div>
          )}
          {showToast && (
            <Toast key="publish-toast">
              {reviewState !== 'publish-complete' ? (
                <Spinner />
              ) : (
                <motion.span initial={{ scale: 0.2 }} animate={{ scale: 1 }} transition={{ bounce: 2 }}>
                  🎉
                </motion.span>
              )}
              <Spacer width={12} />
              {reviewState === 'publishing-ipfs' && <ToastText>Uploading changes to IPFS</ToastText>}
              {reviewState === 'signing-wallet' && (
                <motion.div
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -15, opacity: 0 }}
                  className="flex items-center justify-between gap-[6px]"
                >
                  Sign your transaction
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-[6px] rounded border border-white bg-transparent p-1"
                    onClick={publish}
                  >
                    <RetrySmall />
                    <Text variant="smallButton" color="white">
                      Re-prompt
                    </Text>
                  </motion.button>
                </motion.div>
              )}
              {reviewState === 'publishing-contract' && <ToastText>Adding your changes to the blockchain</ToastText>}
              {reviewState === 'publish-complete' && <ToastText>Changes published!</ToastText>}
            </Toast>
          )}
        </>
      ) : null}
    </AnimatePresence>
  );
}

function ToastText({ children }: { children: React.ReactNode }) {
  return (
    <motion.span
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -20, opacity: 0 }}
      transition={{ duration: 0.2, ease: 'easeInOut', opacity: { duration: 0.25 } }}
    >
      {children}
    </motion.span>
  );
}

interface ReviewProps {
  onBack: () => void;
  actions: ActionType[];
  onNext: () => void;
  onClear: () => void;
}

function Review({ actions, onNext, onClear }: ReviewProps) {
  const actionsCount = Action.getChangeCount(actions);
  const entitiesCount = Object.keys(
    groupBy(Action.squashChanges(actions), action => {
      if (action.type === 'deleteTriple' || action.type === 'createTriple') return action.entityId;
      return action.after.entityId;
    })
  ).length;

  return (
    <>
      <button className="cursor-pointer" onClick={onClear}>
        <Trash color="grey-04" />
      </button>
      <Spacer width={8} />
      <Text color="grey-04" variant="button">
        {actionsCount} {pluralize('change', actionsCount)} across {entitiesCount} {pluralize('entity', entitiesCount)}
      </Text>

      <Spacer width={16} />

      <Button icon="eye" variant="primary" onClick={onNext}>
        Publish changes
      </Button>
    </>
  );
}
