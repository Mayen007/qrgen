import React from "react";

const Logo = ({
  className = "h-8 w-auto",
  textClassName = "text-xl font-bold text-blue-600",
  showText = true,
}) => {
  return (
    <div className="flex items-center space-x-2">
      {/* Enhanced SVG Logo Icon */}
      <svg
        className={className}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Gradient definitions */}
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.1" />
          </filter>
        </defs>

        {/* Background with gradient and subtle shadow */}
        <rect
          x="4"
          y="4"
          width="40"
          height="40"
          rx="8"
          fill="url(#logoGradient)"
          filter="url(#shadow)"
        />

        {/* QR Code Pattern - more refined */}
        <g fill="white">
          {/* Top-left finder pattern */}
          <rect x="8" y="8" width="10" height="10" rx="1.5" />
          <rect
            x="10"
            y="10"
            width="6"
            height="6"
            rx="0.5"
            fill="url(#logoGradient)"
          />
          <rect x="12" y="12" width="2" height="2" rx="0.5" fill="white" />

          {/* Top-right finder pattern */}
          <rect x="30" y="8" width="10" height="10" rx="1.5" />
          <rect
            x="32"
            y="10"
            width="6"
            height="6"
            rx="0.5"
            fill="url(#logoGradient)"
          />
          <rect x="34" y="12" width="2" height="2" rx="0.5" fill="white" />

          {/* Bottom-left finder pattern */}
          <rect x="8" y="30" width="10" height="10" rx="1.5" />
          <rect
            x="10"
            y="32"
            width="6"
            height="6"
            rx="0.5"
            fill="url(#logoGradient)"
          />
          <rect x="12" y="34" width="2" height="2" rx="0.5" fill="white" />

          {/* Center timing pattern and data modules */}
          <rect x="20" y="10" width="2" height="2" rx="0.5" />
          <rect x="24" y="10" width="2" height="2" rx="0.5" />

          <rect x="22" y="14" width="4" height="2" rx="0.5" />

          <rect x="20" y="18" width="2" height="2" rx="0.5" />
          <rect x="24" y="18" width="3" height="2" rx="0.5" />

          <rect x="21" y="22" width="2" height="2" rx="0.5" />
          <rect x="25" y="22" width="2" height="2" rx="0.5" />

          {/* Side timing patterns */}
          <rect x="10" y="20" width="2" height="2" rx="0.5" />
          <rect x="14" y="20" width="2" height="2" rx="0.5" />

          <rect x="32" y="20" width="2" height="2" rx="0.5" />
          <rect x="36" y="20" width="2" height="2" rx="0.5" />

          {/* Additional data modules for authentic QR look */}
          <rect x="20" y="26" width="2" height="2" rx="0.5" />
          <rect x="24" y="26" width="2" height="2" rx="0.5" />
          <rect x="28" y="26" width="2" height="2" rx="0.5" />

          <rect x="22" y="30" width="2" height="2" rx="0.5" />
          <rect x="26" y="30" width="2" height="2" rx="0.5" />

          <rect x="20" y="34" width="2" height="2" rx="0.5" />
          <rect x="26" y="34" width="2" height="2" rx="0.5" />

          <rect x="24" y="36" width="2" height="2" rx="0.5" />
        </g>
      </svg>

      {/* Text with conditional rendering */}
      {showText && <span className={textClassName}>QRGen</span>}
    </div>
  );
};

export default Logo;
