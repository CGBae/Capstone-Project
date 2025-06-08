package com.example.backend.entity;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Request {

    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    private String requesterName;
    
    private String assigneeName;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "request_photo_urls", joinColumns = @JoinColumn(name = "request_id"))
    @Column(name = "photo_urls")
    private List<String> photoUrls;

    private String videoUrl;
    private String resultVideoUrl;

    @Enumerated(EnumType.STRING)
    private RequestStatus status;

    private LocalDateTime createdAt;
}