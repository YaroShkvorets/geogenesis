import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import { SquareButton } from '~/modules/design-system/button';
import { CheckCircleSmall } from '~/modules/design-system/icons/check-circle-small';
import { Search } from '~/modules/design-system/icons/search';
import { Input } from '~/modules/design-system/input';
import { Text } from '~/modules/design-system/text';
import { useAutocomplete } from '~/modules/entity/autocomplete';

interface ContentProps {
  children: React.ReactNode;
  alignOffset?: number;
  sideOffset?: number;
}

const StyledContent = styled(PopoverPrimitive.Content)<ContentProps>(props => ({
  display: 'flex',
  flexDirection: 'column',
  borderRadius: props.theme.radius,
  backgroundColor: props.theme.colors.white,
  zIndex: 1,
  width: 384,
  overflow: 'hidden',
  height: '100%',

  boxShadow: `inset 0 0 0 1px ${props.theme.colors['grey-02']}`,

  '@media (max-width: 768px)': {
    margin: '0 auto',
    width: '98vw',
  },
}));

const MotionContent = motion(StyledContent);

const InputContainer = styled.div(props => ({
  position: 'relative',
  margin: `${props.theme.space * 2}px`,
}));

const SearchIconContainer = styled.div(props => ({
  position: 'absolute',
  left: props.theme.space * 3,
  top: props.theme.space * 2.5,
  zIndex: 100,
}));

const ResultsList = styled.ul({
  listStyle: 'none',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  margin: 0,
  padding: 0,

  maxHeight: 340,
  overflowY: 'auto',
});

const Result = styled.button<{ existsOnEntity: boolean }>(props => ({
  all: 'unset',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: `${props.theme.space * 2}px`,

  '&:hover': {
    backgroundColor: props.theme.colors['grey-01'],
    ...(!props.existsOnEntity && {
      cursor: 'pointer',
    }),
  },

  '&:focus': {
    outline: 'none',
    backgroundColor: props.theme.colors['grey-01'],
  },

  ...(props.existsOnEntity && {
    backgroundColor: props.theme.colors['grey-01'],
    cursor: 'not-allowed',
  }),
}));

const AddEntityButton = styled(SquareButton)({
  width: 23,
  height: 23,
});

const AutocompleteInput = styled(Input)(props => ({
  paddingLeft: props.theme.space * 9,
}));

interface Props {
  entityValueIds: string[];
  onDone: (result: { id: string; name: string | null }) => void;
}

export function EntityAutocompleteDialog({ onDone, entityValueIds }: Props) {
  const autocomplete = useAutocomplete();
  const theme = useTheme();
  const entityItemIdsSet = new Set(entityValueIds);

  // Using a controlled state to enable exit animations with framer-motion
  const [open, setOpen] = useState(false);

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>
        <AddEntityButton as="span" icon="createSmall" />
      </PopoverPrimitive.Trigger>
      <AnimatePresence mode="wait">
        {open ? (
          <MotionContent
            forceMount={true} // We force mounting so we can control exit animations through framer-motion
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{
              duration: 0.1,
              ease: 'easeInOut',
            }}
            avoidCollisions={false}
            sideOffset={theme.space * 2}
            align="start"
          >
            <InputContainer>
              <SearchIconContainer>
                <Search />
              </SearchIconContainer>
              <AutocompleteInput onChange={e => autocomplete.onQueryChange(e.target.value)} />
            </InputContainer>
            <ResultsList>
              {autocomplete.query.length > 0
                ? autocomplete.results.map(result => (
                    <Result
                      key={result.id}
                      onClick={() => {
                        if (!entityItemIdsSet.has(result.id)) onDone(result);
                      }}
                      existsOnEntity={entityItemIdsSet.has(result.id)}
                    >
                      <Text as="li" variant="metadataMedium" ellipsize>
                        {result.name ?? result.id}
                      </Text>
                      {entityItemIdsSet.has(result.id) && <CheckCircleSmall color="grey-04" />}
                    </Result>
                  ))
                : null}
            </ResultsList>
          </MotionContent>
        ) : null}
      </AnimatePresence>
    </PopoverPrimitive.Root>
  );
}
