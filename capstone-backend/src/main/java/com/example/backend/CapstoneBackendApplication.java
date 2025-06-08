package com.example.backend;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.example.backend.entity.Request;
import com.example.backend.repository.RequestRepository;

import lombok.RequiredArgsConstructor;

@SpringBootApplication
@RequiredArgsConstructor
public class CapstoneBackendApplication implements CommandLineRunner {
	
	private final RequestRepository repository;

	public static void main(String[] args) {
		SpringApplication.run(CapstoneBackendApplication.class, args);
	}
	
	@Override
    public void run(String... args) {
        Request entity = new Request();
        entity.setDescription("DB Connection Success!");

        repository.save(entity);
    }

}