#!/bin/bash

# Nombre de los archivos XML
xml_enviados="./logs/producer.log"
xml_recibidos="./logs/server.log"

echo "" > $xml_recibidos
echo "" > $xml_enviados

# Iniciar el servidor en segundo plano y redirigir la salida al archivo xml_recibidos.xml
echo "Iniciando el servidor..."
npm run server > /dev/null &

# Esperar unos segundos para que el servidor se inicie completamente
sleep 3

# Iniciar el productor y redirigir la salida al archivo xml_enviados.xml
echo "Iniciando el productor..."
npm run producer > /dev/null

# Finalizar el servidor
echo "Finalizando el servidor..."
pkill node

# Comparar los archivos XML enviados y recibidos
echo "Comparando los archivos XML..."
if diff $xml_enviados $xml_recibidos >/dev/null; then
    echo "SUCCESS"
else
    echo "ERRROR !!!!!"
fi

