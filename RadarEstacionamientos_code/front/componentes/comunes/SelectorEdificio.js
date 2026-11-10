// @HU-6.1 Registrar y actualizar el catálogo de edificios UCAB · German — la lista que ve el usuario
// @HU-7.2 Sugerir el estacionamiento libre más cercano · Manuel
// Lista desplegable de edificios del catálogo (HU 6.1). La usa la pantalla /sugerencia.
import estilos from "@/estilos/formularios.module.css";

// @HU-6.1 Registrar y actualizar el catálogo de edificios UCAB · German
// Muestra la lista desplegable de edificios del catálogo; la usa BuscadorSugerencia en /sugerencia. HU 6.1.
// Es la misma lista que mantiene el administrador en /admin/edificios (la usarán la HU 2.4 y la HU 7.2).
export default function SelectorEdificio({
  edificios,
  name = "edificioId",
  defaultValue = "",
  disabled = false,
  etiqueta = "Edificio de la materia",
}) {
  return (
    <label className={estilos.campo}>
      {etiqueta}
      <select name={name} defaultValue={defaultValue} required disabled={disabled}>
        <option value="" disabled>
          Elige el edificio
        </option>
        {edificios.map((e) => (
          <option key={e.id} value={e.id}>
            {e.nombre}
          </option>
        ))}
      </select>
    </label>
  );
}
