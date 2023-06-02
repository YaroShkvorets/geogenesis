import * as React from 'react';

import { colors, ColorName } from '~/modules/design-system/theme/colors';

interface Props {
  color?: ColorName;
}

export function Cog({ color }: Props) {
  const themeColor = color ? colors.light[color] : 'currentColor';

  return (
    <svg width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M11.6976 6.4939C11.6976 6.32115 11.6879 6.14857 11.6684 5.97698C11.6558 5.86639 11.7127 5.75842 11.8136 5.7114L12.4236 5.4271C12.5384 5.37356 12.5951 5.24252 12.5553 5.12215L12.3106 4.38048C12.2713 4.26145 12.1499 4.18991 12.0267 4.21318L11.3583 4.33949C11.2503 4.3599 11.1422 4.30697 11.0872 4.21174C10.9135 3.91063 10.7059 3.62968 10.4683 3.37419C10.3917 3.29188 10.374 3.16967 10.429 3.07162L10.7506 2.49784C10.813 2.3867 10.7817 2.24648 10.6781 2.17231L10.034 1.71119C9.93243 1.63844 9.79271 1.6519 9.70686 1.74269L9.24258 2.23368C9.16701 2.31359 9.04837 2.3341 8.94803 2.28907C8.6261 2.14461 8.28841 2.03686 7.94157 1.96793C7.83251 1.94626 7.74716 1.85916 7.73312 1.74886L7.6497 1.09343C7.63381 0.968574 7.52757 0.875 7.4017 0.875H6.60172C6.47571 0.875 6.3694 0.968773 6.35367 1.09379L6.27128 1.74861C6.25739 1.85903 6.17202 1.9463 6.06287 1.96801C5.71566 2.03708 5.37758 2.14483 5.05519 2.2892C4.95479 2.33416 4.83613 2.3135 4.76065 2.23348L4.30234 1.74756C4.21656 1.65661 4.07678 1.64302 3.97507 1.71573L3.32363 2.18149C3.21993 2.25563 3.18862 2.39593 3.25097 2.50712L3.57245 3.08052C3.62749 3.17869 3.60961 3.30105 3.53289 3.38339C3.29515 3.63852 3.0876 3.91937 2.91424 4.22053C2.85931 4.31593 2.75111 4.36902 2.64293 4.34858L1.97454 4.22229C1.85148 4.19903 1.7302 4.27042 1.69081 4.3893L1.44504 5.13101C1.40511 5.25148 1.4618 5.38275 1.57687 5.4363L2.18785 5.72063C2.28878 5.7676 2.34578 5.87558 2.33322 5.98619C2.29422 6.32969 2.29422 6.67641 2.33322 7.01992C2.34578 7.13053 2.28878 7.2385 2.18785 7.28547L1.57695 7.56976C1.46185 7.62333 1.40517 7.75466 1.44515 7.87515L1.69076 8.61539C1.73018 8.73422 1.85143 8.80556 1.97446 8.78231L2.64305 8.65597C2.75117 8.63554 2.85933 8.68856 2.91425 8.78391C3.08795 9.0855 3.29564 9.36689 3.53338 9.62276C3.60986 9.70508 3.62758 9.82724 3.57263 9.92526L3.25101 10.4989C3.18865 10.6101 3.21999 10.7505 3.32374 10.8246L3.96809 11.2849C4.06947 11.3573 4.2087 11.3441 4.29456 11.2538L4.75897 10.7655C4.83458 10.686 4.95291 10.6658 5.05299 10.7107C5.37562 10.8556 5.71401 10.9639 6.06159 11.0334C6.17061 11.0552 6.25583 11.1424 6.26973 11.2527L6.35209 11.9063C6.36784 12.0313 6.47414 12.125 6.60012 12.125H7.40019C7.52604 12.125 7.63227 12.0315 7.64818 11.9066L7.73157 11.2524C7.74561 11.1422 7.83082 11.0552 7.93975 11.0334C8.28694 10.9641 8.62493 10.8559 8.94708 10.7109C9.04712 10.6658 9.16547 10.686 9.24116 10.7654L9.70698 11.2541C9.79287 11.3442 9.93198 11.3574 10.0333 11.2851L10.6778 10.8246C10.7816 10.7505 10.8129 10.6101 10.7505 10.4989L10.4288 9.92503C10.3739 9.82712 10.3915 9.7051 10.4678 9.6228C10.7054 9.36662 10.9132 9.08513 11.0872 8.78358C11.1422 8.68839 11.2502 8.63551 11.3582 8.65592L12.0268 8.78226C12.15 8.80553 12.2713 8.73404 12.3106 8.61505L12.5552 7.87485C12.595 7.75447 12.5384 7.62337 12.4235 7.56981L11.8135 7.28551C11.7127 7.23851 11.6557 7.1306 11.6683 7.02006C11.6881 6.84541 11.6979 6.66974 11.6976 6.4939ZM7 9.61907C6.37113 9.61907 5.75639 9.43565 5.23352 9.09202C4.71066 8.74839 4.30316 8.25997 4.06257 7.68855C3.82199 7.11714 3.75912 6.48839 3.88192 5.88183C4.00472 5.27527 4.30767 4.71814 4.75246 4.28093C5.19724 3.84371 5.76388 3.54604 6.3807 3.42557C6.99752 3.3051 7.63682 3.36724 8.21773 3.60412C8.79864 3.84101 9.29507 4.242 9.64422 4.75639C9.99338 5.27077 10.1796 5.87544 10.1793 6.4939C10.1789 7.32289 9.84373 8.11778 9.24754 8.70382C8.65136 9.28986 7.84292 9.61907 7 9.61907Z"
        stroke={themeColor}
        strokeMiterlimit="10"
      />
    </svg>
  );
}
