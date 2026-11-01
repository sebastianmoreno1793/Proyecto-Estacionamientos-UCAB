"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function EnlacesMenu({ enlaces }) {
  const ruta = usePathname();
  return (
    <nav aria-label="Menú principal" className="menu-enlaces">
      {enlaces.map(({ href, texto, icono }) => (
        <Link key={href} href={href} className="menu-enlace" aria-current={ruta === href ? "page" : undefined}>
          <span aria-hidden="true">{icono}</span> {texto}
        </Link>
      ))}
    </nav>
  );
}
