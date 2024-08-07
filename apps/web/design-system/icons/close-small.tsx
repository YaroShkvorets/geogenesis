import * as React from 'react';

import { ColorName, colors } from '~/design-system/theme/colors';

interface Props {
  color?: ColorName;
}

export function CloseSmall({ color }: Props) {
  const themeColor = color ? colors.light[color] : 'currentColor';

  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1.5 10.5L10.5 1.5" stroke={themeColor} />
      <path d="M1.5 1.5L10.5 10.5" stroke={themeColor} />
    </svg>
  );
}
