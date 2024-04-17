package main

import (
	//	"encoding/binary"
	"encoding/binary"
	"fmt"
	"net"
)

const BUFFER_SIZE = 32

type Message struct {
	Header uint16
	Body   string
}

func main() {
	ln, err := net.Listen("tcp", ":8080")
	if err != nil {
		fmt.Println("Error al iniciar el servidor:", err)
		return
	}
	defer ln.Close()
	fmt.Println("Servidor TCP iniciado. Esperando conexiones...")

	for {
		conn, err := ln.Accept()
		if err != nil {
			fmt.Println("Error al aceptar la conexión:", err)
			return
		}
		fmt.Println("Cliente conectado.")

		go handleConnection(conn)
	}
}

func handleConnection(conn net.Conn) {
	defer conn.Close()

	// Leer el encabezado
	headerBuf := make([]byte, 2)
	_, err := conn.Read(headerBuf)
	if err != nil {
		fmt.Println("Error al leer el encabezado:", err)
		return
	}

	// bodySize := uint8(header[0])
	bodySize := binary.BigEndian.Uint16(headerBuf)

	// Leer el cuerpo en fragmentos del tamaño adecuado
	var body []byte
	for len(body) < int(bodySize) {
		remaining := int(bodySize) - len(body)

		toRead := min(remaining, BUFFER_SIZE)
		buf := make([]byte, toRead)
		n, err := conn.Read(buf)

		fmt.Printf("bodySize %v, BUFFER_SIZE %v, toRead %v , n %v, remaining %v | %v \n", bodySize, BUFFER_SIZE, toRead, n, remaining, string(buf))

		if err != nil {
			fmt.Println("Error al leer el cuerpo:", err)
			return
		}
		body = append(body, buf[:n]...)
	}

	// Procesar el cuerpo (XML en este caso)
	xmlData := string(body)
	fmt.Println("XML recibido:", xmlData)
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}
