import Link from "next/link";
import MapaCampus from "@/components/MapaCampus";

export default function Inicio() {
  return (
    <main className="pagina">
      <header className="encabezado" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "12px", flexWrap: "wrap" }}>
          <h1>Radar de Estacionamientos UCAB</h1>
          <p>Campus Montalbán</p>
        </div>
        <nav style={{ display: "flex", gap: "8px" }}>
          <Link
            href="/simulacion"
            style={{
              background: "#2563eb",
              color: "#fff",
              padding: "5px 12px",
              borderRadius: "6px",
              textDecoration: "none",
              fontSize: "0.85rem",
              fontWeight: 600,
            }}
          >
            🎮 Lienzo 3D (Simulador)
          </Link>
        </nav>
      </header>
      <MapaCampus />
    </main>
  );
}
