# Paquetes quebrados

Mi apliacion golang, abre un socket TCP, donde empiezo a recivir datos, estos "datos" estan formados por un header y un body. 

- El **header** contiene una estructura con los Size, UUID, ProcessID.
  - Size (uint16)es el tamaño del body
  - UUID ([16]byte) es un id unico que identifica la conexíon actual con el servidor
  - ProcessID(uint32) permite identificar a cada productor.
- El **body** es un string de tamaño variable que se interpreta como un XML.

Pero en read del socket a veces el read me queda chico. Ejemplo el buffer de read es de 512bytes, pero me llega un campo h que llega 1024 bytes entonces tengo que hacer varios read para leer todo el body, 

El archivo `server.go` abre un puerto 8080 y espera paquetes que tienen un header y body


## Como usar el sistema

1. Arrancar el servidor con `go run ./server.go`, se tiene que ver el mensaje **"Servidor TCP iniciado. Esperando conexiones..."**
2. Arrancar un cliente indicando un processID con `go run ./producer.go  ${processID}`, esto va a enviar 3 paquetes. Se debe ver una leyenda que indica si se pudo enviar
3. Si se quiere enviar paquetes todo el tiempo usar  `watch "go run ./producer.go  ${processID}"`

### Ejemplo de corrida en el SERVER

```bash 
08:16 $ go run ./server.go
Servidor TCP iniciado. Esperando conexiones...
Cliente conectado.
    bodySize 0,   BUFFER_SIZE 32, toRead 32 , n 32, remaining 330 | <counter vltid="7805" date="2023 
    bodySize 32,  BUFFER_SIZE 32, toRead 32 , n 32, remaining 298 | /12/19 14:00:00" denom="1" ci="4 
    bodySize 64,  BUFFER_SIZE 32, toRead 32 , n 32, remaining 266 | 9842000" co="47216500" dr="14110 
    bodySize 96,  BUFFER_SIZE 32, toRead 32 , n 32, remaining 234 | 376" jp="0" cc="11484876" hpcc=" 
    bodySize 128, BUFFER_SIZE 32, toRead 32 , n 32, remaining 202 | 78831000" jj="53306" jg="29535"  
    bodySize 160, BUFFER_SIZE 32, toRead 32 , n 32, remaining 170 | pa="352" pwr="19" cxb="11208000" 
    bodySize 192, BUFFER_SIZE 32, toRead 32 , n 32, remaining 138 |  tci="0" tco="0" hl="0" ca="0" t 
    bodySize 224, BUFFER_SIZE 32, toRead 32 , n 32, remaining 106 | i="2902376" to="32653876" mpeb=" 
    bodySize 256, BUFFER_SIZE 32, toRead 32 , n 32, remaining 74  | 0" apeb="0" app="0" mpp="0" tkiq 
    bodySize 288, BUFFER_SIZE 32, toRead 32 , n 32, remaining 42  | ty="48" tkoqty="2068" capr="0" s 
    bodySize 320, BUFFER_SIZE 32, toRead 10 , n 10, remaining 10  | tate="0"/> 
  XML header: {330 0998b243-885c-4232-b950-b6f1a23e7a5a 3333}
  XML recibido: <counter vltid="7805" date="2023/12/19 14:00:00" denom="1" ci="49842000" co="47216500" dr="14110376" jp="0" cc="11484876" hpcc="78831000" jj="53306" jg="29535" pa="352" pwr="19" cxb="11208000" tci="0" tco="0" hl="0" ca="0" ti="2902376" to="32653876" mpeb="0" apeb="0" app="0" mpp="0" tkiqty="48" tkoqty="2068" capr="0" state="0"/>
    bodySize 0,   BUFFER_SIZE 32, toRead 32 , n 32, remaining 213 | <counter vltid="7806" date="2024 
    bodySize 32,  BUFFER_SIZE 32, toRead 32 , n 32, remaining 181 | /12/19 15:00:00" denom="1" ci="4 
    bodySize 64,  BUFFER_SIZE 32, toRead 32 , n 32, remaining 149 | 9842001" co="47216501" dr="14110 
    bodySize 96,  BUFFER_SIZE 32, toRead 32 , n 32, remaining 117 | 377" jp="0" jj="53307" to="32653 
    bodySize 128, BUFFER_SIZE 32, toRead 32 , n 32, remaining 85  | 877" mpeb="1" apeb="1" app="1" m 
    bodySize 160, BUFFER_SIZE 32, toRead 32 , n 32, remaining 53  | pp="1" tkiqty="49" tkoqty="2069" 
    bodySize 192, BUFFER_SIZE 32, toRead 21 , n 21, remaining 21  |  capr="1" state="1"/> 
  XML header: {213 0998b243-885c-4232-b950-b6f1a23e7a5a 3333}
  XML recibido: <counter vltid="7806" date="2024/12/19 15:00:00" denom="1" ci="49842001" co="47216501" dr="14110377" jp="0" jj="53307" to="32653877" mpeb="1" apeb="1" app="1" mpp="1" tkiqty="49" tkoqty="2069" capr="1" state="1"/>
    bodySize 0,   BUFFER_SIZE 32, toRead 32 , n 32, remaining 204 | <counter vltid="7807" date="2024 
    bodySize 32,  BUFFER_SIZE 32, toRead 32 , n 32, remaining 172 | /12/20 16:00:00" denom="1" ci="4 
    bodySize 64,  BUFFER_SIZE 32, toRead 32 , n 32, remaining 140 | 9842001" co="47216501" dr="14110 
    bodySize 96,  BUFFER_SIZE 32, toRead 32 , n 32, remaining 108 | 377" jp="0" jj="53307" to="32653 
    bodySize 128, BUFFER_SIZE 32, toRead 32 , n 32, remaining 76  | 877" apeb="1" app="1" mpp="1" tk 
    bodySize 160, BUFFER_SIZE 32, toRead 32 , n 32, remaining 44  | iqty="49" tkoqty="2069" capr="1" 
    bodySize 192, BUFFER_SIZE 32, toRead 12 , n 12, remaining 12  |  state="1"/> 
  XML header: {204 0998b243-885c-4232-b950-b6f1a23e7a5a 3333}
  XML recibido: <counter vltid="7807" date="2024/12/20 16:00:00" denom="1" ci="49842001" co="47216501" dr="14110377" jp="0" jj="53307" to="32653877" apeb="1" app="1" mpp="1" tkiqty="49" tkoqty="2069" capr="1" state="1"/>
```


