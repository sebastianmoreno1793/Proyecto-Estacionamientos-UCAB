// Configuración de Next (el front). El back vive en ../back y se importa con «@back/…».
import path from "node:path";

const raizDelCodigo = path.join(import.meta.dirname, ".."); // RadarEstacionamientos_code

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Permite compilar archivos de fuera de front/ (el back).
  experimental: { externalDir: true },
  // La raíz es la carpeta del código (front + back), no la carpeta personal.
  outputFileTracingRoot: raizDelCodigo,
};

export default nextConfig;
