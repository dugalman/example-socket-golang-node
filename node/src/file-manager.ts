import fs from 'fs';

export class FileManager {
    private readonly rutaArchivo: string;

    constructor(nombreArchivo: string) {
        this.rutaArchivo = `${nombreArchivo}`;
    }

    private esEscribible(): boolean {
        try {
            fs.accessSync(this.rutaArchivo, fs.constants.W_OK);
            return true;
        } catch (err) {
            return false;
        }
    }

    apppend(data: string): void {

        if (!fs.existsSync(this.rutaArchivo) || !this.esEscribible()) {
            throw new Error(`La ruta del archivo '${this.rutaArchivo}' no existe o no es escribible.`);
        }
        try {
            fs.writeFileSync(this.rutaArchivo, data, { flag: 'a' });
        } catch (err) {
            console.error('Error al guardar el archivo:', err);
        }
    }
}

