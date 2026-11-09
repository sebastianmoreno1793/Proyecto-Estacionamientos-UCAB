import Link from "next/link";
import { redirect } from "next/navigation";
import BotonNotificaciones from "@/components/BotonNotificaciones";
import { Icono } from "@/components/Iconos";
import FormularioVehiculo from "../vehiculos/FormularioVehiculo";
import { salir } from "../cuenta/acciones";
import { listarVehiculosDe } from "@/lib/vehiculos/datos";
import { esAdministrador, obtenerUsuarioActual } from "@/lib/sesion";
import { inicialesDe } from "@/lib/usuarios/reglas";

export const metadata = { title: "Perfil" };

// Perfil (D-007 v2): todo lo personal en un solo lugar.
//  - HU 2.1 Mis vehículos (solo el dueño ve sus placas).
//  - HU 8.1 Notificaciones: aquí se activan después si dijo «Bloquear» en la solicitud.
//  - Administrar: solo para el administrador (HU 5.4, 6.1, 9.1 y la garita).
//  - Salir (HU 1.1).
export default async function PaginaPerfil() {
  const usuario = await obtenerUsuarioActual();
  if (!usuario) redirect("/entrar");
  const vehiculos = await listarVehiculosDe(usuario.correo);

  return (
    <main className="pantalla">
      <div className="fila" style={{ justifyContent: "flex-start", gap: 14 }}>
        <span className="avatar-grande" aria-hidden="true">
          {inicialesDe(usuario.correo)}
        </span>
        <div style={{ minWidth: 0 }}>
          <h1
            style={{
              fontSize: 17,
              lineHeight: "22px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {usuario.correo}
          </h1>
          <span className="suave" style={{ textTransform: "capitalize" }}>
            {usuario.rol}
          </span>
        </div>
      </div>

      {/* Teléfono: una columna. Computador: vehículos a la izquierda; notificaciones y cuenta a la derecha. */}
      <div className="perfil-rejilla">
        <div>
          <section className="pantalla" style={{ padding: 0, gap: 10 }} aria-labelledby="titulo-vehiculos">
            <h2 id="titulo-vehiculos" className="suave" style={{ margin: 0, fontWeight: 600 }}>
              Mis vehículos
            </h2>
            {vehiculos.map((v) => (
              <div key={v.id} className="tarjeta-grande fila">
                <div>
                  <div className="cifra-l" style={{ fontSize: 22, letterSpacing: "0.06em" }}>
                    {v.placa}
                  </div>
                  <div className="suave">
                    {v.marca} {v.modelo} · {v.color}
                  </div>
                </div>
                <Icono nombre="carro" />
              </div>
            ))}
            <FormularioVehiculo abierto={vehiculos.length === 0} />
          </section>
        </div>
        <div>
          <BotonNotificaciones modo="perfil" />

          {esAdministrador(usuario) && (
            <Link href="/admin/estacionamientos" className="fila-enlace oscura">
              Administrar
              <Icono nombre="flecha" />
            </Link>
          )}

          <form action={salir}>
            <button type="submit" className="fila-enlace salir">
              Salir
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
