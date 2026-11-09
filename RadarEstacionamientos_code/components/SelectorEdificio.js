import estilos from "../app/formularios.module.css";

// HU 6.1: el usuario elige el edificio de una materia de esta lista, que es la misma
// que mantiene el administrador en /admin/edificios. La usarán la HU 2.4 (edificio y
// aula de cada NRC) y la HU 7.2 (estacionamiento más cercano al edificio).
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
