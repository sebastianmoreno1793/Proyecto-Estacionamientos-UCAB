import "./globals.css";

export const metadata = {
  title: "Simulador · Radar de Estacionamientos UCAB",
  description:
    "Mundo virtual del Campus Montalbán que genera avisos, placas e incidencias contra la app base, como si fueran reales.",
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
