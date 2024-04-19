import net from 'net';

interface MessageType {
  header: {
    size: number;
    uuid: string;
    processID: number;
  };
  body: string;
}


function main() {
  const server = net.createServer((conn) => {
    console.log('Cliente conectado.');


    let headerBuf: Buffer | null = null;
    let bodyBuf: Buffer | null = null;

    conn.on('data', (data: Buffer) => {

      console.log('RECIVE', data.length, buffer2string(data));
      ({ headerBuf, bodyBuf } = handlerData(headerBuf, data, bodyBuf, conn));
    })
      ;

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


function handlerData(headerBuf: Buffer | null, data: Buffer, bodyBuf: Buffer | null, conn: net.Socket) {

  // TRATO DE RECUPERAR EL HEADER DEL PRIMER PAQUETE
  if (!headerBuf) {
    if (data.length >= 22) {
      headerBuf = data.slice(0, 22);
      bodyBuf = data.slice(22);
    } else {
      console.error('Error: Encabezado demasiado corto.');
      conn.destroy();
    }
  } else {
    bodyBuf = Buffer.concat([bodyBuf!, data]);
  }


  // if (bodyBuf && headerBuf) {
  while (bodyBuf && headerBuf && bodyBuf.length >= 22) {
    const header: MessageType['header'] = {
      size: headerBuf.readUInt16BE(0),
      uuid: headerBuf.toString('utf-8', 2, 18),
      processID: headerBuf.readUInt32BE(18),
    };

    if (bodyBuf.length >= header.size) {
      const xmlData = bodyBuf.toString('utf-8', 0, header.size);
      console.log(`XML recibido (UUID: ${header.uuid}, ProcessID: ${header.processID}):`, xmlData);
      bodyBuf = bodyBuf.slice(header.size);
      headerBuf = null; // Reiniciar para el próximo encabezado
      if (bodyBuf.length >= 22) {
        headerBuf = bodyBuf.slice(0, 22);
        bodyBuf = bodyBuf.slice(22);
      } else {
        headerBuf = null;
      }
    } else {
      break; // No hay suficientes datos para procesar el mensaje completo
    }


  }
  return { headerBuf, bodyBuf };
}


const buffer2string = (buffer: Buffer): string => {
  const bytes = buffer.toJSON().data;
  const byteStrings = bytes.map(byte => byte.toString(16).padStart(2, '0').toLocaleUpperCase());
  return `[${byteStrings.join(' ')}]`;
}