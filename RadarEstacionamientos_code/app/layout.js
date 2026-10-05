import "leaflet/dist/leaflet.css";
import "./globals.css";

export const metadata = {
  title: "Radar de Estacionamientos UCAB",
  description:
    "Estacionamientos con puestos libres en la UCAB Montalbán, con semáforo de ocupación.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
