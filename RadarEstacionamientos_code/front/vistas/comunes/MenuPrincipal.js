"use client";
// @PANTALLA Todas › Encabezado: la marca, el círculo con las iniciales y las pestañas
// Encabezado: marca, círculo del perfil y pestañas (solo con sesión iniciada).
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CuentaControlador } from "@/controladores/CuentaControlador";
import Pestanas from "@/vistas/comunes/Pestanas";

// Encabezado y barra de pestañas (D-007 v2): el mismo en web y en teléfono.
// Cuatro pestañas para todos. Lo de administración (capacidad, garita, edificios)
// se abre desde Perfil y solo lo ve el administrador.
const ENLACES = [
  { href: "/", texto: "Inicio", icono: "inicio" },
  { href: "/mapa", texto: "Mapa", icono: "mapa" },
  { href: "/reportar", texto: "Reportar", icono: "reportar" },
  { href: "/perfil", texto: "Perfil", icono: "perfil" },
];

// Muestra el encabezado de todas las páginas (app/layout.js): marca, círculo con las iniciales y pestañas.
// Pregunta quién está conectado (CuentaControlador → fetch GET /api/sesion) cada vez que cambia la
// pantalla; sin sesión no muestra las pestañas. [fetch] [sesion]
export default function MenuPrincipal() {
  const ruta = usePathname();
  const controlador = useMemo(() => new CuentaControlador(), []);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    let vigente = true;
    controlador.sesion().then((sesion) => vigente && setUsuario(sesion));
    return () => {
      vigente = false;
    };
  }, [ruta, controlador]);

  return (
    <header className="menu">
      <a href="/" className="menu-marca">
        <img src="/icono-192.png" alt="" width={32} height={32} />
        <strong>Radar UCAB</strong>
      </a>
      {usuario && (
        <Link href="/perfil" className="menu-avatar" aria-label="Tu perfil">
          {usuario.iniciales()}
        </Link>
      )}
      {/* Sin sesión las pestañas solo llevarían a /entrar: no se muestran. */}
      {usuario && <Pestanas enlaces={ENLACES} />}
    </header>
  );
}
