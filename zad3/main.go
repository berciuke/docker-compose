package main

import (
	"fmt"
	"runtime"
)

func main() {
	switch runtime.GOOS {
	case "linux":
		fmt.Println("Witaj na Linuxie!")
	case "windows":
		fmt.Println("Witaj w Windows!")
	default:
		fmt.Printf("Witaj na %s!\n", runtime.GOOS)
	}
	
	fmt.Printf("System: %s\n", runtime.GOOS)
	fmt.Printf("Architektura: %s\n", runtime.GOARCH)
} 