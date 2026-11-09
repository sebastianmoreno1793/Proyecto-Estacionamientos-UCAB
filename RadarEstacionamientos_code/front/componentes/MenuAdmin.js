"use client";

// Administración (D-007 v2): un solo título y chips para moverse entre sus partes, en vez de
// páginas sueltas con textos de explicación. Solo la ve el administrador.
import Link from "next/link";
import { usePathname } from "next/navigation";

const PARTES = [
  { href: "/admin/puestos", texto: "Puestos" }, // HU 5.4
  { href: "/admin/incidencias", texto: "Incidencias" }, // HU 9.1 (lista)
  { href: "/admin/garita", texto: "Garita" }, // HU 3.1, 3.2 y 4.1
  { href: "/admin/edificios", texto: "Edificios" }, // HU 6.1
];

export default function MenuAdmin() {
  const ruta = usePathname();
  return (
    <nav className="chips" aria-label="Administración">
      {PARTES.map((p) => (
        <Link key={p.href} href={p.href} className="chip" aria-current={ruta === p.href ? "page" : undefined}>
          {p.texto}
        </Link>
      ))}
    </nav>
  );
}
