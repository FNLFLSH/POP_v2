import clsx from "clsx";

type BeaconIconProps = {
  className?: string;
  animated?: boolean;
  "aria-hidden"?: boolean;
};

export function BeaconIcon({ className, animated, ...rest }: BeaconIconProps) {
  return (
    <svg
      className={clsx(animated ? "animate-pulse" : undefined, className)}
      viewBox="0 0 120 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <defs>
        {/* Top sphere gradient */}
        <radialGradient id="beaconSphereGradient" cx="0.5" cy="0.3" r="0.5">
          <stop offset="0%" stopColor="#f5f5f5" />
          <stop offset="40%" stopColor="#e0e0e0" />
          <stop offset="70%" stopColor="#b0b0b0" />
          <stop offset="100%" stopColor="#808080" />
        </radialGradient>
        
        {/* Middle teardrop gradient */}
        <linearGradient id="beaconMiddleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c0c0c0" />
          <stop offset="50%" stopColor="#a0a0a0" />
          <stop offset="100%" stopColor="#707070" />
        </linearGradient>
        
        {/* Bottom teardrop gradient */}
        <linearGradient id="beaconBottomGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#909090" />
          <stop offset="50%" stopColor="#707070" />
          <stop offset="100%" stopColor="#505050" />
        </linearGradient>
        
        {/* Highlight for top sphere */}
        <radialGradient id="beaconHighlight" cx="0.5" cy="0.35" r="0.15">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Top Shape - Circular Sphere with highlight */}
      <circle
        cx="60"
        cy="45"
        r="32"
        fill="url(#beaconSphereGradient)"
      />
      <ellipse
        cx="60"
        cy="38"
        rx="12"
        ry="10"
        fill="url(#beaconHighlight)"
      />
      
      {/* Middle Shape - Flattened Teardrop/Inverted Heart (larger) */}
      <path
        d="M60 77 Q90 77 100 105 Q100 125 90 140 Q80 150 60 155 Q40 150 30 140 Q20 125 20 105 Q30 77 60 77 Z"
        fill="url(#beaconMiddleGradient)"
      />
      
      {/* Semi-transparent overlay on middle shape */}
      <ellipse
        cx="45"
        cy="110"
        rx="15"
        ry="20"
        fill="rgba(255,255,255,0.1)"
      />
      
      {/* Bottom Shape - Smaller Teardrop */}
      <path
        d="M60 155 Q72 155 78 165 Q78 172 72 177 Q66 180 60 180 Q54 180 48 177 Q42 172 42 165 Q48 155 60 155 Z"
        fill="url(#beaconBottomGradient)"
      />
    </svg>
  );
}

