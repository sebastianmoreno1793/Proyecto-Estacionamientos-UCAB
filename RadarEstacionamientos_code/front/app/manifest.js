// Devuelve el manifest de la PWA (D-008): nombre, colores, íconos y el atajo a Reportar.
// Next lo llama y lo sirve en /manifest.webmanifest.
export default function manifest() {
  return {
    name: "Radar de Estacionamientos UCAB",
    short_name: "Radar UCAB",
    description: "Encuentra puesto en el Campus Montalbán antes de llegar, con el semáforo de ocupación en vivo.",
    lang: "es",
    dir: "ltr",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    theme_color: "#12315c",
    background_color: "#f2f2f7",
    categories: ["navigation", "utilities", "education"],
    icons: [
      { src: "/icono-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icono-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icono-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Reportar un problema", short_name: "Reportar", url: "/reportar", icons: [{ src: "/icono-192.png", sizes: "192x192" }] },
    ],
  };
}
