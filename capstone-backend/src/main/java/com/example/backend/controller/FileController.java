package com.example.backend.controller;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileController {

    @Value("${file.upload-dir}")
    private String uploadDir;

    @PostMapping("/upload")
    public ResponseEntity<List<String>> uploadFiles(@RequestParam("files") List<MultipartFile> files) {
        try {
            Files.createDirectories(Paths.get(uploadDir));
            List<String> urls = files.stream().map(file -> {
                String original = file.getOriginalFilename();
                String saved = UUID.randomUUID() + "_" + original;
                Path target = Paths.get(uploadDir).resolve(saved);
                try {
                    file.transferTo(target);
                } catch (IOException e) {
                    throw new UncheckedIOException(e);
                }
                return "/uploads/" + saved;
            }).collect(Collectors.toList());
            return ResponseEntity.ok(urls);
        } catch (IOException|UncheckedIOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}