import * as React from 'react';

import { ColorName, colors } from '~/design-system/theme/colors';

interface Props {
  color?: ColorName;
}

export function OrganizeData({ color }: Props) {
  const themeColor = color ? colors.light[color] : 'currentColor';

  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="9.5" y="0.5" width="6" height="6" rx="1.5" stroke={themeColor} />
      <rect x="0.5" y="9.5" width="6" height="6" rx="1.5" stroke={themeColor} />
      <rect x="0.5" y="0.5" width="6" height="6" rx="1.5" stroke={themeColor} />
      <rect x="9.5" y="9.5" width="6" height="6" rx="1.5" stroke={themeColor} />
    </svg>
  );
}
