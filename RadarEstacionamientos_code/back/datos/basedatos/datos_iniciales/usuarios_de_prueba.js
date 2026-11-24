// @HU-1.1 Crear cuenta con el correo institucional · Samuel — Las tres cuentas de prueba (administrador, estudiante y profesor)
// Cuentas de prueba, una por rol, para ver la app como cada tipo de usuario. Solo existen en
// desarrollo (en producción no se crean). Son correos inventados, no de personas reales.
// El administrador no sale del dominio: se asigna a mano mientras se decide cómo darlo.
export const USUARIOS_DE_PRUEBA = [
  { correo: "admin.prueba@ucab.edu.ve", contrasena: "123456789", rol: "administrador" },
  { correo: "estudiante.prueba@est.ucab.edu.ve", contrasena: "123456789", rol: "estudiante" },
  { correo: "profesor.prueba@ucab.edu.ve", contrasena: "123456789", rol: "profesor" },
];
