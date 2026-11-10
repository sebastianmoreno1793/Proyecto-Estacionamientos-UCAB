// Marco de todas las pantallas: encabezado con el menú, el contenido y el aviso de
// versión nueva de la PWA (D-008).
import "@/estilos/globales.css";
import MenuPrincipal from "@/componentes/menu/MenuPrincipal";
import ActualizacionPWA from "@/componentes/comunes/ActualizacionPWA";

export const metadata = {
  title: "Radar de Estacionamientos UCAB",
  description:
    "Estacionamientos con puestos libres en la UCAB Montalbán, con semáforo de ocupación.",
  applicationName: "Radar UCAB",
  // PWA en iPhone (D-008): pantalla completa con la barra de estado sobre el Azul Carnet.
  appleWebApp: { capable: true, title: "Radar UCAB", statusBarStyle: "black-translucent" },
  formatDetection: { telephone: false },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#12315c",
};

// Envuelve todas las pantallas: menú principal, el contenido de cada página y el aviso de
// versión nueva de la PWA. Next la usa como marco de toda la app.
export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <div className="app">
          <MenuPrincipal />
          <div className="app-contenido">{children}</div>
        </div>
        <ActualizacionPWA />
      </body>
    </html>
  );
}