### Ejemplo de corrida en el PRODUCER

```bash
08:15 $ go run ./producer.go 3333
xxxxx [3333]
Enviando Header body size  330
Enviando Header process ID 3333
Enviando Header UUID       5194897b-64ad-414a-ad85-64b3d8aefd53
Enviando Body              <counter vltid="7805" date="2023/12/19 14:00:00" denom="1" ci="49842000" co="47216500" dr="14110376" jp="0" cc="11484876" hpcc="78831000" jj="53306" jg="29535" pa="352" pwr="19" cxb="11208000" tci="0" tco="0" hl="0" ca="0" ti="2902376" to="32653876" mpeb="0" apeb="0" app="0" mpp="0" tkiqty="48" tkoqty="2068" capr="0" state="0"/>
Mensaje enviado correctamente.
Enviando Header body size  213
Enviando Header process ID 3333
Enviando Header UUID       5194897b-64ad-414a-ad85-64b3d8aefd53
Enviando Body              <counter vltid="7806" date="2024/12/19 15:00:00" denom="1" ci="49842001" co="47216501" dr="14110377" jp="0" jj="53307" to="32653877" mpeb="1" apeb="1" app="1" mpp="1" tkiqty="49" tkoqty="2069" capr="1" state="1"/>
Mensaje enviado correctamente.
Enviando Header body size  204
Enviando Header process ID 3333
Enviando Header UUID       5194897b-64ad-414a-ad85-64b3d8aefd53
Enviando Body              <counter vltid="7807" date="2024/12/20 16:00:00" denom="1" ci="49842001" co="47216501" dr="14110377" jp="0" jj="53307" to="32653877" apeb="1" app="1" mpp="1" tkiqty="49" tkoqty="2069" capr="1" state="1"/>
Mensaje enviado correctamente.
```

## PROYECTO EN NODE

En la carpeta node, se encuentra los archivos golang migrados a node con typescript, 

- Para ejecutar el serser usar `node run server`
- Para ejecutar el producer usar `node run producer 1234`

LOS ARCHIVOS NODE SON INTERCAMBIABLES CON LOS DE GOLANG


## LINKS

- https://medium.com/@alejodev95/gu%C3%ADa-completa-para-configurar-y-dominar-typescript-proyecto-desde-cero-6523248a9c5d
- [inicializar proyecto TS](https://github.com/matiasjaliff/node-typescript-setup)
- [Proyectos en Node.js + TypeScript: setup completo y conciso](https://medium.com/@matiasjaliff/proyectos-en-node-js-typescript-setup-completo-y-conciso-8acdc6abff2c)