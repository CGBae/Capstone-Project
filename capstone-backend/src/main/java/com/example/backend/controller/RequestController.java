package com.example.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.RequestDto;
import com.example.backend.entity.Request;
import com.example.backend.service.RequestService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/requests")
@RequiredArgsConstructor
public class RequestController {

    private final RequestService requestService;

    @PostMapping
    public ResponseEntity<Request> createRequest(@RequestBody RequestDto dto) {
        Request createdRequest = requestService.createRequest(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdRequest);
    }

    @GetMapping
    public ResponseEntity<List<Request>> getAllRequests() {
        return ResponseEntity.ok(requestService.getAllRequests());
    }
    
    @GetMapping("/list")
    public ResponseEntity<List<RequestDto>> list() {
        List<RequestDto> requestList = requestService.getRequestList();
        return ResponseEntity.ok(requestList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Request> getRequest(@PathVariable Long id) {
        return ResponseEntity.ok(requestService.getRequestById(id));
    }
    
    @GetMapping("/my-requests")
    public ResponseEntity<List<RequestDto>> getMyRequests(
            @RequestParam("requesterName") String requesterName
    ) {
        List<RequestDto> list = requestService.getMyRequests(requesterName);
        return ResponseEntity.ok(list);
    }
    
    @PatchMapping("/{id}")
    public ResponseEntity<RequestDto> updateRequest(
            @PathVariable Long id,
            @RequestBody RequestDto dto
    ) {
        RequestDto updated = requestService.updateRequest(id, dto);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/assigned")
    public ResponseEntity<List<RequestDto>> getAssignedRequests(
            @RequestParam("assigneeName") String assigneeName
    ) {
        List<RequestDto> list = requestService.getAssignedRequests(assigneeName);
        return ResponseEntity.ok(list);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRequest(@PathVariable Long id) {
        requestService.deleteRequest(id);
        return ResponseEntity.noContent().build();
    }
}