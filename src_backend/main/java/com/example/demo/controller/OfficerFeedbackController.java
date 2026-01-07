package com.example.demo.controller;
import com.example.demo.payload.FeedbackViewResponse;
import com.example.demo.service.OfficerFeedbackService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/officer/feedback")
@RequiredArgsConstructor
@CrossOrigin("*")
public class OfficerFeedbackController {

    private final OfficerFeedbackService feedbackService;

    // Officer sees feedback given on his solved complaints
    @GetMapping("/my")
    public List<FeedbackViewResponse> getMyFeedbacks(Authentication authentication) {
        return feedbackService.getMyComplaintFeedbacks(authentication);
    }
}