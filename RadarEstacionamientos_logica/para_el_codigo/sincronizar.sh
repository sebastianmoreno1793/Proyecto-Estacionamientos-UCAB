#!/usr/bin/env bash
# Copia al repositorio de código los documentos que necesita el ejecutor.
# Dirección única: logica -> code. Nunca al revés.
#
# Qué NO se copia, y no es olvido: el material de negocio, las reuniones y la bitácora.
# Todo lo que se meta aquí se le carga al ejecutor en cada sesión y le come el contexto
# que necesita para el código.
set -e
L="$(cd "$(dirname "$0")/.." && pwd)"
D="$L/../RadarEstacionamientos_code/docs"
mkdir -p "$D/decisiones"

ANTES="$(mktemp)"
( cd "$D/.." && find docs CONTEXTO.md -type f 2>/dev/null -exec md5sum {} + ) | sort -k2 > "$ANTES" || true

cp "$L"/decisiones/D-0*.md   "$D/decisiones/"
cp "$L"/decisiones/README.md "$D/decisiones/"
# --- añade aquí SOLO los documentos que el ejecutor necesita para programar ---
cp "$L"/arquitectura/stack_y_arquitectura.md "$D/"
cp "$L"/producto/backlog_y_iteraciones.md "$D/"
cp "$L"/producto/calendario_de_entregas.md "$D/"
cp "$L"/negocio/problema_y_usuarios.md "$D/"
# cp "$L"/negocio/reglas_de_negocio.md    "$D/"
cp "$L"/para_el_codigo/ciclo_de_sesiones.md "$D/"
cp "$L"/para_el_codigo/CONTEXTO.md            "$D/../CONTEXTO.md"
#
# ⚠️ Antes de añadir una línea aquí: ¿esto es un documento, o son datos?
#    Los datos del cliente van a la carpeta ignorada, nunca a docs/.

# Aplanar rutas: en el repo todo vive en docs/ y docs/decisiones/
find "$D" -maxdepth 1 -name '*.md' -exec sed -i \
  -e 's#\.\./decisiones/#decisiones/#g' \
  -e 's#\.\./arquitectura/##g' -e 's#\.\./negocio/##g' \
  -e 's#\.\./producto/##g'     -e 's#\.\./para_el_codigo/##g' {} +
find "$D/decisiones" -name '*.md' -exec sed -i \
  -e 's#\.\./arquitectura/##g' -e 's#\.\./negocio/##g' -e 's#\.\./producto/##g' {} +

# Registro de qué cambió. Sin esto, el ejecutor no tiene forma de saber que un documento
# se movió bajo sus pies entre una lectura y la siguiente.
DESPUES="$(mktemp)"
( cd "$D/.." && find docs CONTEXTO.md -type f -exec md5sum {} + ) | sort -k2 > "$DESPUES"
CAMBIOS="$(join -j 2 -v 2 "$ANTES" "$DESPUES" 2>/dev/null | awk '{print $1}')
$(join -j 2 -o 1.1,2.1,0 "$ANTES" "$DESPUES" 2>/dev/null | awk '$1 != $2 {print $3}')"
CAMBIOS="$(echo "$CAMBIOS" | grep -v '^$' | grep -v 'ULTIMA_SINCRONIZACION' | sort -u || true)"
REG="$D/ULTIMA_SINCRONIZACION.md"

# Si no cambió nada, no se reescribe el registro: así su fecha es la del último cambio
# de verdad, y correr el script no ensucia el árbol de git.
if [ -z "$CAMBIOS" ] && [ -f "$REG" ]; then
  rm -f "$ANTES" "$DESPUES"; echo "Sin cambios."; exit 0
fi

{
  echo "# Última sincronización"; echo
  echo "**$(date '+%Y-%m-%d %H:%M')**"; echo
  echo "> Lo escribe \`sincronizar.sh\`. No lo edites."
  echo ">"
  echo "> **Compruébalo al empezar cada sesión.** Si la fecha es posterior a cuando"
  echo "> leíste, algo cambió bajo tus pies — y suele ser justo lo que habías señalado."
  echo
  echo "## Cambió en esta pasada"; echo
  echo "$CAMBIOS" | sed 's#^#- `#; s#$#`#'
} > "$REG"

rm -f "$ANTES" "$DESPUES"
echo "Sincronizado. Cambiaron:"; echo "$CAMBIOS" | sed 's/^/  /'
