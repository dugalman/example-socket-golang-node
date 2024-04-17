package main

import (
	"encoding/binary"
	"fmt"
	"net"
)

type Message struct {
	Header uint16
	Body   string
}

func main() {
	// Establece la conexión TCP con el servidor en el puerto 8080
	conn, err := net.Dial("tcp", "localhost:8080")
	if err != nil {
		fmt.Println("Error al conectar:", err)
		return
	}
	defer conn.Close()

	// XML de ejemplo
	xmlData := `<counter vltid="7805" date="2023/12/19 14:00:00" denom="1" ci="49842000" co="47216500" dr="14110376" jp="0" cc="11484876" hpcc="78831000" jj="53306" jg="29535" pa="352" pwr="19" cxb="11208000" tci="0" tco="0" hl="0" ca="0" ti="2902376" to="32653876" mpeb="0" apeb="0" app="0" mpp="0" tkiqty="48" tkoqty="2068" capr="0" state="0"/>`

	// Convertir el XML a bytes en UTF-8
	xmlBytes := []byte(xmlData)

	// fmt.Printf("xxxxxx %d - %v \n", uint16(len(xmlData)), xmlBytes)

	// Crear el mensaje con el tamaño del cuerpo
	message := Message{
		Header: uint16(len(xmlBytes)),
		Body:   xmlData,
	}

	fmt.Println("Enviando ", message.Header, message.Body)

	// Convertir el tamaño del cuerpo a bytes y enviarlo como header

	// headerBuf := make([]byte, 1)
	headerBuf := make([]byte, 2)
	// headerBuf[0] = message.Header
	binary.BigEndian.PutUint16(headerBuf, message.Header)
	_, err = conn.Write(headerBuf)
	if err != nil {
		fmt.Println("Error al enviar el header:", err)
		return
	}

	// Enviar el cuerpo (XML)
	_, err = conn.Write([]byte(message.Body))
	if err != nil {
		fmt.Println("Error al enviar el cuerpo:", err)
		return
	}

	fmt.Println("Mensaje enviado correctamente.")
}
