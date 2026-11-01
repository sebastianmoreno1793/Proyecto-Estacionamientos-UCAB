import "leaflet/dist/leaflet.css";
import "./globals.css";
import MenuPrincipal from "@/components/MenuPrincipal";

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
      <body>
        <div className="app">
          <MenuPrincipal />
          <div className="app-contenido">{children}</div>
        </div>
      </body>
    </html>
  );
}
