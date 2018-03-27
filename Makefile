BINARY = kommentator
VERSION?=?
COMMIT=$(shell git rev-parse HEAD)
BRANCH=$(shell git rev-parse --abbrev-ref HEAD)
GOARCH=amd64

LDFLAGS = -ldflags "-X main.VERSION=${VERSION} -X main.COMMIT=${COMMIT} -X main.BRANCH=${BRANCH}"

frontend:
	echo "building frontend"; \
	cd frontend; \
	yarn && yarn build;

embed-frontend: frontend
	cd web && rice embed-go;

clean:
	echo "cleaning frontend"; \
	cd frontend && yarn clean;
	rm -rf build/

darwin:
	cd cli; \
	GOOS=darwin GOARCH=amd64 go build ${LDFLAGS} -o ../build/${BINARY}-macos-${GOARCH}

release: embed-frontend	darwin


.PHONY: frontend clean embed-frontend