# Radar · Historias de usuario (extensión de VS Code)

Lee las etiquetas `@HU-x.y Nombre · Responsable — detalle` del código y te dice **de qué HU es cada archivo sin abrirlo**.

## Instalar (una sola vez)

```bash
code --install-extension herramientas/radar-hu/radar-hu.vsix
```

Abre la carpeta raíz del repo en VS Code.

## Qué hace

| Dónde | Qué ves |
|---|---|
| Explorador | Cada archivo con etiquetas lleva a la derecha el número de su épica (`6` = HU 6.x, `9+` = varias HU). **Pasa el mouse** por encima y sale el nombre completo: «HU 6.1 · Registrar y actualizar el catálogo de edificios UCAB (German)». |
| ⌘⌥H (o el ícono de libro arriba del explorador) | Buscador de HU: escribe `6.1` o `edificios`, elige la HU y te lista todos sus archivos; al elegir uno se abre en la línea de la etiqueta. |
| Clic derecho en un archivo → «¿De qué HU es este archivo?» | Te dice sus HU sin abrirlo y te deja saltar a los demás archivos de esa HU. |
| Barra de abajo | Las HU del archivo abierto. Clic para ver los demás archivos de esa HU. |

## Si cambias la extensión

```bash
cd herramientas/radar-hu
npx @vscode/vsce package --skip-license -o radar-hu.vsix
code --install-extension radar-hu.vsix --force
```
