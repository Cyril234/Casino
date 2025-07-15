package com.example.casinobackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.example.casinobackend.services.NFCReader;

@SpringBootApplication
public class CasinoBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(CasinoBackendApplication.class, args);
		NFCReader nfcReader = new NFCReader();
		nfcReader.scanUID();
	}

}
