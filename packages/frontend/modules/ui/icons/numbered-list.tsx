interface Props {
  isActive: boolean
}

export function NumberedList({ isActive }: Props) {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="26" height="26" rx="4" fill="none" />
      <path
        d="M4.44283 7.88398H5.09083V5.08398H4.73483L3.93083 5.54798V6.25998L4.44283 5.95598V7.88398Z"
        fill={isActive ? '#1d4ed8' : '#1C1C1C'}
      />
      <path
        d="M3.85083 14.884H5.74283V14.324H4.80683L5.36283 13.624C5.55883 13.38 5.68283 13.156 5.68283 12.88C5.68283 12.408 5.35883 12.052 4.78683 12.052C4.23083 12.052 3.93483 12.42 3.87883 12.828L4.46683 12.948C4.49483 12.744 4.59083 12.612 4.78683 12.612C4.95483 12.612 5.06283 12.74 5.06283 12.9C5.06283 13.052 4.98683 13.196 4.87483 13.336L3.85083 14.588V14.884Z"
        fill={isActive ? '#1d4ed8' : '#1C1C1C'}
      />
      <path
        d="M4.90283 21.916C5.45483 21.916 5.87883 21.556 5.87883 20.976C5.87883 20.428 5.56283 20.144 5.10283 20.144L5.70283 19.348V19.084H4.03483V19.636H4.85083L4.37883 20.272L4.64283 20.644C4.70683 20.608 4.81083 20.588 4.88283 20.588C5.09883 20.588 5.25883 20.752 5.25883 20.98C5.25883 21.212 5.10283 21.356 4.90283 21.356C4.66283 21.356 4.55883 21.192 4.51083 20.992L3.90683 21.08C3.95483 21.548 4.29483 21.916 4.90283 21.916Z"
        fill={isActive ? '#1d4ed8' : '#1C1C1C'}
      />
      <rect
        x="8.75488"
        y="5.88379"
        width="13"
        height="1"
        rx="0.5"
        fill={isActive ? '#1d4ed8' : '#1C1C1C'}
      />
      <rect
        x="8.75488"
        y="12.8838"
        width="13"
        height="1"
        rx="0.5"
        fill={isActive ? '#1d4ed8' : '#1C1C1C'}
      />
      <rect
        x="8.75488"
        y="19.8838"
        width="13"
        height="1"
        rx="0.5"
        fill={isActive ? '#1d4ed8' : '#1C1C1C'}
      />
    </svg>
  )
}