// ExportadorDeMaqueta · SOLO EN DESARROLLO: guarda el render de la maqueta (página /maqueta) en
// `exportes/`. De ahí se copia a la app base (`public/maqueta/`), que solo la usa como imagen.
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

export class ExportadorDeMaqueta {
  static ARCHIVOS = ["exportes/maqueta-campus.jpg", "exportes/maqueta-campus.json"];

  #carpeta;

  constructor(carpeta = path.join(process.cwd(), "exportes")) {
    this.#carpeta = carpeta;
  }

  // POST /api/exportar-maqueta { imagen: data:image/jpeg;base64,…, datos: { estacionamientos, … } }
  async exportar(request) {
    if (process.env.NODE_ENV === "production") {
      return Response.json({ error: "No encontrado." }, { status: 404 });
    }
    const { imagen, datos } = await request.json();
    const coincidencia = /^data:image\/jpeg;base64,(.+)$/.exec(imagen ?? "");
    if (!coincidencia || !datos?.estacionamientos) {
      return Response.json({ error: "Falta la imagen JPEG o la proyección." }, { status: 400 });
    }
    await mkdir(this.#carpeta, { recursive: true });
    await writeFile(path.join(this.#carpeta, "maqueta-campus.jpg"), Buffer.from(coincidencia[1], "base64"));
    await writeFile(path.join(this.#carpeta, "maqueta-campus.json"), `${JSON.stringify(datos, null, 2)}\n`);
    return Response.json({ archivos: ExportadorDeMaqueta.ARCHIVOS });
  }
}
