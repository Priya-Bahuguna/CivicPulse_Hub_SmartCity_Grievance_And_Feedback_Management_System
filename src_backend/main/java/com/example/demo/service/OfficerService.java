package com.example.demo.service;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.entity.Officer;
import com.example.demo.payload.LoginRequest;
import com.example.demo.payload.LoginResponse;
import com.example.demo.repositories.OfficerRepository;
import com.example.demo.security.JwtUtils;

@Service
public class OfficerService {

    @Autowired
    private OfficerRepository officerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    // Officer Login
    public LoginResponse login(LoginRequest request) {
        Officer officer = officerRepository.findByEmail(request.getEmail());

        if (officer == null || !passwordEncoder.matches(request.getPassword(), officer.getPassword())) {
            return new LoginResponse("❌ Invalid email or password", null, null);
        }

        String token = jwtUtils.generateToken(officer.getEmail(), officer.getRole().name());
        return new LoginResponse("✅ Officer login successful", token, officer.getRole().name());
    }

    // Get Officer Profile
    public Officer getProfile(String email) {
        return officerRepository.findByEmail(email);
    }

    // Update Officer Profile
    public String updateProfile(String email, Officer updatedOfficer) {
        Officer officer = officerRepository.findByEmail(email);
        if (officer == null) {
            return "Officer not found";
        }
        officer.setName(updatedOfficer.getName());
        officer.setEmail(updatedOfficer.getEmail());
        officer.setPhoneNo(updatedOfficer.getPhoneNo());
        officer.setLocation(updatedOfficer.getLocation());
        officer.setAge(updatedOfficer.getAge());
        officer.setGender(updatedOfficer.getGender());
        officer.setDepartment(updatedOfficer.getDepartment());
        officerRepository.save(officer);
        return "Profile updated successfully";
    }
    
    
    
    
    
    
}
