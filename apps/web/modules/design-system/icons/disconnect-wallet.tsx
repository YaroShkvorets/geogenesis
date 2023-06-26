import * as React from 'react';

import { colors, ColorName } from '~/modules/design-system/theme/colors';

interface Props {
  color?: ColorName;
}

export function DisconnectWallet({ color }: Props) {
  const themeColor = color ? colors.light[color] : 'currentColor';

  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M14 3.75V3.75C14 2.64543 13.1046 1.75 12 1.75H2.5C1.39543 1.75 0.5 2.64543 0.5 3.75V12.25C0.5 13.3546 1.39543 14.25 2.5 14.25H13.5C14.6046 14.25 15.5 13.3546 15.5 12.25V7.75"
        stroke={themeColor}
      />
      <path
        d="M3 3.25C2.72386 3.25 2.5 3.47386 2.5 3.75C2.5 4.02614 2.72386 4.25 3 4.25V3.25ZM16 7.75V5.75H15V7.75H16ZM13.5 3.25H3V4.25H13.5V3.25ZM16 5.75C16 4.36929 14.8807 3.25 13.5 3.25V4.25C14.3284 4.25 15 4.92157 15 5.75H16Z"
        fill={themeColor}
      />
      <path d="M12 9C12 8.44772 12.4477 8 13 8H16V10H13C12.4477 10 12 9.55228 12 9Z" fill={themeColor} />
      <g filter="url(#filter0_d_13055_36728)">
        <path d="M15.5 0.5C9.64214 6.35786 6.35786 9.64214 0.5 15.5" stroke={themeColor} strokeLinecap="round" />
      </g>
      <defs>
        <filter
          id="filter0_d_13055_36728"
          x="0"
          y="0"
          width="16.5"
          height="16.5"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dx="0.5" dy="0.5" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_13055_36728" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_13055_36728" result="shape" />
        </filter>
      </defs>
    </svg>
  );
}
