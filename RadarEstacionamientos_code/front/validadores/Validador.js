// Validador · Clase base. TODAS las validaciones de formato de lo que escribe el usuario están en
// front/validadores/ y solo aquí; el back no las repite (decisión del equipo, según la profesora).
// El back conserva la precondición (sesión y rol) y las reglas de negocio.
//
// validar(datos) → { valido, errores: { campo: mensaje }, error: el primer mensaje, datos: limpios }
// Cada subclase implementa revisar(datos, anotar): anota los errores por campo y devuelve los datos limpios.
export class Validador {
  validar(datos = {}) {
    const errores = {};
    const anotar = (campo, mensaje) => {
      errores[campo] ??= mensaje;
    };
    const limpios = this.revisar(datos, anotar);
    const mensajes = Object.values(errores);
    return { valido: mensajes.length === 0, errores, error: this.resumir(mensajes, errores), datos: limpios };
  }

  // Lo que se muestra arriba del formulario: por defecto, el primer error.
  resumir(mensajes) {
    return mensajes[0] ?? null;
  }

  revisar() {
    throw new Error("Cada validador implementa revisar(datos, anotar).");
  }

  // Quita los espacios de los extremos (texto vacío si no hay nada).
  texto(valor) {
    return String(valor ?? "").trim();
  }
}
