FROM golang:1.21-alpine AS builder

WORKDIR /app
COPY go.mod go.sum* ./
RUN go mod download
COPY main.go .

ARG TARGETOS
ARG TARGETARCH
RUN CGO_ENABLED=0 GOOS=$TARGETOS GOARCH=$TARGETARCH go build -o multiplatform-app main.go

FROM scratch AS linux
COPY --from=builder /app/multiplatform-app /multiplatform-app
ENTRYPOINT ["/multiplatform-app"]

FROM mcr.microsoft.com/windows/nanoserver:ltsc2022 AS windows
COPY --from=builder /app/multiplatform-app /multiplatform-app.exe
ENTRYPOINT ["/multiplatform-app.exe"]

FROM ${TARGETOS} AS final 