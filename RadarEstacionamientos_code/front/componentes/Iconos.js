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
  inicio: (
    <svg {...base}>
      <path d="M3.5 11 12 4l8.5 7" />
      <path d="M5.5 9.5V20h13V9.5" />
      <path d="M10 20v-5h4v5" />
    </svg>
  ),
  perfil: (
    <svg {...base}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 20.5c1.2-3.6 4-5.5 7.5-5.5s6.3 1.9 7.5 5.5" />
    </svg>
  ),
  conos: (
    <svg {...base}>
      <path d="M9.5 4h5l4 15h-13l4-15Z" />
      <path d="M8 11h8M6.8 15.5h10.4M3.5 19h17" />
    </svg>
  ),
  bateria: (
    <svg {...base}>
      <rect x="3" y="7" width="16" height="10" rx="2.5" />
      <path d="M21 10.5v3M6.5 10.5v3" />
    </svg>
  ),
  carro: (
    <svg {...base}>
      <path d="M4 16.5V12l2-5h12l2 5v4.5" />
      <path d="M3 16.5h18v2H3zM4 12h16" />
      <circle cx="7.5" cy="14.3" r=".6" />
      <circle cx="16.5" cy="14.3" r=".6" />
    </svg>
  ),
  edificio: (
    <svg {...base}>
      <path d="M4 20.5V5.5l8-2.5v17.5M12 7.5l8 2.5v10.5M2.5 20.5h19" />
      <path d="M7 8.5v.1M7 12v.1M7 15.5v.1M15.5 13v.1M15.5 16.5v.1" />
    </svg>
  ),
  check: (
    <svg {...base}>
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  ),
  flecha: (
    <svg {...base}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  ),
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
