"use client";
// @PANTALLA Todas › Pestañas Inicio, Mapa, Reportar y Perfil (marca la activa)

// Las cuatro pestañas (Inicio, Mapa, Reportar, Perfil) y cuál está activa.
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavegacionControlador } from "@/controladores/NavegacionControlador";
import { Icono } from "@/vistas/comunes/Iconos";

// Muestra las cuatro pestañas (Inicio, Mapa, Reportar, Perfil) y marca la activa según la ruta; la usa MenuPrincipal.
export default function Pestanas({ enlaces }) {
  const ruta = usePathname();
  return (
    <nav aria-label="Menú principal" className="pestanas">
      {enlaces.map(({ href, texto, icono }) => (
        <Link key={href} href={href} className="pestana" aria-current={NavegacionControlador.estaActiva(href, ruta) ? "page" : undefined}>
          <Icono nombre={icono} />
          <span>{texto}</span>
        </Link>
      ))}
    </nav>
  );
}
