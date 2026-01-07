package com.example.demo.service;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.example.demo.entity.Citizen;
import com.example.demo.entity.Complaint;
import com.example.demo.entity.Feedback;
import com.example.demo.entity.Officer;
import com.example.demo.payload.FeedbackViewResponse;
import com.example.demo.repositories.ComplaintRepository;
import com.example.demo.repositories.OfficerRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OfficerFeedbackService {

    private final ComplaintRepository complaintRepository;
    private final OfficerRepository officerRepository;

    // 📌 Officer can see feedback on his complaints
    public List<FeedbackViewResponse> getMyComplaintFeedbacks(Authentication authentication) {

        Officer officer = (Officer) authentication.getPrincipal();
        if (officer == null) {
            throw new RuntimeException("Officer not found or not authenticated");
        }

        List<Complaint> complaints = complaintRepository.findByAssignedOfficer(officer);
        System.out.println("Officer " + officer.getEmail() + " has " + complaints.size() + " assigned complaints");

        List<Complaint> withFeedback = complaints.stream()
                .filter(c -> c.getFeedback() != null)
                .toList();
        System.out.println("Complaints with feedback: " + withFeedback.size());

        return withFeedback.stream()
                .map(this::mapToResponse)
                .toList();
    }

    private FeedbackViewResponse mapToResponse(Complaint c) {
        Feedback f = c.getFeedback();
        Citizen citizen = c.getCitizen();

        return FeedbackViewResponse.builder()
                .complaintId(c.getId())
                .complaintTitle(c.getTitle())
                .complaintCategory(c.getCategory() != null ? c.getCategory().name() : null)
                .complaintStatus(c.getStatus().name())

                .citizenId(citizen.getId())
                .citizenName(citizen.getName())
                .citizenLocation(citizen.getAddress())

                .rating(f.getRating())
                .officerBehaviourRating(f.getOfficerBehaviourRating())
                .resolutionStatus(f.getResolutionStatus())
                .timeliness(f.getTimeliness())
                .feedbackComment(f.getFeedbackComment())
                .reopened(f.getReopened())
                .submittedAt(f.getFeedbackSubmittedAt())
                .build();
    }
}
