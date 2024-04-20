package main

import (
	"encoding/binary"
	"fmt"
	"io"
	"net"

	"github.com/google/uuid"

	utils "dugalman.com/paquetes-quebrados-example/utils"
)

const BUFFER_SIZE = 32

type TipoHeader struct {
	Size      uint16
	Uuid      uuid.UUID
	ProcessID uint32
}

type TipoBody []byte

type TipoMensaje struct {
	Header TipoHeader
	Body   TipoBody
}

func main() {

	// start server
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
			continue // Continuar esperando conexiones
		}
		fmt.Println("Cliente conectado.")

		go handleConnection(conn)
	}
}

func handleConnection(conn net.Conn) {
	defer conn.Close()

	ciclo := 0

	for {
		ciclo++

		// Leer el encabezado
		var header TipoHeader
		headerSize := binary.Size(header)
		headerBuf := make([]byte, headerSize)
		_, err := conn.Read(headerBuf)
		if err != nil {
			if err != io.EOF {
				fmt.Println("Error al leer el encabezado:", err)
			}
			return
		}

		// Desempaquetar el encabezado
		header.Size = binary.BigEndian.Uint16(headerBuf[:2])
		copy(header.Uuid[:], headerBuf[2:18])
		header.ProcessID = binary.BigEndian.Uint32(headerBuf[18:])

		// Leer el cuerpo en fragmentos del tamaño adecuado
		var body []byte
		for len(body) < int(header.Size) {
			remaining := int(header.Size) - len(body)

			toRead := min(remaining, BUFFER_SIZE)
			buf := make([]byte, toRead)
			n, err := conn.Read(buf)
			if err != nil {
				fmt.Println("Error al leer el cuerpo:", err)
				return
			}

			// fmt.Printf("    bodySize % 4d, BUFFER_SIZE % 4d, toRead % 4d, n % 4d, remaining % 4d | %v \n", len(body), BUFFER_SIZE, toRead, n, remaining, string(buf))

			body = append(body, buf[:n]...)
		}

		// Procesar el cuerpo (XML en este caso)
		xmlData := string(body)
		// fmt.Println("  XML recibido:", header.ProcessID, header.Uuid, ciclo, xmlData)
		fmt.Println("  XML header:", header)
		fmt.Println("  XML recibido:", xmlData)

		// setup logging
		manager, err := utils.NewFileManager("./logs/server.log")
		if err != nil {
			fmt.Println("Error:", err)
			return
		}
		manager.Apppend(xmlData + "\n")

	}
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}
