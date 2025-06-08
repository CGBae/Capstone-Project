package com.example.backend.dto;

import java.util.List;
import com.example.backend.entity.RequestStatus;

import lombok.Getter;
import lombok.Setter;
import lombok.Data;

@Data
@Getter
@Setter
public class RequestDto {
    private Long id;
    private String title;
    private String requesterName;
    private String assigneeName;
    private String description;
    private List<String> photoUrls;
    private String videoUrl;
    private String resultVideoUrl;
    private RequestStatus status;
}