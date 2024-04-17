# PAquetes quebrados

Mi apliacion golang, abre un socket TCP, donde empiezo a recivir datos, estos "datos" estan formados por un header y un body. 

- El header contiene un campo "h" que es un uint8 que indica el tamaño del body. 
- El body es una tira de string en formato  XML. 

Pero en read del socket a veces el read me queda chico. Ejemplo el buffer de read es de 512bytes, pero me llega un campo h que llega 1024 bytes entonces tengo que hacer varios read para leer todo el body, 

¿ podrias darme un ejemplo de como leer sin que se trunque el xml?