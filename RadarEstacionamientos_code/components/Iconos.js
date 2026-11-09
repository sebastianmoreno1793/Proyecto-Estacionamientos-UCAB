// Íconos SVG de línea (D-007: nada de emoji como íconos). Trazo de 1,75 px, 24 × 24.
// Siempre van junto a un texto: ningún botón es solo un ícono.

const base = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

export const ICONOS = {
  mapa: (
    <svg {...base}>
      <path d="M9 4 3.5 6v14L9 18l6 2 5.5-2V4L15 6 9 4Z" />
      <path d="M9 4v14M15 6v14" />
    </svg>
  ),
  sugerir: (
    <svg {...base}>
      <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
      <path d="M10 13V7h2.5a2 2 0 0 1 0 4H10" />
    </svg>
  ),
  reportar: (
    <svg {...base}>
      <path d="M12 3.5 2.8 19.5h18.4L12 3.5Z" />
      <path d="M12 10v4.5M12 17.2v.1" />
    </svg>
  ),
  incidencias: (
    <svg {...base}>
      <rect x="5" y="3.5" width="14" height="17" rx="2.5" />
      <path d="M9 3.5h6v2.5H9zM8.5 11h7M8.5 15h5" />
    </svg>
  ),
  garita: (
    <svg {...base}>
      <path d="M3 20.5V9l5-3v14.5M8 11h13M17 11v9.5" />
      <path d="M11 11l2.5-3M15.5 11 18 8" />
    </svg>
  ),
  admin: (
    <svg {...base}>
      <path d="M4 7h10M18 7h2M4 17h2M10 17h10" />
      <circle cx="16" cy="7" r="2" />
      <circle cx="8" cy="17" r="2" />
    </svg>
  ),
};

export function Icono({ nombre }) {
  return ICONOS[nombre] ?? null;
}
