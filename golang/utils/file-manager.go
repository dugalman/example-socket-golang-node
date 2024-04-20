package utils

import (
	"fmt"
	"log"
	"os"
)

// CLASS
type FileManager struct {
	rutaArchivo string
}

// CONSTRUCTOR
func NewFileManager(nombreArchivo string) (*FileManager, error) {
	rutaArchivo := nombreArchivo
	if _, err := os.Stat(rutaArchivo); os.IsNotExist(err) {
		return nil, fmt.Errorf("el archivo %s no existe", rutaArchivo)
	}
	return &FileManager{rutaArchivo: rutaArchivo}, nil
}

// method
func (fm *FileManager) Apppend(data string) {

	file, err := os.OpenFile(fm.rutaArchivo, os.O_CREATE|os.O_APPEND|os.O_WRONLY, 0644)
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()

	_, err = file.Write([]byte(data))
	if err != nil {
		log.Fatal(err)
	}

	if err != nil {
		log.Fatal(err)
	}

}
