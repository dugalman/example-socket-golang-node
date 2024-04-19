import net from 'net';
import { v4 as uuidv4 } from 'uuid';

import { FileManager } from './file-manager'
import path from 'path';

const PRODUCER_PATH_LOG = path.join(__dirname, '../logs', 'producer.log')

interface MessageType {
  header: {
    size: number;
    uuid: string;
    processID: number;
  };
  body: string;
}

function main() {
  const args = process.argv.slice(2);
  const processID = args.length > 0 ? parseInt(args[0]) : 12345;
  const manager = new FileManager(PRODUCER_PATH_LOG);

  const conn = net.createConnection({ port: 8080 }, () => {
    console.log('Conexión establecida con el servidor.');
  });

  conn.on('error', (err) => {
    console.error('Error de conexión:', err);
  });

  conn.on('close', () => {
    console.log('Conexión cerrada.');
  });

  conn.on('connect', () => {

    console.log('Cliente conectado.');
    sendCustom(manager, processID, conn);
    // sendToManyAndRandow(manager, processID, conn);
    conn.end()
  });
}

main();

const sendXML = (xmlData: string, processID: number, conn: net.Socket) => {
  const processUUID = uuidv4();
  const xmlBytes = Buffer.from(xmlData, 'utf-8');
  const message: MessageType = {
    header: {
      size: xmlBytes.length,
      uuid: processUUID,
      processID: processID,
    },
    body: xmlData,
  };

  const headerBuf = Buffer.alloc(2 + 16 + 4);
  headerBuf.writeUInt16BE(message.header.size, 0);
  Buffer.from(message.header.uuid, 'utf-8').copy(headerBuf, 2);
  headerBuf.writeUInt32BE(message.header.processID, 18);

  console.log('HEADER', headerBuf.length, buffer2string(headerBuf));
  console.log('BODY', xmlBytes.length, buffer2string(xmlBytes));

  conn.write(headerBuf);
  conn.write(xmlBytes);
  console.log('Mensaje enviado correctamente.');
}



const buffer2string = (buffer: Buffer): string => {
  const bytes = buffer.toJSON().data;
  const byteStrings = bytes.map(byte => byte.toString(16).padStart(2, '0').toLocaleUpperCase());
  return `[${byteStrings.join(' ')}]`;
}


function sendCustom(manager: FileManager, processID: number, conn: net.Socket) {
  const xmlDataListStatic: string[] = [
    `<counter vltid="7801" date="2023/12/19 14:00:00" denom="1" ci="49842000" co="47216500" dr="14110376" jp="0" cc="11484876" hpcc="78831000" jj="53306" jg="29535" pa="352" pwr="19" cxb="11208000" tci="0" tco="0" hl="0" ca="0" ti="2902376" to="32653876" mpeb="0" apeb="0" app="0" mpp="0" tkiqty="48" tkoqty="2068" capr="0" state="0"/>`,
    // Agrega más XML aquí si es necesario
    `<counter vltid="7802" date="2024/12/19 15:00:00" denom="1" ci="49842001" co="47216501" dr="14110377" jp="0" jj="53307" to="32653877" mpeb="1" apeb="1" app="1" mpp="1" tkiqty="49" tkoqty="2069" capr="1" state="1"/>`,
    `<counter vltid="7803" date="2024/12/20 16:00:00" denom="1" ci="49842001" co="47216501" dr="14110377" jp="0" jj="53307" to="32653877" apeb="1" app="1" mpp="1" tkiqty="49" tkoqty="2069" capr="1" state="1"/>`,
    `<counter vltid="7804" date="2024/12/21 16:00:00" denom="1" ci="49842001" co="47216501" dr="14110377" jp="0" jj="53307" to="32653877" apeb="1" app="1" mpp="1" tkiqty="49" tkoqty="2069" capr="1" state="1"/>`,
    `<counter vltid="7805" date="2024/12/22 16:00:00" denom="1" ci="49842001" co="47216501" dr="14110377" jp="0" jj="53307" to="32653877" apeb="1" app="1" mpp="1" tkiqty="49" tkoqty="2069" capr="1" state="1"/>`,
    `<counter vltid="7806" date="2024/12/23 16:00:00" denom="1" ci="49842001" co="47216501" dr="14110377" jp="0" jj="53307" to="32653877" apeb="1" app="1" mpp="1" tkiqty="49" tkoqty="2069" capr="1" state="1"/>`,
    `<counter vltid="7807" date="2024/12/24 16:00:00" denom="1" co="47216501" dr="14110377" jp="0" jj="53307" to="32653877" apeb="1" app="1" mpp="1" tkiqty="49" tkoqty="2069" capr="1" state="1"/>`,
  ];
  xmlDataListStatic.forEach((xmlData) => {
    console.log('body', xmlData);
    manager.apppend(xmlData + "\n");
    sendXML(xmlData, processID, conn);
  });
}

