import { colors } from './colors';

export type ShadowScale = typeof shadows;
export type ShadowType = keyof ShadowScale;

export const shadows = {
  dropdown: `0px 6px 8px ${colors.light['grey-04']}33`,
};