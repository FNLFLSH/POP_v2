import clsx from "clsx";

type BeaconPinProps = {
  className?: string;
  animated?: boolean;
  "aria-hidden"?: boolean;
};

export function BeaconPin({ className, animated, ...rest }: BeaconPinProps) {
  return (
    <svg
      className={clsx(animated ? "pin-drop" : undefined, className)}
      viewBox="0 0 120 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <defs>
        <radialGradient id="pinHeadGradient" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(60 40) rotate(90) scale(38)">
          <stop offset="0" stopColor="#fdfdfd" />
          <stop offset="0.42" stopColor="#d9d9d9" />
          <stop offset="0.78" stopColor="#959595" />
          <stop offset="1" stopColor="#4a4a4a" />
        </radialGradient>
        <linearGradient id="pinBodyGradient" x1="60" y1="68" x2="60" y2="128" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#8e8e8e" />
          <stop offset="0.55" stopColor="#6d6d6d" />
          <stop offset="1" stopColor="#2d2d2d" />
        </linearGradient>
        <linearGradient id="pinNeedleGradient" x1="60" y1="108" x2="60" y2="138" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#f6f6f6" stopOpacity="0.8" />
          <stop offset="1" stopColor="#9a9a9a" stopOpacity="0.4" />
        </linearGradient>
        <filter id="pinShadow" x="-30" y="90" width="180" height="120" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation="12" result="shadowBlur" />
          <feOffset dy="18" />
          <feColorMatrix
            in="shadowBlur"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.32 0"
          />
        </filter>
      </defs>

      <g filter="url(#pinShadow)">
        <ellipse cx="60" cy="114" rx="32" ry="10" fill="#000" opacity="0.28" />
      </g>

      <ellipse cx="60" cy="42" rx="40" ry="38" fill="url(#pinHeadGradient)" />
      <ellipse cx="60" cy="36" rx="20" ry="14" fill="#ffffff" opacity="0.18" />
      <path
        d="M60 66C77.5 66 93 76.8 93 92C93 103.5 85.4 113.7 73.2 125.6C67.4 131.1 63.1 135.5 60 140C56.9 135.5 52.6 131.1 46.8 125.6C34.6 113.7 27 103.5 27 92C27 76.8 42.5 66 60 66Z"
        fill="url(#pinBodyGradient)"
      />
      <path
        d="M60 118C66.8 118 72.5 123.5 72.5 128.9C72.5 132.5 69.3 135.8 64.2 138.9C62.3 140.1 59.7 140.1 57.8 138.9C52.7 135.8 49.5 132.5 49.5 128.9C49.5 123.5 55.2 118 60 118Z"
        fill="url(#pinNeedleGradient)"
      />
      <path
        d="M60 66C71.6 66 84.5 72.6 89.1 84.6C90.8 89.1 91.4 94 89.5 98.6C87.4 103.7 82.7 107.9 76.4 111.8C71.5 114.8 66.4 117.2 61 118.9C57.2 120 52.9 120 49.1 118.9C43.6 117.2 38.5 114.8 33.6 111.8C27.3 107.9 22.6 103.7 20.5 98.6C18.7 94 19.3 89.1 20.9 84.6C25.5 72.6 48.4 66 60 66Z"
        fill="rgba(255,255,255,0.08)"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="0.6"
      />
      <circle cx="60" cy="34" r="6" fill="#ffffff" opacity="0.35" />
    </svg>
  );
}