function sendToManyAndRandow(manager: FileManager, processID: number, conn: net.Socket) {
  for (let i: number = 0; i < 100; i++) {
    const xmlData: string = getRanddowTemplate(i);
    // const xmlData: string=`<counter vltid="${i}" date="2023/12/19 14:00:00" denom="1" ci="49842000" co="47216500" dr="14110376" jp="0" cc="11484876" hpcc="78831000" jj="53306" jg="29535" pa="352" pwr="19" cxb="11208000" tci="0" tco="0" hl="0" ca="0" ti="2902376" to="32653876" mpeb="0" apeb="0" app="0" mpp="0" tkiqty="48" tkoqty="2068" capr="0" state="0"/>`;
    console.log('body', xmlData);
    manager.apppend(xmlData + "\n");
    sendXML(xmlData, processID, conn);
  }
}

function getRanddowTemplate(vltid: number) {
  const template: string[] = [
    `<counter vltid="${vltid}" date="2023/12/19 14:00:00" denom="1" ci="49842000" co="47216500" dr="14110376" jp="0" cc="11484876" hpcc="78831000" jj="53306" jg="29535" pa="352" pwr="19" cxb="11208000" tci="0" tco="0" hl="0" ca="0" ti="2902376" to="32653876" mpeb="0" apeb="0" app="0" mpp="0" tkiqty="48" tkoqty="2068" capr="0" state="0" />`,
    `<counter vltid="${vltid}" date="2023/12/19 14:00:00" ci="49842000" co="47216500" dr="14110376" jp="0" cc="11484876" hpcc="78831000" jj="53306" jg="29535" pa="352" pwr="19" cxb="11208000" tci="0" tco="0" hl="0" ca="0" ti="2902376" to="32653876" mpeb="0" apeb="0" app="0" mpp="0" tkiqty="48" tkoqty="2068" capr="0" state="0" />`,
    `<counter vltid="${vltid}" date="2023/12/19 14:00:00" co="47216500" dr="14110376" jp="0" cc="11484876" hpcc="78831000" jj="53306" jg="29535" pa="352" pwr="19" cxb="11208000" tci="0" tco="0" hl="0" ca="0" ti="2902376" to="32653876" mpeb="0" apeb="0" app="0" mpp="0" tkiqty="48" tkoqty="2068" capr="0" state="0" />`,
    `<counter vltid="${vltid}" date="2023/12/19 14:00:00" jp="0" cc="11484876" hpcc="78831000" jj="53306" jg="29535" pa="352" pwr="19" cxb="11208000" tci="0" tco="0" hl="0" ca="0" ti="2902376" to="32653876" mpeb="0" apeb="0" app="0" mpp="0" tkiqty="48" tkoqty="2068" capr="0" state="0" />`,
    `<counter vltid="${vltid}" date="2023/12/19 14:00:00" jp="0" hpcc="78831000" jj="53306" jg="29535" pa="352" pwr="19" cxb="11208000" tci="0" tco="0" hl="0" ca="0" ti="2902376" to="32653876" mpeb="0" apeb="0" app="0" mpp="0" tkiqty="48" tkoqty="2068" capr="0" state="0" />`,
    `<counter vltid="${vltid}" date="2023/12/19 14:00:00" jp="0" jj="53306" jg="29535" pa="352" pwr="19" cxb="11208000" tci="0" tco="0" hl="0" ca="0" ti="2902376" to="32653876" mpeb="0" apeb="0" app="0" mpp="0" tkiqty="48" tkoqty="2068" capr="0" state="0" />`,
    `<counter vltid="${vltid}" date="2023/12/19 14:00:00" jp="0" pa="352" pwr="19" cxb="11208000" tci="0" tco="0" hl="0" ca="0" ti="2902376" to="32653876" mpeb="0" apeb="0" app="0" mpp="0" tkiqty="48" tkoqty="2068" capr="0" state="0" />`,
    `<counter vltid="${vltid}" date="2023/12/19 14:00:00" />`,
  ]
  const high = template.length ;
  const low = 0;
  const position: number = Math.floor(Math.random() * (high - low) + low)

  return template[position];
}