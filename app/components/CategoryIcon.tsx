
import type { ReactNode, SVGProps } from "react";

export type CategoryIconName =
  | "home"
  | "latest"
  | "world"
  | "politics"
  | "uttar-pradesh"
  | "location"
  | "crime"
  | "entertainment"
  | "dharma"
  | "epaper"
  | "magazine";

type CategoryIconProps = {
  name: CategoryIconName;
  size?: number;
};

const svgProps: SVGProps<SVGSVGElement> = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

const icons: Record<CategoryIconName, ReactNode> = {
  home: (
    <>
      <path d="m3 10 9-7 9 7" />
      <path d="M5 9v12h14V9" />
      <path d="M9 21v-7h6v7" />
    </>
  ),

  latest: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="1.5" />
      <path d="M8 7h8M8 11h8M8 15h5M8 18h8" />
    </>
  ),

  world: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" />
    </>
  ),

  politics: (
    <>
      <path d="M3 9h18L12 4 3 9Z" />
      <path d="M5 11v7M9 11v7M15 11v7M19 11v7M3 20h18M2 22h20" />
    </>
  ),

  "uttar-pradesh": (
    <>
      <path d="m7 3 4 1 3 3 4 1 1 4-3 2-1 4-4 3-3-3-2-4 1-4-2-3 2-4Z" />
      <circle cx="12" cy="12" r="2" />
    </>
  ),

  location: (
    <>
      <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),

  crime: (
    <>
      <path d="M12 3 4 6v6c0 5 4 8 8 10 4-2 8-5 8-10V6l-8-3Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),

  entertainment: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m10 9 5 3-5 3V9Z" />
    </>
  ),

  dharma: (
    <>
      <path d="M12 21s-8-4-8-11a4 4 0 0 1 8 0 4 4 0 0 1 8 0c0 7-8 11-8 11Z" />
      <path d="M12 4v14M8 8l4 4 4-4" />
    </>
  ),

  epaper: (
    <>
      <path d="M6 3h9l5 5v13H6z" />
      <path d="M15 3v5h5M9 12h8M9 16h8M9 19h5" />
    </>
  ),

  magazine: (
    <>
      <path d="M4 4h16v16H4z" />
      <path d="M8 4v16M11 8h5M11 12h5M11 16h4" />
    </>
  ),
};

export default function CategoryIcon({
  name,
  size = 30,
}: CategoryIconProps) {
  return (
    <svg
      {...svgProps}
      width={size}
      height={size}
      className="category-svg-icon"
    >
      {icons[name]}
    </svg>
  );
}
