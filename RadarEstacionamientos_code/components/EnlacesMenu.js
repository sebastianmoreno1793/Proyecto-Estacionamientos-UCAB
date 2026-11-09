"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icono } from "./Iconos";

export default function EnlacesMenu({ enlaces }) {
  const ruta = usePathname();
  return (
    <nav aria-label="Menú principal" className="pestanas">
      {enlaces.map(({ href, texto, icono }) => (
        <Link
          key={href}
          href={href}
          className="pestana"
          aria-current={ruta === href || (href.startsWith("/admin") && ruta.startsWith("/admin")) ? "page" : undefined}
        >
          <Icono nombre={icono} />
          <span>{texto}</span>
        </Link>
      ))}
    </nav>
  );
}
