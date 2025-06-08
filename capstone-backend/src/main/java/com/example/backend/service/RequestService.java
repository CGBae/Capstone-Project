package com.example.backend.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.dto.RequestDto;
import com.example.backend.entity.Request;
import com.example.backend.entity.RequestStatus;
import com.example.backend.repository.RequestRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RequestService {

    private final RequestRepository requestRepository;

    @Transactional
    public Request createRequest(RequestDto dto) {
    	List<String> photoUrls = dto.getPhotoUrls();
        
        Request request = Request.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .requesterName(dto.getRequesterName())
                .photoUrls(dto.getPhotoUrls())
                .videoUrl(dto.getVideoUrl())
                .status(RequestStatus.ONGOING)
                .createdAt(LocalDateTime.now())
                .build();

        return requestRepository.save(request);
    }

    @Transactional(readOnly = true)
    public List<Request> getAllRequests() {
        return requestRepository.findAll();
    }
    
    @Transactional(readOnly = true)
    public List<RequestDto> getRequestList() {
        return requestRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"))
            .stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Request getRequestById(Long id) {
        return requestRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("의뢰를 찾을 수 없습니다. ID: " + id));
    }
    
    @Transactional(readOnly = true)
    public List<RequestDto> getMyRequests(String requesterName) {
        return requestRepository
                // 이름으로만 찾을 수도 있고, 필요하면 Sort 추가
                .findByRequesterName(requesterName, Sort.by(Sort.Direction.DESC, "createdAt"))
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public RequestDto updateRequest(Long id, RequestDto dto) {
        Request req = requestRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("의뢰를 찾을 수 없습니다. ID: " + id));

        if (dto.getStatus() != null) {
            req.setStatus(dto.getStatus());
        }
        if (dto.getAssigneeName() != null) {
            req.setAssigneeName(dto.getAssigneeName());
        }
        if (dto.getResultVideoUrl() != null) {
            req.setResultVideoUrl(dto.getResultVideoUrl());
        }
        // 필요한 다른 필드도 동일하게 처리

        Request saved = requestRepository.save(req);
        return convertToDto(saved);
    }

    @Transactional(readOnly = true)
    public List<RequestDto> getAssignedRequests(String assigneeName) {
        return requestRepository
            .findByAssigneeName(assigneeName, Sort.by(Sort.Direction.DESC, "createdAt"))
            .stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }

    @Transactional
    public void deleteRequest(Long id) {
        requestRepository.deleteById(id);
    }
    
    private RequestDto convertToDto(Request request) {
        RequestDto dto = new RequestDto();
        dto.setId(request.getId());
        dto.setTitle(request.getTitle());
        dto.setRequesterName(request.getRequesterName());
        dto.setDescription(request.getDescription());
        dto.setPhotoUrls(request.getPhotoUrls());
        dto.setVideoUrl(request.getVideoUrl());
        dto.setStatus(request.getStatus());
        return dto;
    }
}