// Sesión SIMULADA mientras llega el inicio de sesión real (HU 1.1) y se decide cómo
// se asignan vigilante y administrador (preguntas_abiertas.md #2).
// En desarrollo hay un usuario de prueba con rol de administrador; en producción no hay
// sesión, para que nadie quede como administrador por accidente.
const USUARIO_DE_PRUEBA = { correo: "usuario.prueba@ucab.edu.ve", rol: "administrador" };

export async function obtenerUsuarioActual() {
  if (process.env.NODE_ENV === "production") return null;
  return { ...USUARIO_DE_PRUEBA };
}

export function esAdministrador(usuario) {
  return usuario?.rol === "administrador";
}
