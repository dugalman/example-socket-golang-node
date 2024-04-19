all: server producer

server:
	go build -o server server.go

producer:
	go build -o producer producer.go

.PHONY: clean

clean:
	rm -f server producer

run_server: server
	./server

run_producer: producer
	./producer

run_producer_with_id: producer
	./producer $(id)