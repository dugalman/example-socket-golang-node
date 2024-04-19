import net from 'net';

interface MessageType {
  header: {
    size: number;
    uuid: string;
    processID: number;
  };
  body: string;
}

const bufferSize = 512;

function main() {
  const server = net.createServer((conn) => {
    console.log('Cliente conectado.');

    conn.on('data', (headerBuf) => {
      const header: MessageType['header'] = getHeader(headerBuf);

      let body: Buffer = Buffer.alloc(0);
      body = getBody(conn, body, header);
    });

    conn.on('error', (err) => {
      console.error('Error de conexión:', err);
    });

    conn.on('end', () => {
      console.log('Conexión cerrada por el cliente.');
    });
  });

  server.on('error', (err) => {
    console.error('Error en el servidor:', err);
  });

  server.listen(8080, () => {
    console.log('Servidor TCP iniciado. Esperando conexiones...');
  });
}

main();

function getHeader(headerBuf: Buffer): { size: number; uuid: string; processID: number; } {
  return {
    size: headerBuf.readUInt16BE(0),
    uuid: headerBuf.toString('utf-8', 2, 18),
    processID: headerBuf.readUInt32BE(18),
  };
}

function getBody(conn: net.Socket, body: Buffer, header: { size: number; uuid: string; processID: number; }) {
  conn.on('data', (data) => {
    body = Buffer.concat([body, data]);

    if (body.length >= header.size) {
      const xmlData = body.toString('utf-8', 0, header.size);
      console.log(`XML recibido (UUID: ${header.uuid}, ProcessID: ${header.processID}):`, xmlData);
      body = Buffer.alloc(0); // Limpiar el buffer de cuerpo
    }
  }
  );
  return body;
}

