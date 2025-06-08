package com.example.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.domain.Sort;

import com.example.backend.entity.Request;
import com.example.backend.entity.RequestStatus;

public interface RequestRepository extends JpaRepository<Request, Long> {
    List<Request> findByStatus(RequestStatus status);
    
    @Query("SELECT r FROM Request r LEFT JOIN FETCH r.photoUrls ORDER BY r.createdAt DESC")
    List<Request> findAllWithPhotos();
    
    List<Request> findByRequesterName(String requesterName, Sort sort);
    
    List<Request> findByAssigneeName(String assigneeName, Sort sort);
}