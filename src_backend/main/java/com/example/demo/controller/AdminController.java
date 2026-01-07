package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.Admin;
import com.example.demo.payload.ForgotPasswordRequest;
import com.example.demo.payload.LoginRequest;
import com.example.demo.payload.LoginResponse;
import com.example.demo.payload.OfficerSignupRequest;
import com.example.demo.payload.ResetOfficerPasswordRequest;
import com.example.demo.payload.ResetPasswordRequest;
import com.example.demo.security.JwtUtils;
import com.example.demo.service.AdminService;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private JwtUtils jwtUtils;

    // -------------------- Admin Signup --------------------
    @PostMapping("/signup")
    public String signup(@RequestBody Admin admin) {
        return adminService.signup(admin);
    }

    // -------------------- Admin Login --------------------
    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        return adminService.login(request);
    }

    // -------------------- Create Officer --------------------
    @PostMapping("/create-officer")
    public String createOfficer(@RequestBody OfficerSignupRequest request) {
        return adminService.createOfficer(request);
    }

    // -------------------- Admin Forgot Password --------------------
    @PostMapping("/forgot-password")
    public String forgotPassword(@RequestBody ForgotPasswordRequest request) {
        return adminService.forgotPassword(request);
    }

    // -------------------- Admin Reset Password --------------------
    @PostMapping("/reset-password")
    public String resetPassword(@RequestBody ResetPasswordRequest request) {
        return adminService.resetPassword(request);
    }

    // -------------------- Admin Reset Officer Password --------------------
    @PostMapping("/reset-officer-password")
    public String resetOfficerPassword(@RequestBody ResetOfficerPasswordRequest request) {
        return adminService.resetOfficerPassword(request);
    }

    // -------------------- Get Admin Profile --------------------
    @GetMapping("/profile")
    public Admin getProfile(@RequestHeader("Authorization") String token) {
        // Extract email from JWT token
        String email = jwtUtils.extractEmail(token.replace("Bearer ", ""));
        return adminService.getProfile(email);
    }

    // -------------------- Update Admin Profile --------------------
    @PutMapping("/profile")
    public String updateProfile(@RequestHeader("Authorization") String token, @RequestBody Admin updatedAdmin) {
        String email = jwtUtils.extractEmail(token.replace("Bearer ", ""));
        return adminService.updateProfile(email, updatedAdmin);
    }
}
