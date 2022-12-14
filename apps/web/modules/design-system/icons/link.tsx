import { useTheme } from '@emotion/react';
import { ColorName } from '../theme/colors';

interface Props {
  color?: ColorName;
}

export function Link({ color }: Props) {
  const theme = useTheme();
  const themeColor = color ? theme.colors[color] : 'currentColor';

  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 4.5C13.933 4.5 15.5 6.067 15.5 8C15.5 9.933 13.933 11.5 12 11.5" stroke={themeColor} />
      <path d="M12 4.5H9" stroke={themeColor} />
      <path d="M12 11.5H9" stroke={themeColor} />
      <path d="M4 11.5C2.067 11.5 0.5 9.933 0.5 8C0.5 6.067 2.067 4.5 4 4.5" stroke={themeColor} />
      <path d="M4 4.5H7" stroke={themeColor} />
      <path d="M4 11.5H7" stroke={themeColor} />
      <path d="M4 8H12" stroke={themeColor} />
    </svg>
  );
}
