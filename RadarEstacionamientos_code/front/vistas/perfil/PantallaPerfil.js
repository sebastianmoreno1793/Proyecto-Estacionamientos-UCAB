"use client";
// @PANTALLA Perfil (/perfil) — mis vehículos, notificaciones, Administrar y el botón «Salir»
// @HU-2.1 Registrar mis vehículos · Samuel — Sección «Mis vehículos» dentro de Perfil
// @HU-8.1 Activar las notificaciones · Manuel — Interruptor de notificaciones en Perfil
// @HU-1.1 Crear cuenta con el correo institucional · Samuel — Botón «Salir» en Perfil para cerrar la sesión
// Vista «interfaz» · Perfil (D-007 v2): Mis vehículos (HU 2.1, solo el dueño ve sus placas),
// Notificaciones (HU 8.1), el enlace Administrar solo para el administrador y el botón Salir (HU 1.1).
// Los datos los piden CuentaControlador y VehiculoControlador (fetch).
import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CuentaControlador } from "@/controladores/CuentaControlador";
import { VehiculoControlador } from "@/controladores/VehiculoControlador";
import { Icono } from "@/vistas/comunes/Iconos";
import Notificaciones from "@/vistas/notificaciones/Notificaciones";
import FormularioVehiculo from "@/vistas/perfil/FormularioVehiculo";

export default function PantallaPerfil() {
  const navegador = useRouter();
  const cuenta = useMemo(() => new CuentaControlador({ navegador }), [navegador]);
  const vehiculos = useMemo(() => new VehiculoControlador(), []);
  const [usuario, setUsuario] = useState(null);
  const [lista, setLista] = useState(null);

  const cargarVehiculos = useCallback(() => vehiculos.listar().then(setLista), [vehiculos]);

  useEffect(() => {
    cuenta.sesion().then(setUsuario);
    cargarVehiculos();
  }, [cuenta, cargarVehiculos]);

  if (!usuario || !lista) return <main className="pantalla"><p className="suave">Cargando…</p></main>;

  return (
    <main className="pantalla">
      <div className="fila" style={{ justifyContent: "flex-start", gap: 14 }}>
        <span className="avatar-grande" aria-hidden="true">
          {usuario.iniciales()}
        </span>
        <div style={{ minWidth: 0 }}>
          <h1 style={{ fontSize: 17, lineHeight: "22px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
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
            {lista.map((v) => (
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
            <FormularioVehiculo abierto={lista.length === 0} alRegistrar={cargarVehiculos} />
          </section>
        </div>
        <div>
          <Notificaciones modo="perfil" />

          {usuario.esAdministrador() && (
            <Link href="/admin/puestos" className="fila-enlace oscura">
              Administrar
              <Icono nombre="flecha" />
            </Link>
          )}

          {/* HU 1.1: Salir cierra la sesión (fetch DELETE /api/sesion) y lleva a /entrar. */}
          <button type="button" className="fila-enlace salir" onClick={() => cuenta.salir()}>
            Salir
          </button>
        </div>
      </div>
    </main>
  );
}
