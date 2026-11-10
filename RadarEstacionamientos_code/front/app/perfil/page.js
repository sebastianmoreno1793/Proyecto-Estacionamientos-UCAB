// @HU-2.1 Registrar mis vehículos · Samuel — «Mis vehículos» en Perfil
// @HU-8.1 Activar las notificaciones · Manuel — interruptor de notificaciones
// @HU-1.1 Crear cuenta con el correo institucional · Samuel — botón «Salir»
// Pantalla Perfil (/perfil): vehículos, notificaciones, Administrar y Salir.
import Link from "next/link";
import { redirect } from "next/navigation";
import Notificaciones from "@/componentes/notificaciones/Notificaciones";
import { Icono } from "@/componentes/comunes/Iconos";
import FormularioVehiculo from "@/componentes/perfil/FormularioVehiculo";
import { salir } from "@/acciones/cuenta";
import { listarVehiculosDe } from "@back/logica/vehiculos/datos.js";
import { esAdministrador, obtenerUsuarioActual } from "@/servidor/sesion";
import { inicialesDe } from "@back/logica/usuarios/reglas.js";

export const metadata = { title: "Perfil" };

// @HU-2.1 Registrar mis vehículos · Samuel
// @HU-8.1 Activar las notificaciones · Manuel
// Arma Perfil (D-007 v2): Mis vehículos (HU 2.1, solo el dueño ve sus placas), Notificaciones (HU 8.1),
// el enlace Administrar solo para el administrador y el botón Salir (HU 1.1).
// Sin sesión manda a /entrar. [sesion]
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
          <Notificaciones modo="perfil" />

          {esAdministrador(usuario) && (
            <Link href="/admin/puestos" className="fila-enlace oscura">
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
